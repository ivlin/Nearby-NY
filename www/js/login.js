var login = {
	initialize: function() {
		setupLoginHandlers();
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