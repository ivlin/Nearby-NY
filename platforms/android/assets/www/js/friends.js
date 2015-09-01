var friends = {

    editMode:false,
    selected:[],
    friendList: null,
    friendListView: null,

    initialize:function() {
        this.buildRequestList();//always run this before build friend and pending
        this.buildFriendList();
        this.buildPendingList();
        this.setupHandlers();
    },

    setupHandlers:function(){
        $("#add-friends-button").off("click");
        $("#remove-friends-button").off("click");
        $("#check-friend-id").off("click");

        $("#add-friends-button").click(function(){
            $("#add-friends-prompt").css("display",function(){
                if ($(this).css("display") === "none"){
                    return "block"
                }else{
                    return "none"
                }
            });
        });

        $("#remove-friends-button").click(function(){
            // e.stopPropagation();
            // console.log(!friends.editMode);
            if (friends.selected.length > 0){
                var self = new Parse.Query(Parse.User);
                self.get(Parse.User.current().id).then(function(me){
                    var newFriends = me.get("friends");
                    var newPending = me.get("pending_friends");

                    var query = new Parse.Query(Mailbox);
                    query.containedIn("ownerId",friends.selected);
                    query.find().then(function (result){
                        console.log(result);
                        for (var i = 0; i < result.length; i++){
                            var r = result[i].get("requests");
                            r.splice(r.indexOf(Parse.User.current().id), 1);
                            result[i].set("requests", r);
                            result[i].save();
                        }
                    });
                    
                    for (var i = 0; i < friends.selected.length; i++){
                        newPending.splice(newPending.indexOf(friends.selected[i]), 1);
                        newFriends.splice(newFriends.indexOf(friends.selected[i]), 1);
                    }
                    console.log(newFriends);
                    me.set("friends",newFriends);
                    me.save().then(function(){
                        friends.buildFriendList();
                        friends.buildPendingList();
                    });                        
                    friends.selected=[];
                });
            }
            friends.editMode = !friends.editMode;
        });

        $("#check-friend-id").click(function(){
            var usernameQuery = new Parse.Query(Parse.User);
            usernameQuery.equalTo("username",$("#friend-id").val());
            var emailQuery = new Parse.Query(Parse.User);
            emailQuery.equalTo("email",$("#friend-id").val());
            var query = Parse.Query.or(usernameQuery, emailQuery);
            query.first({
                success:function(result){
                    //ideally send the other user a friend request
                    var self = new Parse.Query(Parse.User);
                    self.get(Parse.User.current().id,{
                        success:function(me){
                            if (result === undefined){
                                console.log($("add-friend-prompt-status"));
                            }else if (me.get("friends").indexOf(result.id) == -1 && me.get("pending_friends").indexOf(result.id) == -1){
                                $("#add-friend-prompt-status").html("Successfully sent friend request");
                                var newPending = me.get("pending_friends");
                                newPending.push(result.id);
                                me.set("pending_friends",newPending);
                                me.save().then(function(){
                                    friends.buildPendingList();
                                });

                                result.get("mailbox").fetch().then(function(mailbox){
                                    var mail = mailbox.get("requests");
                                    mail.push(me.id);
                                    mailbox.set("requests",mail);
                                    mailbox.save();
                                })
                                
                            }else{
                                $("#add-friend-prompt-status").html("User is already a registered or pending friend");
                            }
                        }
                    });

                },error:function(result,error){
                    console.log(error);
                    $("add-friend-prompt-status").html("Failed to retrieve user with that id");
                }
            });
        });
    },

    buildPendingList:function() {
        var query = new Parse.Query(Parse.User);
        query.get(Parse.User.current().id).then(function(me){
            var pendingList = me.get("pending_friends");
            var pendingQuery = new Parse.Query(Parse.User);
            pendingQuery.containedIn("objectId",pendingList);
            pendingQuery.find({
                success: function(result) {
                    for (var i = 0; i < result.length; i++) {
                        result[i] = result[i].toJSON();
                    }
                    var pendingListView = new PendingFriendListView({
                        collection: result
                    });
                    pendingListView.render();
                    $("#pending-list-display").empty().append(pendingListView.el);

                    $(".avatar").off("click");
                    $(".avatar").click(function (evt){
                        if (friends.editMode){
                            if ($(this).hasClass("grey lighten-2")){
                                $(this).removeClass("grey lighten-2");
                                friends.selected.splice(friends.selected.indexOf($(this).attr("id")),1);
                            }else{
                                $(this).addClass("grey lighten-2");
                                friends.selected.push($(this).attr("id"));
                            }
                        }
                    });

                },
                error: function(e) {
                    console.dir(e);
                }
            });
        });
    },

    buildFriendList: function() {
        var query = new Parse.Query(Parse.User);
        query.get(Parse.User.current().id).then(function(me){
            var friendList = me.get("friends");
            console.log(friendList);
            var friendQuery = new Parse.Query(Parse.User);
            friendQuery.containedIn("objectId",friendList);
            friendQuery.find({
                success: function(result) {
                    for (var i = 0; i < result.length; i++) {
                        result[i] = result[i].toJSON();
                    }
                    friends.friendListView = new FriendListView({
                        collection: result
                    });
                    friends.friendListView.render();
                    $("#friend-list-display").empty().append(friends.friendListView.el);
                    $(".avatar").off("click");
                    $(".avatar").click(function (evt){
                        if (!friends.editMode){
                            $(this).next(".expanded-avatar").slideToggle();
                        }else{
                            if ($(this).hasClass("grey lighten-2")){
                                $(this).removeClass("grey lighten-2");
                                friends.selected.splice(friends.selected.indexOf($(this).attr("id")),1);
                            }else{
                                $(this).addClass("grey lighten-2");
                                friends.selected.push($(this).attr("id"));
                            }
                        }
                    });
                },
                error: function(e) {
                    console.dir(e);
                }
            });
        });
    },

    buildRequestList: function(){
        Parse.User.current().fetch().then(function (me){
            me.get("mailbox").fetch().then(function (mailbox){
                //updates list to check for accepted friend requests
                var pending = me.get("pending_friends");
                var requests = mailbox.get("requests");
                for (var i = 0; i < requests.length; i++){
                    if (pending.indexOf(requests[i]) >= 0){
                        //add as friend
                        var friends = me.get("friends");
                        friends.push(requests[i]);
                        me.set("friends",friends);
                        me.save();
                        //take off pending
                        pending.splice(pending.indexOf(requests[i]));
                        me.set("pending_friends",pending);
                        me.save();
                        //delete request
                        requests.splice(i,1);
                        mailbox.set("requests",requests);
                        mailbox.save();
                        i--;
                    }
                }
                //draw the list
                var query = new Parse.Query(Parse.User);
                query.containedIn("objectId",mailbox.get("requests"));
                query.find().then(function (result){
                    for (var i = 0; i < result.length; i++) {
                        result[i] = result[i].toJSON();
                    }
                    var friendRequestView = new FriendRequestView({
                        collection: result
                    });
                    friendRequestView.render();
                    $("#friend-requests-display").empty().append(friendRequestView.el);
                    $(".accept-request").click(function(){
                        //send request to friend
                        var mailQuery = new Parse.Query(Mailbox);
                        mailQuery.equalTo("ownerId", $(this).parent().attr("id"));
                        mailQuery.first().then(function (box){
                            console.log(box);
                            var tempReq = box.get("requests");
                            tempReq.push(Parse.User.current().id);
                            box.set("requests", tempReq);
                            console.log(tempReq);
                            box.save();
                        });        
                        //remove from requests
                        var mail = mailbox.get("requests");
                        mail.splice(mail.indexOf($(this).parent().attr("id")),1);
                        mailbox.set("requests",mail);
                        mailbox.save();
                        friends.buildRequestList();
                        //add to friends list
                        var tempFriends = me.get("friends");
                        tempFriends.push($(this).parent().attr("id"));
                        me.set("friends",tempFriends);
                        me.save();
                        //update page
                        friends.buildRequestList();
                        friends.buildFriendList();
                    });
                    $(".delete-request").click(function(){
                        var mail = mailbox.get("requests");
                        mail.splice(mail.indexOf($(this).parent().attr("id")),1);
                        mailbox.set("requests",mail);
                        mailbox.save();
                        friends.buildRequestList();
                    });
                });
            });
        });
    },

};
