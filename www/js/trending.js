var trending = {

    eventList: null,
    eventListView: null,

    initialize: function() {
        trending.setupHandlers();
        EventListView = Parse.View.extend({
            data: null,
            el: null,
            template: Handlebars.compile($("#event-list-tpl").html()),
            render: function() {
                this.data = {
                    event: this.collection
                };
                for (var i = 0; i < this.data.event.length; i++) {
                    this.data.event[i].time = trending.buildDateString(this.collection[i].time.iso);
                    this.data.event[i].upvotes = this.data.event[i].upvotes.length;
                    this.data.event[i].downvotes = this.data.event[i].downvotes.length;
                }

                this.organizeList("");
                this.setupScrollEffects();
            },

            setupScrollEffects: function() {
                var titleOffsetTop = -200;
                $(window).scroll(function() {
                    var scroll = $(window).scrollTop();
                    if (scroll <= 200) {
                        var offset = '-' + (scroll + 20) + 'px';
                        $('#event-info-body').animate({
                            'margin-top': offset
                        }, 1);
                    }
                });
            },

            organizeList: function(mode) {
                switch (mode.toLowerCase()) {
                    case "cost":
                        this.data.event = this.sortByKey(this.data.event, "cost", true);
                        break;
                    case "date":
                        this.data.event = this.sortByKey(this.data.event, "time", true);
                        break;
                    case "title":
                        this.data.event = this.sortByKey(this.data.event, "title", true);
                        break;
                    case "popular":
                    default:
                        this.data.event = this.data.event.sort(function(a, b) {
                            var x = a["to_attend"].length;
                            var y = b["to_attend"].length;
                            var diff = ((x < y) ? -1 : ((x > y) ? 1 : 0));
                            return -1 * diff;
                        });
                        break;
                }

                this.el.innerHTML = this.template(this.data);
                var cards = this.el.getElementsByClassName("event-card");

                function renderEventPage(id) {
                    $('.button-collapse').sideNav('hide');
                    info.drawEventPage(id, "view-trending");
                }

                for (var i = 0; i < cards.length; i++) {
                    renderFunc = renderEventPage.bind(this, cards[i].id);
                    cardImg = $(cards[i]).find("img");
                    cardImg.first().click(renderFunc);
                }
            },

            sortByKey: function(array, key, ascending) {
                return array.sort(function(a, b) {
                    var x = a[key];
                    var y = b[key];
                    var diff = ((x < y) ? -1 : ((x > y) ? 1 : 0));
                    return ascending ? diff : -1 * diff;
                });
            },

        });

        this.buildList();

    }, //end init

    buildList: function() {
        this.eventList = new EventList(),
            trending.drawList();
    },

    buildDateString: function(epoch) {
        var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        date = new Date(epoch);
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        minutes = date.getMinutes();
        minutes = minutes < 10 ? "0" + minutes : minutes;
        am_pm = date.getHours() >= 12 ? "AM" : "PM";

        dateStr = '';
        dateStr += days[date.getDay()] + ", ";
        dateStr += months[date.getMonth()] + " ";
        dateStr += date.getDate() + ", ";
        dateStr += date.getFullYear() + " \n";
        dateStr += (date.getHours() % 12) + ":";
        dateStr += minutes + am_pm + " (EST)";

        return dateStr;
    },

    drawList: function() {
        var query = new Parse.Query(Event);
        var today = new Date();
        query.greaterThanOrEqualTo("time", today);
        query.find({
            success: function(eventList) {
                for (var i = 0; i < eventList.length; i++) {
                    eventList[i] = eventList[i].toJSON();
                }
                trending.eventListView = new EventListView({
                    collection: eventList
                });
                trending.eventListView.render();
                $("#event-list-display").append(trending.eventListView.el);
            },
            error: function(error) {
                console.dir(error);
            }
        });
        /*trending.eventList.fetch({success:function(eventList){
        trending.eventListView = new EventListView({ collection: eventList.toJSON()});
        console.log(trending.eventListView.collection);
        trending.eventListView.render();
        $("#event-list-display").append(trending.eventListView.el);
    }, error:function(error){
      console.dir(error);
  }
});*/
    },

    reorderList: function(mode) {
        trending.eventListView.organizeList(mode);
    },

    setupHandlers: function() {

        $("#reorder-mode-preference").click(function() {
            //var tags = Parse.User.current().toJSON().tags;
            var a = Parse.User.current().get("tags");
            console.log(a);
            //console.log(tags);
            var query = new Parse.Query(Event);
            query.containedIn("tags", a);
            query.find({
                success: function(r) {
                    for (var i = 0; i < r.length; i++) {
                        r[i] = r[i].toJSON();
                    }
                    var tempEventListView = new EventListView({
                        collection: r
                    });
                    tempEventListView.render();
                    $("#event-list-display").empty().append(tempEventListView.el);
                },
                error: function(e) {
                    console.log(e);
                }
            });
        });

        var modeOptions = $(".reorder-mode");
        for (var i = 0; i < modeOptions.length; i++) {
            modeOptions[i].addEventListener("click", function() {
                $("#event-list-display").empty().append(trending.eventListView.el);
                trending.reorderList(this.innerHTML);
            });
        }

        $("#search-trending").click(function() {
            $("#search-close").css('visibility', 'visible');
            var searchTerm = $("#search").val();
            var tagQuery = new Parse.Query(Event);
            tagQuery.equalTo("tags", searchTerm);
            var titleQuery = new Parse.Query(Event);
            titleQuery.contains("title", searchTerm);
            var descQuery = new Parse.Query(Event);
            descQuery.contains("description", searchTerm);
            var addQuery = new Parse.Query(Event);
            addQuery.contains("address", searchTerm);
            var query = Parse.Query.or(tagQuery, titleQuery, descQuery, addQuery);
            query.find({
                success: function(r) {
                    for (var i = 0; i < r.length; i++) {
                        r[i] = r[i].toJSON();
                    }
                    var tempEventListView = new EventListView({
                        collection: r
                    });
                    tempEventListView.render();
                    $("#event-list-display").empty().append(tempEventListView.el);
                },
                error: function(e) {
                    console.log(e);
                }
            });
        });

        $("#search-close").click(function() {
            $(this).css('visibility', 'hidden');
            $("#event-list-display").empty().append(trending.eventListView.el);
        });
    }

};
