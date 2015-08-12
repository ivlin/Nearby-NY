var login = {
	initialize: function() {
		setupLoginHandlers();
		setupLinks();
	}
};

function setupLoginHandlers() {
	$("#signup-button").click(validateSignUp);
	$("#signin-button").click(validateSignIn);
	$("#signout").click(signOut);
}

function signOut() {
	Parse.User.logOut();
    controller.changeViewTo("view-signin");
}

function setupLinks() {
	var buttons = document.getElementsByTagName("button");
    for (var i = 0; i  < buttons.length; i++) {
        switch (buttons[i].getAttribute("class")) {
            case "goto-trending":
                $(buttons[i]).click( function() {
                    controller.changeViewTo("view-trending");
                });
                break;
            case "goto-signup":
                $(buttons[i]).click( function() {
                    controller.changeViewTo("view-signup");
                });
                break;
            case "goto-signin":
                $(buttons[i]).click( function() {
                    controller.changeViewTo("view-signin");
                });
                break;
            case "goto-map":
                $(buttons[i]).click( function() {
                    controller.changeViewTo("view-map");        
                    mapPage.initialize();
                });
            default:
                break;
        }
    }
}

function validateSignIn() {
	var formName = $("#form-username").val();
	var formPass = $("#form-password").val();
	if (formName !== "" && formPass !== ""){
		e.preventDefault();
		Parse.User.logIn(formName, formPass, {
			success:function(result){
				location.href = "trending.html";
			},
			error:function(error){
				$("#signin-status").html("Failed to sign in");
			}
		});
	}
}

function validateSignUp() {
	var formName = $("#form-username").val();
	var formPass = $("#form-password").val();
	var formConfirmPass = $("#form-confirm-password").val();
	var formEmail = $("#form-email").val();
	if (formName !== "" && formEmail !== "" && formPass !== "" && formConfirmPass === formPass){
		e.preventDefault();
		Parse.User.signUp(formName, formPass, {},{
			success:function(result){
				console.log("success");
				$("#signup-status").html("Registration successful");
			},
			error:function(error){
				console.dir(error);
				$("#signup-status").html("Username already taken<br>Try again");
			}
		});
	} else {
		$("#signup-status").html("Form incorrectly filled");
	}
}



/* Facebook login */
var fbLoginSuccess = function (userData) {
	alert("UserInfo: " + JSON.stringify(userData));
};

$('#signin-button').click(function(e) {
	facebookConnectPlugin.login(["public_profile", "email", "user_friends"],
		fbLoginSuccess,
		function (error) { alert("" + error);}
		);
});