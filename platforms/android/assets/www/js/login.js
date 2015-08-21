var login = {
	initialize: function() {
		setupLoginHandlers();
	}
}

function setupLoginHandlers() {
	$("#signup-button").click(validateSignUp);
	$("#signin-button").click(validateSignIn);
	$("#signout").click(signOut);
}

function signOut() {
    alert('in');
    try {
       logout();
    }
    catch(e){
        alert(e);   
    }
    Parse.User.logOut();
    controller.changeViewTo("view-signin");
}

function validateSignIn() {
	var formName = $("#signin-username").val();
	var formPass = $("#signin-password").val();
	if (formName !== "" && formPass !== ""){
		Parse.User.logIn(formName, formPass, {
			success:function(result){
				controller.changeViewTo("view-trending");
			},
			error:function(error){
				$("#signin-status").html("Failed to sign in");
			}
		});
	}
}

function validateSignUp() {
	var formEmail = $("#signup-email").val();
	var formName = $("#signup-username").val();
	var formPass = $("#signup-password").val();
	var formConfirmPass = $("#signup-confirm-password").val();
	if (formName !== "" && formEmail !== "" && formPass !== "" && formConfirmPass === formPass){
		Parse.User.signUp(formName, formPass, {},{
			success:function(result){
				console.log("success");
				$("#signup-status").html("Registration successful");
			},
			error:function(error){
				console.log(error);
				$("#signup-status").html("Registration failed<br>Try again");
			}
		});
	} else {
		$("#signup-status").html("Form incorrectly filled");
	}
}



/* Facebook login */
// var fbLoginSuccess = function (userData) {
// 	alert("UserInfo: " + JSON.stringify(userData));
// };

// $('#signin-button').click(function(e) {
// 	facebookConnectPlugin.login(["public_profile", "email", "user_friends"],
// 		fbLoginSuccess,
// 		function (error) { alert("" + error);}
// 		);
// });