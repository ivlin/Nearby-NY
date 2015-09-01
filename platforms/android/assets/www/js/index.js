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

      if (Parse.User.current()) {
        $("#view-trending").css("display", "block");
      } else {
        $("#view-signin").css("display", "block");
      }
    },

    initParse: function() {
      Parse.initialize(this.PARSE_APP, this.PARSE_JS);

        parsePlugin.initialize(this.PARSE_APP, this.PARSE_CLIENT_KEY, function() {
          alert('success');
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
        data:null,
        template: Handlebars.compile(document.getElementById("friend-request-tpl").innerHTML),
        render: function() {
         this.data = {
          request: this.collection
         }; 
         this.el.innerHTML = this.template(this.data);
       }
     });
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

              parsePlugin.getInstallationId(function (id){
                var query = new Parse.Query(Parse.Installation);
                query.equalTo("installationId",id);
                query.first().then(function (i){
                  i.set("userId",null);
                  i.save();
                });
              },function(e){
                console.log(e);
              });

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
  };
