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
      login.initialize();
      trending.initialize();
      this.setupLinks();

      if (Parse.User.current()) {
        $("#view-trending").css("display", "block");
      } else {
        $("#view-signin").css("display", "block");
      }
    },

    initParse: function() {
      Parse.initialize(this.PARSE_APP, this.PARSE_JS);

      var pushNotification = window.plugins.pushNotification;
      pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"824841663931","ecb":"app.onNotificationGCM"});

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
    },

    successHandler: function(result) {
      Materialize.toast('Callback Success! Result = '+result,500);
    },

    errorHandler:function(error) {
      Materialize.toast(error, 500);
    },

    setupLinks: function() {
      var buttons = document.querySelectorAll(".goto-trending , .goto-signup , .goto-map , .goto-signin , .goto-profile, .goto-friends, .signout");
      for (var i = 0; i < buttons.length; i++) {
        switch (buttons[i].getAttribute("class")) {
          case "goto-trending":
          $(buttons[i]).click(function() {
            $(".sidebar-button").removeClass("grey lighten-4");
            $("#sidebar-trending").addClass("grey lighten-4");
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
            $(".sidebar-button").removeClass("grey lighten-4");
            $("#sidebar-map").addClass("grey lighten-4");
            controller.changeViewTo("view-map");
            map.initialize();
          });
          break;
          case "goto-profile":
          $(buttons[i]).click(function() {
            if (Parse.User.current()) {
              $(".sidebar-button").removeClass("grey lighten-4");
              $("#sidebar-profile").addClass("grey lighten-4");
              controller.changeViewTo("view-profile");
              profile.initialize();
            }
          });
          break;
          case "goto-friends":
          $(buttons[i]).click(function() {
            $(".sidebar-button").removeClass("grey lighten-4");
            $("#sidebar-friends").addClass("grey lighten-4");
            controller.changeViewTo("view-friends");
            friends.initialize();
          });
          break;
          case "signout":
          $(buttons[i]).click(function() {
            if (Parse.User.current()){
              Parse.User.logOut();
            }
            controller.changeViewTo("view-signin");  
            fblogout();                
          });
          break;
          default:
          break;
        }
      }
    },

    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    alert('registration id = '+e.regid);
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    },
  };
