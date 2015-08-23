var friends = {

    friendList: null,
    friendListView: null,

    initialize:function() {
        this.buildFriendList();
        this.buildPendingList();
        this.setupHandlers();
    },

    setupHandlers:function(){
        $("#add-friends-button").click(function(){
            $("#add-friends-prompt").css("display",function(){
                if ($(this).css("display") === "none"){
                    return "block"
                }else{
                    return "none"
                }
            });
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
                            if (me.get("friends").indexOf(result.id) == -1 && me.get("pending_friends").indexOf(result.id) == -1){
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
    console.log("A");
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
                $("#friend-list-display").append(friends.friendListView.el);
            },
            error: function(e) {
                console.dir(e);
            }
        });
    });
},

};
