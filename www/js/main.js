//Parse related keys
var PARSE_APP = "d54noOCz5DvkCdHKAYVulAZFPRguIwXSgQWtmuM3";
var PARSE_JS = "XG9v2D6bEhOgPfuvzKt8R6i0Ug6Ztj9wqiETTbAh";

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
				alert("Sorry, I couldn't save it.");
			}
		});
	});

	//call getNotes immediately
	//getNotes();

});