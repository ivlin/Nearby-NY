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

function buildLogin(){
	login();
}

function login(){
	document.getElementById("login-button").addEventListener("click", function(){
		location.href = "trending.html";
	});
	document.getElementById("login-skip").addEventListener("click", function(){
		location.href = "maps.html";
	});
}