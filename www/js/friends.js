var friends = {

    friendList:null,
    friendListView:null,

    buildList: function() {
        FriendList = Parse.Collection.extend({
            model: Parse.User,
        });

        FriendListView = Parse.View.extend({
            data:null,
            collection:null,
            template:Handlebars.compile(document.getElementById("friend-list-tpl").innerHTML),
            render:function() {
                this.el.innerHTML = this.template(this.collection);
            }
        });

        var friendIds = Parse.User.current().get("friends");
        var query = new Parse.Query(Parse.User);
        query.containedIn("objectId",friendIds);
        query.find({success:function(r){
            for (var i = 0; i < r.length; r++){
                r[i] = r[i].toJSON();
            }
            friends.friendListView = new FriendListView();
            friends.friendListView.collection = r;
            friends.friendListView.render();
            console.log(friends.friendListView.el);
            $("#friend-list-display").append(friends.friendListView.el);

        },error:function(e){
            console.dir(e);
        }});


    },

};  