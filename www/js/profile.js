var profile = {

 curUser:null, 

 initialize: function(){
  this.setupProfilePage();
  this.setupHandlers();
},

setupProfilePage: function(){
  this.curUser = Parse.User.current().toJSON();
  this.updateInfo();
  this.updatePreferenceForm();
},

setupHandlers: function(){
  $("#edit-bio").click(function(){
    profile.drawForm();
   // document.getElementById("set-bio-info").style.display = "inline";
   // document.getElementById("get-bio-info").style.display = "none";
   $("#set-bio-info").css("display", "inline");
   $("#get-bio-info").css("display", "none");
 });

  $("#save-bio").click(function(e){
    e.preventDefault();
    Parse.User.current().set("name", $("#set-name").val());
    Parse.User.current().set("biography", $("#set-bio").val());
    Parse.User.current().save();

    profile.setupProfilePage();

    $("#set-bio-info").css("display","none");
    $("#get-bio-info").css("display","inline");
  });

  $("#update-event-preferences").click(function(){
    profile.updateUserPreferences();
  });
},

updateInfo: function(){
  $("#get-username").html(profile.curUser.username);
  $("#get-name").html(profile.curUser.name);
  $("#get-email").html(profile.curUser.password);
  $("#get-bio").html(profile.curUser.biography);
},

drawForm: function(){
  $("#set-username").attr("value", profile.curUser.username);
  $("#set-name").attr("value", profile.curUser.name);
  $("#set-email").attr("value", profile.curUser.email);
  $("#set-bio").html(profile.curUser.biography);

  var labels = document.getElementsByTagName("label");
  for (var i = 0; i < labels.length; i++){
    labels[i].setAttribute("class","active");
  }

},

updatePreferenceForm: function() {
  var userTags = profile.curUser.tags;
  for (var i = 0; i < userTags.length; i++){
    document.getElementById(userTags[i]).checked = true;
  }
},

updateUserPreferences: function() {
  var tagBoxes = $(".tag-selector");
  var tagArray = [];
  for (var i = 0; i < tagBoxes.length; i++){
    if (tagBoxes[i].checked){
      tagArray[tagArray.length] = tagBoxes[i].id;
    }
  }
  Parse.User.current().set("tags", tagArray);
  Parse.User.current().save();
}

};