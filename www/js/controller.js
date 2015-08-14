var viewframes = [
    $("#view-signin"),
    $("#view-signup"),
    $("#view-trending"),
    $("#view-map"),
    $("#view-event"),
    $("#view-profile")
];

var controller = {
    changeViewTo: function(viewId) {
        for (var i = 0; i < viewframes.length; i++){
            viewframes[i].hide();
        }
        document.getElementById(viewId).style.display = "inline";
    }
};