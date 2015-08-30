var friends = {

    editMode:false,
    selected:[],
    friendList: null,
    friendListView: null,

    initialize:function() {
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
                                me.save();
                                friends.buildPendingList();
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

};
