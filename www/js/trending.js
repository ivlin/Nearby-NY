var trending = {

    eventList: null,
    eventListView: null,

    initialize: function() {
        trending.setupHandlers();


        this.buildList();

    }, //end init

    buildList: function() {
        this.eventList = new EventList();
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
        dateStr += minutes + am_pm;// + " (EST)";

        return dateStr;
    },

    drawList: function() {
        var query = new Parse.Query(Event);
        var today = new Date();
        query.greaterThanOrEqualTo("time", today);
        query.find({
            success: function(eventList) {
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
    },

    reorderList: function(mode) {
        trending.eventListView.organizeList(mode);
    },

    setupHandlers: function() {
        $("#reorder-mode-preference").click(function() {
            var a = Parse.User.current().get("tags");
            var query = new Parse.Query(Event);
            query.containedIn("tags", a);
            query.find({
                success: function(r) {
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

        $("#open-search").click(function(){
            if ($(this).html() == "search"){
                $(this).html("close");
                var bar = $(this).parents(".nav-wrapper");
                $(bar).find("#search-trending").css("margin-top","10px");
                $(bar).find("form").removeClass("hide-on-small-only");
                $(bar).find(".dropdown-button").hide();
            }else{
                $(this).html("search");
                var bar = $(this).parents(".nav-wrapper");
                $(bar).find("#search-trending").css("margin-top","0");
                $(bar).find("form").addClass("hide-on-small-only");
                $(bar).find(".dropdown-button").show();
                $("#event-list-display").empty().append(trending.eventListView.el);
            }
        });

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
                    // for (var i = 0; i < r.length; i++) {
                    //     r[i] = r[i].toJSON();
                    // }
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
            var bar = $(this).parents(".nav-wrapper");
            $(bar).find("form").addClass("hide-on-small-only");
            $(bar).find(".dropdown-button").show();
            $("#event-list-display").empty().append(trending.eventListView.el);
        });
    }

};
