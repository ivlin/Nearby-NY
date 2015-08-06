 var app = {

   PARSE_APP : "bFpMdQLKzOXnYH7r9wdRRME4JmsZ4oxSae2YrH84",
   PARSE_JS : "T5dQgHMRBck7xs3Dws2tmhJylLabXaOzebAfVTsg",
   viewframes : [document.getElementById("view-signin"), document.getElementById("view-signup"), document.getElementById("view-trending")], 
   Event: null,//Parse.Object.extend("Event"),
   eventList: null,

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        this.onDeviceReady();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'

    onDeviceReady: function() {
//        Parse.initialize(this.PARSE_APP, this.PARSE_JS);
        Event = Parse.Object.extend("Event");

        EventList = Parse.Collection.extend({
            model: Event
        });

        EventListView = Parse.View.extend({
            template:Handlebars.compile(document.getElementById("event-list").innerHTML),
            render:function(){
                var collection = {event: this.collection.toJSON()};

                //collection.event = sortByKey(collection.event, "title", true);

                this.$el.html(this.template(collection));
            }
        });

        eventList = new EventList();

        eventList.fetch({success:function(eventList){ //calls twice
            var eventListView = new EventListView({ collection: eventList });
            eventListView.render();
            //document.getElementById("event-list-display").replaceChild(eventListView.el);
            $('#event-list-display').html(eventListView.el);  
        }, error:function(error){
            console.dir(error);
        }
    });

        this.signinPage.setupSignin();
        this.signupPage.setupSignup();
        this.setupLinks();
    },

    setupLinks: function(){
        var viewframes = app.viewframes;
        var temp = document.getElementsByTagName("button");
        for (var i = 0; i  < temp.length; i++){
            switch (temp[i].getAttribute("class")){
                case "goto-trending":
                temp[i].addEventListener("click", function(){
                    for (var x = 0; x < viewframes.length; x++){
                        viewframes[x].style.display = "none";
                    }
                    document.getElementById("view-trending").style.display = "inline";
                });
                break;
                case "goto-signup":
                temp[i].addEventListener("click", function(){
                    for (var x = 0; x < viewframes.length; x++){
                        viewframes[x].style.display = "none";
                    }
                    document.getElementById("view-signup").style.display = "inline";
                });
                break;
                case "goto-signin":
                temp[i].addEventListener("click", function(){
                    for (var x = 0; x < viewframes.length; x++){
                        viewframes[x].style.display = "none";
                    }
                    document.getElementById("view-signin").style.display = "inline";
                });
                break;
                case "goto-maps":
                temp[i].addEventListener("click", function(){
                    location.href = "gmap.html";
                });
                default:
                break;
            }
        }
    },

    signupPage: {
       setupSignup: function(){
        var temp;
        temp = document.getElementById("signup-button");
        if (temp !== null){
            temp.addEventListener("click", function(e){
                var formName = document.getElementById("signup-username").value;
                var formPass = document.getElementById("signup-password").value;
                var formConfirmPass = document.getElementById("signup-confirm-password").value;
                var formEmail = document.getElementById("signup-email").value;
                if (formName !== "" && formEmail !== "" && formPass !== "" && formConfirmPass === formPass){

                    e.preventDefault();
                    Parse.User.signUp(formName, formPass, {},{
                        success:function(result){
                            console.log("success");
                            document.getElementById("signup-status").innerHTML = "Registration successful";
                        },
                        error:function(error){
                            console.dir(error);
                            document.getElementById("signup-status").innerHTML = "Username already taken<br>Try again";
                        }
                    });
                }else{
                    console.log(formName + " " + formEmail + " " + formPass + " " + formConfirmPass);
                    document.getElementById("signup-status").innerHTML = "Form incorrectly filled";
                }
            });
            }
        } 
    },

    signinPage: {
        setupSignin: function(){
            var temp = document.getElementById("signin-button");
            if (temp !== null){
                temp.addEventListener("click", function(e){
                    var formName = document.getElementById("signin-username").value;
                    var formPass = document.getElementById("signin-password").value;
                    if (formName !== "" && formPass !== ""){
                        e.preventDefault();
                        Parse.User.logIn(formName, formPass, {
                            success:function(result){
                                for (var x = 0; x < app.viewframes.length; x++){
                                    app.viewframes[x].style.display = "none";
                                }
                                document.getElementById("view-trending").style.display = "inline";
                            },
                            error:function(error){
                                document.getElementById("signin-status").innerHTML = "Failed to sign in";
                            }
                        });
                    }
                });
            }
        }
    },

    trendingPage: {
        sortByKey: function(array, key, ascending) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                var diff = ((x < y) ? -1 : ((x > y) ? 1 : 0));
                return ascending ? diff : -1 * diff;
            }); 
        }
/*
        EventListView: Parse.View.extend({
            template:Handlebars.compile(document.getElementById("event-list").innerHTML),
            render:function(){
                var collection = {event: this.collection.toJSON()};

                collection.event = sortByKey(collection.event, "title", true);

                this.$el.html(this.template(collection));
            }
        });*/
    }

};
