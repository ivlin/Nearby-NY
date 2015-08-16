var app = {
   PARSE_APP : "bFpMdQLKzOXnYH7r9wdRRME4JmsZ4oxSae2YrH84",
   PARSE_JS : "T5dQgHMRBck7xs3Dws2tmhJylLabXaOzebAfVTsg",
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
     // map.initialize()
        //map.initialize();
        trending.initialize();
        this.setupLinks();

        if (Parse.User.current()) {
            document.getElementById("view-trending").style.display = "inline";
        } else{
            document.getElementById("view-signin").style.display = "inline";
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
      var buttons = document.querySelectorAll(".goto-trending , .goto-signup , .goto-map , .goto-signin , .goto-profile, .signout");
      for (var i = 0; i  < buttons.length; i++) {
        switch (buttons[i].getAttribute("class")) {
            case "goto-trending":
            $(buttons[i]).click( function() {
                controller.changeViewTo("view-trending");
            });
            break;
            case "goto-signup":
            $(buttons[i]).click( function() {
                controller.changeViewTo("view-signup");
            });
            break;
            case "goto-signin":
            $(buttons[i]).click( function() {
                controller.changeViewTo("view-signin");
            });
            break;
            case "goto-map":
            $(buttons[i]).click( function() {
                controller.changeViewTo("view-map");        
                map.initialize();
            });
            break;
            case "goto-profile":
            $(buttons[i]).click( function(){
                if (Parse.User.current()){
                    controller.changeViewTo("view-profile");
                    profile.initialize();
                }                    
            });
            break;
            case "signout":
            buttons[i].addEventListener("click", function(){
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

drawEventPage: function(objectId){
 var eventObject, eventPageDisplay;
 var query = new Parse.Query(Event);

 query.get(objectId,{
    success: function(result){
      eventObject = result;
		//     console.log(eventObject);
		eventPageDisplay = new EventPageView();
		eventPageDisplay.render(result);
		controller.changeViewTo("view-event");
		document.getElementById("view-event").innerHTML = eventPageDisplay.htmlData;
		
		document.getElementById("goto-last").addEventListener("click", function (){
          controller.changeViewTo(lastPage);
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
		jsondata.time = new Date(jsondata.time.iso);
		this.htmlData= this.template(jsondata);

 }
});


},

};

