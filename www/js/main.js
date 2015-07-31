//Parse related keys
var PARSE_APP = "uRElO79J6tFnbwmC2wAnSTOYhQwfjl7fyUCmPEe2";
var PARSE_JS = "i5kuiIlJoyLi0RyBwMdK0feNgLyE8OqQcGJomru6";

$(document).ready(function() {
	Parse.initialize(PARSE_APP, PARSE_JS);
	User = Parse.Object.extend("User");

	function get() {
		var query = new Parse.Query(User);

		query.find({
			success:function(results) {
				console.dir(results);
				var s = "";
				for(var i=0, len=results.length; i<len; i++) {
					var note = results[i];
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
	}

/*
	$("#test").on("touchend click", function(e) {
		e.preventDefault();

		//Grab the note details, no real validation for now
		//var email = $("#noteTitle").val();
		//var  = $("#noteBody").val();
		var newAccount = new User();
		newAccount.save({username:'test', password:'test'}, {
			success:function(object) {
				console.log("Saved the object!");
				//$("#noteTitle").val("");
				//$("#noteBody").val("");
				//getNotes();
			}, 
			error:function(object,error) {
				console.dir(error);
				alert("Sorry, I couldn't save it.");
			}
		});
	});

	//call getNotes immediately
	//getNotes();
	*/
});

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

//for setting up the lin

function buildLogin(){
	setupLogin(); 
	setupLinks();
}

function setupLogin(){
	var temp;
	temp = document.getElementById("signup-button");
	if (temp !== null){
		temp.addEventListener("click", function(e) {
			e.preventDefault();
			var newAccount = new User();
			newAccount.save({username:'test', password:'test'}, {
				success:function(object){
					console.log("saved");
				}
			}, {
				failure:function(object){
					console.dir(error);
					alert("object not saved");
				}
			});
		})
	}
	temp = document.getElementById("signin-button");
	if (temp !== null){
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