var friends = {

    friendList:null,
    friendListView:null,

    buildList: function() {
        FriendList = Parse.Collection.extend({
            model: Parse.User,
        });

        Parse.User.current().fetch().then(function (u) {
            var uFriends = u.get('friends');
            var query = new Parse.Query(Parse.User);
            var friendObjects = [];
            
            query.find({
                success:function(r){
                    console.log(r);
                },
                error:function(e){
                    console.log(e);
                }
            })
            this.friendListView = new FriendListView();
            this.friendListView.friends = uFriends;
            this.friendListView.render();
            console.log(this.friendListView.el);
            $("#friend-list-display").append(this.friendListView.el);
        });

        FriendListView = Parse.View.extend({
            template:Handlebars.compile(document.getElementById("friend-list-tpl").innerHTML),
            render:function() {
                console.log(this.friends);
                this.el.innerHTML = this.template(this.friends);
            }
        });

  /*      this.friendList.fetch({
            success:function(friendList) {
                var friendListView = new FriendListView({ collection: friendList });
                friendListView.render();
                document.getElementById("friend-list-display").appendChild(friendListView.el);
            },
            error:function(error) {
                console.dir(error);
            }
        });
*/}
};  