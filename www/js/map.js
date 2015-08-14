var map = {
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
            trending.drawPage(temp.eventId);
        });
    },

    plotEvents: function(){
      var query = new Parse.Query(Event);
      that = this;
      query.find({
        success: function(result){
            this.eventMarkers = result;
            var temp;
            for (var i = 0; i < result.length; i++){
                temp = result[i].get("location").toJSON();
                that.addMarker(temp.latitude, temp.longitude, result[i].id);
            }
        },
        error: function(error){
            console.dir(error);
        }
    });
  },
};