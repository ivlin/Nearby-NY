var trending = {

    eventList: null,
    eventListView: null,   

    initialize: function () {
        EventListView = Parse.View.extend({
          data:null,
          el:null,
          template:Handlebars.compile($("#event-list-tpl").html()),
          render:function(){
              var collection = this.data = {event: this.collection.toJSON()};
              this.organizeList("");
          },

          organizeList: function(mode){
            switch (mode.toLowerCase()){
                case "cost":
                this.data.event = this.sortByKey(this.data.event, "cost", true);
                break;
                default:
                this.data.event = this.sortByKey(this.data.event, "title", true);
                break;
            }

            this.el.innerHTML = this.template(this.data);
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
     },

     sortByKey: function(array, key, ascending) {
        return array.sort(function(a, b) {
         var x = a[key]; var y = b[key];
         var diff = ((x < y) ? -1 : ((x > y) ? 1 : 0));
         return ascending ? diff : -1 * diff;
     }); 
    },


});

this.buildList();
var modeOptions = $(".reorder-mode");
for (var i = 0; i < modeOptions.length; i++){
  modeOptions[i].addEventListener("click",function(){
    trending.reorderList(this.innerHTML)
});
}

    },//end init

    buildList: function() {
     this.eventList = new EventList(),
     trending.drawList();
 },

 drawList: function(){
    trending.eventList.fetch({success:function(eventList){
        trending.eventListView = new EventListView({ collection: eventList });
        trending.eventListView.render();
        $("#event-list-display").append(trending.eventListView.el);
    }, error:function(error){
      console.dir(error);
  }
});
},

reorderList: function(mode){
    trending.eventListView.organizeList(mode);
}

};