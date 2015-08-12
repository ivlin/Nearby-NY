 var app = {

     PARSE_APP : "bFpMdQLKzOXnYH7r9wdRRME4JmsZ4oxSae2YrH84",
     PARSE_JS : "T5dQgHMRBck7xs3Dws2tmhJylLabXaOzebAfVTsg",
     viewframes : [document.getElementById("view-signin"), document.getElementById("view-signup"), document.getElementById("view-trending"),
     document.getElementById("view-map"), document.getElementById("view-event"), document.getElementById("view-profile")], 
     lastPage:null,
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
        this.initParse();
        this.signinPage.setupSignin();
        this.signupPage.setupSignup();
        this.trendingPage.setupTrending();
        this.setupLinks();
        if (Parse.User.current()){
            document.getElementById("view-trending").style.display = "inline";
        }else{
            document.getElementById("view-signin").style.display = "inline";
        }
    },

    initParse: function(){
        Parse.initialize(this.PARSE_APP, this.PARSE_JS);

        Event = Parse.Object.extend("Event");

        EventList = Parse.Collection.extend({
            model: Event
        });
    },

    setupLinks: function(){
        var temp = document.querySelectorAll(".goto-trending , .goto-signup , .goto-map , .goto-signin , .goto-profile, .signout");
        for (var i = 0; i  < temp.length; i++){
            switch (temp[i].getAttribute("class")){
                case "goto-trending":
                temp[i].addEventListener("click", function(){
                    app.changeViewTo("view-trending");
                });
                break;
                case "goto-signup":
                temp[i].addEventListener("click", function(){
                    app.changeViewTo("view-signup");
                });
                break;
                case "goto-signin":
                temp[i].addEventListener("click", function(){
                    app.changeViewTo("view-signin");
                });
                break;
                case "goto-map":
                temp[i].addEventListener("click", function(){
                    app.changeViewTo("view-map");        
                    app.mapPage.initialize();
                });
                break;
                case "goto-profile":
                temp[i].addEventListener("click", function(){
                    if (Parse.User.current()){
                        app.changeViewTo("view-profile");
                        app.profilePage.setupProfilePage();
                    }                    
                });
                break;
                case "signout":
                temp[i].addEventListener("click", function(){
                    Parse.User.logOut();
                    app.changeViewTo("view-signin");
                    app.profilePage.setupProfilePage();                        
                })
                break;
                default:
                break;
            }
        }
    },

    changeViewTo: function(viewId){
        for (var i = 0; i < this.viewframes.length; i++){
            this.viewframes[i].style.display = "none";
        }
        document.getElementById(viewId).style.display = "inline";
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
                            document.getElementById("signup-status").innerHTML = "Registration successful";
                        },
                        error:function(error){
                            console.dir(error);
                            document.getElementById("signup-status").innerHTML = "Username already taken<br>Try again";
                        }
                    });
                }else{
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

drawEventPage: function(objectId){
    var eventObject, eventPageDisplay;
    var query = new Parse.Query(Event);

    query.get(objectId,{
        success: function(result){
            eventObject = result;
       //     console.log(eventObject);
       eventPageDisplay = new EventPageView();
       eventPageDisplay.render(result);
       app.changeViewTo("view-event");
       document.getElementById("view-event").innerHTML = eventPageDisplay.htmlData;
       
       document.getElementById("goto-last").addEventListener("click", function (){
        console.log(lastPage);
        app.changeViewTo(lastPage);
    });

   },
   error: function(error){
    console.dir(error);
}
});

    EventPageView = Parse.View.extend({
        htmlData:null,
        template:Handlebars.compile(document.getElementById("event-view-tpl").innerHTML),
        render:function(data){
            var jsondata = data.toJSON();

            /*
Apply transformations to data
*/
         jsondata.time = ((Date)(jsondata.time)).toString();//toDateString() + " " + jsondata.time.toTimeString();
         this.htmlData= this.template(jsondata);
     }
 });


},

trendingPage: {

    sortByKey: function(array, key, ascending) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            var diff = ((x < y) ? -1 : ((x > y) ? 1 : 0));
            return ascending ? diff : -1 * diff;
        }); 
    },

    setupTrending: function (){
       this.buildList();
   },

   buildList: function() {
    EventList = Parse.Collection.extend({
        model: Event
    }),

    this.eventList = new EventList(),

    EventListView = Parse.View.extend({
        template:Handlebars.compile(document.getElementById("event-list-tpl").innerHTML),
        render:function(){
            var collection = {event: this.collection.toJSON()};
                //this.collection.event = sortByKey(collection.event, "title", true);
                this.el.innerHTML = this.template(collection);
                //this.$el.html(this.template(collection));
                var cards = this.el.getElementsByClassName("event-card");

                function renderEventPage(id) {
                    lastPage = "view-trending";
                    app.drawEventPage(id);
                }

                for (var i = 0; i < cards.length; i++){
                    renderFunc = renderEventPage.bind(this, cards[i].id);
                    cardImg = $(cards[i]).find("img");
                    cardImg.first().click(renderFunc);
                }
            }
        });

    this.eventList.fetch({success:function(eventList){
        var eventListView = new EventListView({ collection: eventList });
        eventListView.render();
        document.getElementById("event-list-display").appendChild(eventListView.el);
    }, error:function(error){
        console.dir(error);
    }
});

}

},

mapPage: {
    map: null,
    eventMarkers: [],

    initialize: function() {
        var nyCoord = new google.maps.LatLng(40.7127,-74.0059);
        var canvas = document.getElementById("map-canvas");
        /*canvas.style.width = app.style.width;
        canvas.style.height = app.style.height;
        */
        this.map = new google.maps.Map(document.getElementById("map-canvas"), {
          zoom: 16,
          center: nyCoord,
      });
        //this.addMarker(40.7127,-74.0059);
        this.plotEvents();
    },

    addMarker: function(lat, lon, id){
        var temp = this.eventMarkers[this.eventMarkers.length] = new google.maps.Marker({
          position: new google.maps.LatLng(lat,lon),
          map: this.map,
          eventId: id,
      });

        google.maps.event.addListener(temp, 'click', function(){
            app.lastPage = "view-map";
            app.drawEventPage(temp.eventId);
        });
    },

    plotEvents: function(){
      var query = new Parse.Query(Event);
      query.find({
        success: function(result){
            this.eventMarkers = result;
            var temp;
            for (var i = 0; i < result.length; i++){
                temp = result[i].get("location").toJSON();
                app.mapPage.addMarker(temp.latitude, temp.longitude, result[i].id);
            }
        },
        error: function(error){
            console.dir(error);
        }
    });
  },
},

profilePage: {

    setupProfilePage: function(){
        Parse.User.current().fetch().then(function (user) {
            document.getElementById("name-text").innerHTML = user.get('name');
            document.getElementById("bio-text").innerHTML = user.get('biography');

        });
    }

}

};
