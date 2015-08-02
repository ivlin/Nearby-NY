//Parse related keys
var PARSE_APP = "uRElO79J6tFnbwmC2wAnSTOYhQwfjl7fyUCmPEe2";
var PARSE_JS = "i5kuiIlJoyLi0RyBwMdK0feNgLyE8OqQcGJomru6";
var User;
var asd;

$(document).ready(function() {
	Parse.initialize(PARSE_APP, PARSE_JS);
	User = Parse.Object.extend("User");
/*
	function get() {
		var query = new Parse.Query(User);

		query.find({
			success:function(results) {
				console.dir(results);
				var s = "";
				for(var i=0; i< results.length; i++) {
					var user = results[i];
					s += "<p>";
					s += "<b>"+note.get("title")+"</b><br/>";
					s += "<b>Written "+note.createdAt + "<br/>";
					s += note.get("body");
					s += "</p>";
				}
				$("#notes").html(s);
			},
			error:function(error) {
				alert("Error when getting notes!");
			}
		});
}*/



/*
	$("#test").on("touchend click", function(e) {
		e.preventDefault();

		//Grab the note details, no real validation for now
		//var email = $("#noteTitle").val();
		//var  = $("#noteBody").val();

		var note = new User();
		note.save({username:'test', password:'test'}, {
			success:function(object) {
				console.log("Saved the object!");
				//$("#noteTitle").val("");
				//$("#noteBody").val("");
				//getNotes();
			}, 
			error:function(object,error) {
				console.dir(error);
			alert("Sorry, I couldn't save it.");			}
		});
	});
	//call getNotes immediately
	//getNotes();*/
	
});

function getUser(name, pass) {

	var query = new Parse.Query(User);
	query.equalTo("username", name);
	//query.equalTo("password",pass);
	/*query.get("pTnd6ks0Pk",{
		success:function(){
			console.log("got");
		},
		error:function(){
			console.log("not got");
		}
	});
}*/

query.first({
	success:function(results){
		console.log(results);
	},
	error:function(error){
		return null;
	}
}); 
}

//setup trending page

function initEventList(){
	//var eventListDisplay = document.createElement("div");
	//eventListDisplay.setAttribute("id", "eventListDisplay");
	//document.getElementById("display").appendChild(eventListDisplay);
	//var eventList = new eventList(eventListDisplay);
	var a = new eventList();
	a.addEvent(new eventItem("Shakespeare in the Park", "JOE", "FREE", "CENTRAL PARK",
		"asdasoidnasoidnaow asadiofnwa efitjl flzksefawl ds l lk"));
}

function eventList(){
	this.eventListDisplay = document.getElementById("eventListDisplay");
	this.listLength = 0;
	this.eventItemArray = [];

	this.addEvent = function (eventItem){
		this.eventItemArray[this.listLength] = eventItem;
		this.listLength ++;

		var newItem = document.createElement("div");
		newItem.setAttribute("class", "eventItem");
		this.eventListDisplay.appendChild(newItem);
	}
}

function eventItem(title, organizer, cost, location, description){
	this.eventTitle = title;
	this.eventOrganizer = organizer;
	this.eventCost = cost;
	this.eventLocation = location;
	this.eventDescription = description;
}

//for setting up the login

function buildLogin(){
	setupLogin(); 
	setupLinks();
}

function setupLogin(){
	var temp;
	temp = document.getElementById("signup-button");
	if (temp !== null){
		temp.addEventListener("click", function(e){
			var formName = document.getElementById("form-username").value;
			var formPass = document.getElementById("form-password").value;
			var formConfirmPass = document.getElementById("form-confirm-password").value;
			var formEmail = document.getElementById("form-email").value;
			if (formName !== "" && formEmail !== "" && formPass !== "" && formConfirmPass === formPass){
				e.preventDefault();
				var newAccount = new User();
				console.log(formPass)
				newAccount.save({"username":formName, "password":formPass}, {
						success:function(object){
							console.log("saved");
							document.getElementById("signup-status").innerHTML = "Registration successful";
						}
					}, {
						failure:function(object){
							console.dir(error);
							document.getElementById("signup-status").innerHTML = "Username already taken<br>Try again";
						}
					});	
			}else{
				document.getElementById("signup-status").innerHTML = "Form incorrectly filled";
			}	
		});
	}
	temp = document.getElementById("signin-button");
	if (temp !== null){
		temp.addEventListener("click", function(e){
			var formName = document.getElementById("form-username").value;
			var formPass = document.getElementById("form-password").value;
			if (formName !== "" && formPass !== ""){
				var user = getUser("" + formName,"" + formPass);
			}
		});
	}
}


function setupLinks(){
	var temp;
	temp = document.getElementsByClassName("goto-trending");
	for (var i = 0; i < temp.length; i++){
		temp[i].addEventListener("click", function(){
			location.href = "trending.html";
		});
	};
	temp = document.getElementsByClassName("goto-signup");
	for (var i = 0; i < temp.length; i++){
		temp[i].addEventListener("click", function(){
			location.href = "signup.html";
		});
	}
	temp = document.getElementsByClassName("goto-signin")
	for (var i = 0; i < temp.length; i++){
		temp[i].addEventListener("click", function(){
			location.href = "index.html";
		});
	}
}

