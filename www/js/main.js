//Parse related keys
var PARSE_APP = "bFpMdQLKzOXnYH7r9wdRRME4JmsZ4oxSae2YrH84";
var PARSE_JS = "T5dQgHMRBck7xs3Dws2tmhJylLabXaOzebAfVTsg";

$(document).ready(function() {
	Parse.initialize(PARSE_APP, PARSE_JS);
	//Event = Parse.Object.extend("Event");
/*	EventList = Parse.Collection.extend(
	{
		model: Event
	});*/

	Event = Parse.Object.extend("Event");
	EventList = Parse.Collection.extend({
		model: Event
	});

	var eventList = new EventList();
	eventList.fetch(
		{success:function(eventList){ 
			//console.log(eventList);
			var eventListView = new EventListView({ collection: eventList });
			eventListView.render();
			$('#event-list-display').html(eventListView.el); // soooooooo messed up : doesnt work with doc.getElementbyid but does with jquery selector
		},
		error:function(error){
			console.dir(error);
		}
	});

	var EventListView = Parse.View.extend(
	{
		template:Handlebars.compile(document.getElementById("event-list").innerHTML),
		render:function(){
			var collection = {event: this.collection.toJSON()};
			this.$el.html(this.template(collection));
			console.log(typeof this.el);
		}
	});
});

//setup trending page

function initEventList(){
	//var eventListDisplay = document.createElement("div");
	//eventListDisplay.setAttribute("id", "eventListDisplay");
	//document.getElementById("display").appendChild(eventListDisplay);
	//var eventList = new eventList(eventListDisplay);
	/*

	Event = Parse.Object.extend("Event");
	EventList = Parse.Collection.extend(
	{
		model: Event
	});
	var eventList = new EventList();
	eventList.fetch(
		{success:function(events){
			console.log(events);
		},
		error:function(error){
			console.dir(error);
		}
	});

	*/
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
				Parse.User.signUp(formName, formPass, {},{
					success:function(result){
						console.log("success");
						document.getElementById("signup-status").innerHTML = "Registration successful";
					},
					error:function(error){
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
				e.preventDefault();
				Parse.User.logIn(formName, formPass, {
					success:function(result){
						location.href = "trending.html";
					},
					error:function(error){
						document.getElementById("signin-status").innerHTML = "Failed to sign in";
					}
				});
			}
		});
	}
}


function setupLinks(){
	var temp = document.getElementsByTagName("button");
	for (var i = 0; i  < temp.length; i++){
		switch (temp[i].getAttribute("class")){
			case "goto-trending":
			temp[i].addEventListener("click", function(){
				location.href = "trending.html";
			});
			break;
			case "goto-signup":
			temp[i].addEventListener("click", function(){
				location.href = "signup.html";
			});
			break;
			case "goto-signin":
			temp[i].addEventListener("click", function(){
				location.href = "index.html";
			});
			break;
			default:
			break;
		}
	}
}