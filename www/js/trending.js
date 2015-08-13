var trending = {
    initialize: function () {
        buildList();
    },

    sortByKey: function(array, key, ascending) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            var diff = ((x < y) ? -1 : ((x > y) ? 1 : 0));
            return ascending ? diff : -1 * diff;
        }); 
    },

    drawPage: function(id) {
        drawEventPage(id);
    }
};

 function buildList () {
    EventList = Parse.Collection.extend({
        model: Event
    }),

    eventList = new EventList(),

    EventListView = Parse.View.extend({
        template:Handlebars.compile($("#event-list-tpl").html()),
        render:function() {
            var collection = {event: this.collection.toJSON()};
                //this.collection.event = sortByKey(collection.event, "title", true);
                this.el.innerHTML = this.template(collection);
                //this.$el.html(this.template(collection));
                var cards = this.el.getElementsByClassName("event-card");

                function renderEventPage(id) {
                    drawEventPage(id);
                }
                for (var i = 0; i < cards.length; i++){
                    renderFunc = renderEventPage.bind(this, cards[i].id);
                    cardImg = $(cards[i]).find("img");
                    cardImg.first().click(renderFunc);
                }
            }
        });

    eventList.fetch({
        success:function(eventList) {
            var eventListView = new EventListView({ collection: eventList });
            eventListView.render();
            document.getElementById("event-list-display").appendChild(eventListView.el);
        },
        error:function(error) {
            console.dir(error);
        }
    });
}

function drawEventPage(objectId) {
    var eventObject, eventPageDisplay;
    var query = new Parse.Query(Event);

    query.get(objectId,{
        success: function(result) {
            eventObject = result;
            eventPageDisplay = new EventPageView();
            eventPageDisplay.render(result);
            controller.changeViewTo("view-event");
            $("#view-event").html(eventPageDisplay.htmlData);
        },
        error: function(error) {
            console.dir(error);
        }
    });

    EventPageView = Parse.View.extend({
        htmlData:null,
        template:Handlebars.compile($("#event-view-tpl").html()),
        render:function(data) {
            var jsondata = data.toJSON();
            jsondata.time = ((Date)(jsondata.time)).toString();
            this.htmlData= this.template(jsondata);
        }
    });
}