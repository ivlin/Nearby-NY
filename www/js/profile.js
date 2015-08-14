var profile = {

 curUser:null, 

 initialize: function(){
  this.setupProfilePage();
  this.setupHandlers();
},

setupProfilePage: function(){
  this.curUser = Parse.User.current().toJSON();
  this.updateInfo();
},

setupHandlers: function(){
  document.getElementById("edit-profile").addEventListener("click",function(){
    profile.drawForm();
   // document.getElementById("set-bio-info").style.display = "inline";
   // document.getElementById("get-bio-info").style.display = "none";
   $("#set-bio-info").css("display", "inline");
 $("#get-bio-info").css("display", "none");
});

  document.getElementById("save-bio").addEventListener("click", function(e){
    e.preventDefault();
    Parse.User.current().set("name", document.getElementById("set-name").value);
    Parse.User.current().set("biography", document.getElementById("set-bio").value);
    Parse.User.current().save();

profile.setupProfilePage();

    $("#set-bio-info").css("display","none");
    $("#get-bio-info").css("display","inline");
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

};