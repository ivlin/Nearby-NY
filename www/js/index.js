 var app = {

   PARSE_APP : "bFpMdQLKzOXnYH7r9wdRRME4JmsZ4oxSae2YrH84",
   PARSE_JS : "T5dQgHMRBck7xs3Dws2tmhJylLabXaOzebAfVTsg",

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
};
