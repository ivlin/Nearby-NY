var app = {
    PARSE_APP: "bFpMdQLKzOXnYH7r9wdRRME4JmsZ4oxSae2YrH84",
    PARSE_JS: "T5dQgHMRBck7xs3Dws2tmhJylLabXaOzebAfVTsg",
    PARSE_CLIENT_KEY: "IpGeRpLHGk4nKWq7stcRCncwWjevg6AmlrEsPIHv",
    Event: null,
    EventList: null,

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        // document.addEventListener('deviceready', this.onDeviceReady, false);
        this.onDeviceReady();

        $(".button-collapse").sideNav();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        this.initParse();
        login.initialize();
        trending.initialize();
        this.setupLinks();
        $("#view-map").show();
        map.initialize();
        $("#view-map").hide();

        if (Parse.User.current()) {
            $("#view-trending").css("display", "block");
        } else {
            $("#view-signin").css("display", "block");
        }
    },

    initParse: function() {
        Parse.initialize(this.PARSE_APP, this.PARSE_JS);

        parsePlugin.initialize(this.PARSE_APP, this.PARSE_CLIENT_KEY, function() {
          Materialize.toast("Registered with PARSE",500);
        }, function(e) {
            alert('error');
        });

        Event = Parse.Object.extend("Event");
        EventList = Parse.Collection.extend({
            model: Event
        });

        PendingFriendList = Parse.Collection.extend({
            model: Parse.User,
        });
        PendingFriendListView = Parse.View.extend({
            data: null,
            template: Handlebars.compile(document.getElementById("pending-friends-tpl").innerHTML),
            render: function() {
                this.data = {
                    friend: this.collection
                };
                this.el.innerHTML = this.template(this.data);
            }
        });

        FriendList = Parse.Collection.extend({
            model: Parse.User,
        });
        FriendListView = Parse.View.extend({
            data: null,
            template: Handlebars.compile(document.getElementById("friend-list-tpl").innerHTML),
            render: function() {
                this.data = {
                    friend: this.collection
                };
                this.el.innerHTML = this.template(this.data);
            }
        });

        Mailbox = Parse.Object.extend("Mailbox");
        FriendRequestList = Parse.Collection.extend({
            model: Parse.User
        });
        FriendRequestView = Parse.View.extend({
            data: null,
            template: Handlebars.compile(document.getElementById("friend-request-tpl").innerHTML),
            render: function() {
                this.data = {
                    request: this.collection
                };
                this.el.innerHTML = this.template(this.data);
            }
        });

        CalendarView = Parse.View.extend({
            data: null,
            template: Handlebars.compile(document.getElementById("calendar-list-tpl").innerHTML),
            render: function() {
                this.data = {
                    event: this.collection
                };
                this.el.innerHTML = this.template(this.data);
            }
        });

        EventListView = Parse.View.extend({
            data: null,
            el: null,
            template: Handlebars.compile($("#event-list-tpl").html()),
            render: function() {
                this.data = {
                    event: this.collection
                };
                for (var i = 0; i < this.data.event.length; i++) {
                    this.data.event[i] = this.data.event[i].toJSON();
                    this.data.event[i].isUserAttending = Parse.User.current() && 
                    this.data.event[i].to_attend.indexOf(Parse.User.current().id) >= 0;
                    this.data.event[i].to_attend = this.data.event[i].to_attend.length;
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
                        this.data.event = this.sortByKey(this.data.event, "time", false);
                        break;
                    case "title":
                        this.data.event = this.sortByKey(this.data.event, "title", true);
                        break;
                    case "popular":
                    default:
                        this.data.event = this.data.event.sort(function(a, b) {
                            var x = a['to_attend'];
                            var y = b['to_attend'];
                            var diff = ((x < y) ? -1 : ((x > y) ? 1 : 0));
                            return -1 * diff;
                        });
                        console.log(this.data.event);
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

        });//end of eventlistview
    },

    setupLinks: function() {
        var buttons = document.querySelectorAll(".goto-trending , .goto-signup , .goto-map , .goto-signin , .goto-profile, .goto-friends, .signout");
        for (var i = 0; i < buttons.length; i++) {
            switch (buttons[i].getAttribute("class")) {
                case "goto-trending":
                    $(buttons[i]).click(function() {
                        $('.button-collapse').sideNav('hide');
                        $(".sidebar-button").removeClass("grey lighten-4");
                        $("#sidebar-trending").addClass("grey lighten-4");
                        controller.changeViewTo("view-trending");
                    });
                    break;
                case "goto-signup":
                    $(buttons[i]).click(function() {
                        $('.button-collapse').sideNav('hide');
                        controller.changeViewTo("view-signup");
                    });
                    break;
                case "goto-signin":
                    $(buttons[i]).click(function() {
                        $('.button-collapse').sideNav('hide');
                        controller.changeViewTo("view-signin");
                    });
                    break;
                case "goto-map":
                    $(buttons[i]).click(function() {
                        $('.button-collapse').sideNav('hide');
                        $(".sidebar-button").removeClass("grey lighten-4");
                        $("#sidebar-map").addClass("grey lighten-4");
                        controller.changeViewTo("view-map");
                        map.initialize();
                        google.maps.event.trigger(map.map, 'resize');
                    });
                    break;
                case "goto-profile":
                    $(buttons[i]).click(function() {
                        if (Parse.User.current()) {
                            $('.button-collapse').sideNav('hide');
                            $(".sidebar-button").removeClass("grey lighten-4");
                            $("#sidebar-profile").addClass("grey lighten-4");
                            controller.changeViewTo("view-profile");
                            profile.initialize();
                        } else {
                            Materialize.toast('<span>Please sign in to view your profile.</span>', 1000);
                        }

                    });
                    break;
                case "goto-friends":
                    $(buttons[i]).click(function() {
                      if (Parse.User.current()){
                        $('.button-collapse').sideNav('hide');
                        $(".sidebar-button").removeClass("grey lighten-4");
                        $("#sidebar-friends").addClass("grey lighten-4");
                        controller.changeViewTo("view-friends");
                        friends.initialize();
                      } else {
                        Materialize.toast('<span>Please sign in to view your friends page.</span>', 1000);
                      }
                    });
                    break;
                case "signout":
                    $(buttons[i]).click(function() {
                        if (Parse.User.current()) {
                            Parse.User.logOut();
                            
                            fblogout();
                            parsePlugin.getInstallationId(function(id) {
                              var query = new Parse.Query(Parse.Installation);
                              query.equalTo("installationId", id);
                              query.first().then(function(i) {
                                i.set("userId", null);
                                i.save();
                              });
                            }, function(e) {
                              console.log(e);
                            });

                        }
                        controller.changeViewTo("view-signin");
                    });
                    break;
                default:
                    break;
            }
        }
    },
};
