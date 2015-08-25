var map = {
  map: null,
  eventMarkers: [],
  temp:[],

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
        this.setupHandlers();
        this.plotEvents(false, false, "show-all");
      },

      setupHandlers: function(){

        $("#display-map-options").click(function(){
          $("#map-options").slideToggle();
        });

        $("#update-map-events").click(function(){
          var preference, visited
          if (Parse.User.current()){
            visited = $("#map-event-visited").prop("checked");
            preference = $("#map-event-preference").prop("checked");
          }else{
            visited = preference = false;
          }
          var timeframe = $("#map-event-timeframe input[type=radio]:checked").attr("id");
          map.plotEvents(visited, preference, timeframe);
        });
      },

      addMarker: function(lat, lon, id, isVisited, isPreference){
        var temp = this.eventMarkers[this.eventMarkers.length] = new google.maps.Marker({
          position: new google.maps.LatLng(lat,lon),
          map: this.map,
          eventId: id,
        });

        if (isVisited){
          temp.setIcon("img/greenball.png");
        }else if (isPreference){
          temp.setIcon("img/blueball.png");
        }

        google.maps.event.addListener(temp, 'click', function(){
          app.drawEventPage(temp.eventId,"view-map");
        });

        return temp;
      },

      plotEvents: function(showVisited, showPreference, timeframe){
        var futureQuery = new Parse.Query(Event); 
        var histQuery = new Parse.Query(Event);
        var mainQuery;
//timequery
var endDate = new Date();
switch (timeframe){
  case "show-day":
  endDate.setDate(endDate.getDate() + 1); 
  break;
  case "show-week":
  endDate.setDate(endDate.getDate() + 7); 
  break;
  case "show-month":
  endDate.setMonth(endDate.getMonth() + 1); 
  break;
  case "show-year":
  endDate.setYear(endDate.getYear() + 1); 
  break;
  case "show-all":
  default:
  break;
}
if (timeframe !== "show-all"){
  futureQuery.lessThanOrEqualTo("time",endDate);
}
futureQuery.greaterThanOrEqualTo("time", new Date());
if (showVisited){
  histQuery.equalTo("attended",Parse.User.current().id);
  mainQuery = Parse.Query.or(futureQuery, histQuery);
}else{
  mainQuery = Parse.Query.or(futureQuery);
}
that = this;

function hasSharedElements(a1, a2){
  for (var i = 0; i < a1.length; i++){
    if (a2.indexOf(a1[i]) >= 0){
      return true;
    }
  }
  return false;
}

  mainQuery.find({
  success: function(result){

    for (var i = 0; i < map.eventMarkers.length; i++){
      map.eventMarkers[i].setMap(null);
    }
    map.eventMarkers = [];
    var temp, isVisited, isPreference;

    if (!Parse.User.current()){
      for (var i = 0; i < result.length; i++){
        temp = result[i].get("location").toJSON();
        isVisited = false;
        isPreference = false;
        map.eventMarkers.push(that.addMarker(temp.latitude, temp.longitude, result[i].id, isVisited, isPreference));
      }
    }else{
      var userPref = new Parse.Query(Parse.User);
      userPref.get(Parse.User.current().id, {
        success:function(r){
          for (var i = 0; i < result.length; i++){
            temp = result[i].get("location").toJSON();
            isVisited = hasSharedElements(r.get("attended"), [result[i].id]);
            isPreference = hasSharedElements(result[i].get("tags"), r.get("tags"));
            if (showPreference){
              if (isPreference){
                map.eventMarkers.push(that.addMarker(temp.latitude, temp.longitude, result[i].id, isVisited, isPreference));
              }
            }else{
              map.eventMarkers.push(that.addMarker(temp.latitude, temp.longitude, result[i].id, isVisited, isPreference));
            }
          }
        },error:function(e){}
      });
    }
  }, error: function(error){
    console.dir(error);
  }

});
},
}