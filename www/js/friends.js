var friends = {
    buildList: function() {
        FriendList = Parse.Collection.extend({
            model: Event
        }),

        this.friendList = new FriendList(),

        FriendListView = Parse.View.extend({
            template:Handlebars.compile(document.getElementById("friend-list-tpl").innerHTML),
            render:function() {
                var collection = {friend: this.collection.toJSON()};
                    this.el.innerHTML = this.template(collection);
                }
            });

        this.friendList.fetch({
            success:function(friendList) {
                var friendListView = new FriendListView({ collection: friendList });
                friendListView.render();
                document.getElementById("friend-list-display").appendChild(friendListView.el);
            },
            error:function(error) {
                console.dir(error);
            }
        });
    }
};