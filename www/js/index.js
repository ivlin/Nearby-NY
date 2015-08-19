var app = {
    PARSE_APP: "bFpMdQLKzOXnYH7r9wdRRME4JmsZ4oxSae2YrH84",
    PARSE_JS: "T5dQgHMRBck7xs3Dws2tmhJylLabXaOzebAfVTsg",
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
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        this.onDeviceReady();

        $(".button-collapse").sideNav();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        this.initParse();
        //      this.signinPage.setupSignin();
        //   this.signupPage.setupSignup();
        // this.trendingPage.setupTrending();
        login.initialize();
        friends.buildList();
        // map.initialize()
        //map.initialize();
        trending.initialize();
        this.setupLinks();

        if (Parse.User.current()) {
            $("#view-trending").css("display", "inline");
        } else {
            $("#view-signin").css("display", "inline");
        }
    },

    initParse: function() {
        Parse.initialize(this.PARSE_APP, this.PARSE_JS);
        Event = Parse.Object.extend("Event");
        EventList = Parse.Collection.extend({
            model: Event
        });
    },

    setupLinks: function() {
        var buttons = document.querySelectorAll(".goto-trending , .goto-signup , .goto-map , .goto-signin , .goto-profile, .goto-friends, .signout");
        for (var i = 0; i < buttons.length; i++) {
            switch (buttons[i].getAttribute("class")) {
                case "goto-trending":
                    $(buttons[i]).click(function() {
                        controller.changeViewTo("view-trending");
                    });
                    break;
                case "goto-signup":
                    $(buttons[i]).click(function() {
                        controller.changeViewTo("view-signup");
                    });
                    break;
                case "goto-signin":
                    $(buttons[i]).click(function() {
                        controller.changeViewTo("view-signin");
                    });
                    break;
                case "goto-map":
                    $(buttons[i]).click(function() {
                        controller.changeViewTo("view-map");
                        map.initialize();
                    });
                    break;
                case "goto-profile":
                    $(buttons[i]).click(function() {
                        if (Parse.User.current()) {
                            controller.changeViewTo("view-profile");
                            profile.initialize();
                        }
                    });
                    break;
                case "goto-friends":
                  $(buttons[i]).click(function() {
                    controller.changeViewTo("view-friends");
                  });
                break;    
                case "signout":
                    buttons[i].addEventListener("click", function() {
                        Parse.User.logOut();
                        controller.changeViewTo("view-signin");
                        //       app.profilePage.setupProfilePage();                        
                    });
                    break;
                default:
                    break;
            }
        }
    },

    drawEventPage: function(objectId) {
        var eventObject, eventPageDisplay;
        var query = new Parse.Query(Event);

        query.get(objectId, {
            success: function(result) {
                eventObject = result;
                //     console.log(eventObject);
                eventPageDisplay = new EventPageView();
                eventPageDisplay.render(result);
                controller.changeViewTo("view-event");
                document.getElementById("view-event").innerHTML = eventPageDisplay.htmlData;

                //New stuff                
                var upData = result.toJSON();

                function addMeToArray(attr) {
                    if (Parse.User.current()) {
                        upData[attr].push(Parse.User.current().id);
                        result.save(upData, {
                            success: function(r) {
                                console.log("successfully updated array");
                            },
                            error: function(e) {
                                console.log("failed to update array")
                            }
                        });
                    }
                };

                function removeMeFromArray(attr) {
                    if (Parse.User.current()) {
                        var ind = findMeInArray(attr);
                        if (ind !== -1) {
                            upData[attr].splice(ind, 1);
                            result.save(upData, {
                                success: function(r) {
                                    console.log("successfully updated array");
                                },
                                error: function(e) {
                                    console.log("failed to update array")
                                }
                            });
                        }
                    }
                }

                function findMeInArray(attr) {
                    if (Parse.User.current()) {
                        return upData[attr].indexOf(Parse.User.current().id);
                    }
                    return -1; //guest
                }

                $("#event-reserve").click(function() {
                    if (findMeInArray("to_attend") === -1) {
                        addMeToArray("to_attend");
                    } else {
                        removeMeFromArray("to_attend");
                    }
                });

                $("#event-checkin").click(function() {
                    if (findMeInArray("attended") === -1) {
                        addMeToArray("attended");
                    } else {
                        removeMeFromArray("attended");
                    }

                });

                $("#event-upvote").click(function() {
                    if (findMeInArray("upvotes") === -1) {
                        addMeToArray("upvotes");
                        removeMeFromArray("downvotes");
                    } else {
                        removeMeFromArray("upvotes");
                    }
                });

                $("#event-downvote").click(function() {
                    if (findMeInArray("downvotes") === -1) {
                        addMeToArray("downvotes");
                        removeMeFromArray("upvotes");
                    } else {
                        removeMeFromArray("downvotes");
                    }
                });

                //
                $("#goto-last").click(function() {
                    controller.changeViewTo(lastPage);
                });

                parallax = $('.parallax').parallax();

            },
            error: function(error) {
                console.dir(error);
            }
        });

        EventPageView = Parse.View.extend({
            htmlData: null,
            template: Handlebars.compile(document.getElementById("event-view-tpl").innerHTML),
            render: function(data) {
                var jsondata = data.toJSON();
                /*
      Apply transformations to data
>>>>>>> a49cef45e3700b8d9414686d20ff97b0dcb7451c
          */
                jsondata.time = new Date(jsondata.time.iso);
                this.htmlData = this.template(jsondata);

            }
        });


    },

};
