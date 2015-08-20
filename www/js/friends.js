var friends = {

    friendList:null,
    friendListView:null,

    buildList: function() {
        FriendList = Parse.Collection.extend({
            model: Parse.User,
        });

        FriendListView = Parse.View.extend({
            data:null,
            template:Handlebars.compile(document.getElementById("friend-list-tpl").innerHTML),
            render:function() {
                this.data = {friend: this.collection};
                this.el.innerHTML = this.template(this.data);
            }
        });

        var friendIds = Parse.User.current().get("friends");
        var query = new Parse.Query(Parse.User);
        query.containedIn("objectId",friendIds);
        query.find({success:function(result){
            for (var i = 0; i < result.length; i++){
                result[i] = result[i].toJSON();
            }
            friends.friendListView = new FriendListView({collection:result});
            friends.friendListView.render();
            $("#friend-list-display").append(friends.friendListView.el);

        },error:function(e){
            console.dir(e);
        }});


    },

};  