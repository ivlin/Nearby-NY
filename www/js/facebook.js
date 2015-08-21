var fblogin = function () {
if (!window.cordova) {
	var appId = prompt("Enter FB Application ID", "");
	facebookConnectPlugin.browserInit(appId);
}
/*facebookConnectPlugin.login( ["email"],
	function (response) { alert(JSON.stringify(response)) },
	function (response) { alert(JSON.stringify(response)) });*/

facebookConnectPlugin.login(["email"], function(response) {
		if (response.authResponse) {
			facebookConnectPlugin.api('/me', null,
				function(response) {
					alert('Welcome, ' +
						response.name + '.' + response.id);
						var formName = response.name;
						var formPass = response.id;
						if (formName !== "" && formPass !== "") {
							Parse.User.logIn(formName, formPass, {
								success: function(result) {
									controller.changeViewTo("view-trending");
								},
								error: function(error) {
									$("#signin-status").html("Failed to sign in");
								}
							});
						}
					});

			}
		}, function(response) {alert(JSON.stringify(response))});
}

var fbsignup = function() {

facebookConnectPlugin.login(["email"], function(response) {
		if (response.authResponse) {
			facebookConnectPlugin.api('/me', null,
				function(response) {
					
						var formEmail = 'none';
						var formName = response.name;
						var formPass = response.id;
						var formConfirmPass = response.id;
						if (formName !== "" && formEmail !== "" && formPass !== "" && formConfirmPass === formPass){
							Parse.User.signUp(formName, formPass, {},{
								success:function(result){
								console.log("success");
								$("#signup-status").html("Registration successful");
                                alert('Thanks for signing up, ' + response.name);
                                Parse.User.logIn(formName, formPass, {
								success: function(result) {
									controller.changeViewTo("view-trending");
								},
								error: function(error) {
									$("#signin-status").html("Failed to sign in");
								}
							});
						},
						error:function(error){
						console.log(error);
						$("#signup-status").html("Registration failed<br>Try again");
						}
						});
						
						} else {
							$("#signup-status").html("Form incorrectly filled");
						}
					});

			}
		}, {
			'scope': 'email'
		});



}

var showDialog = function() {
	facebookConnectPlugin.showDialog({
			method: "feed"
		},
		function(response) {
			alert(JSON.stringify(response))
		},
		function(response) {
			alert(JSON.stringify(response))
		});
}

var apiTest = function() {
	facebookConnectPlugin.api("me/?fields=id,email", ["user_birthday"],
		function(response) {
			alert(JSON.stringify(response))
		},
		function(response) {
			alert(JSON.stringify(response))
		});
}
var logPurchase = function() {
	facebookConnectPlugin.logPurchase(1.99, "USD",
		function(response) {
			alert(JSON.stringify(response))
		},
		function(response) {
			alert(JSON.stringify(response))
		});
}
var logEvent = function() {
	// For more information on AppEvent param structure see
	// https://developers.facebook.com/docs/ios/app-events
	// https://developers.facebook.com/docs/android/app-events
	facebookConnectPlugin.logEvent("Purchased", {
			NumItems: 1,
			Currency: "USD",
			ContentType: "shoes",
			ContentID: "HDFU-8452"
		}, null,
		function(response) {
			alert(JSON.stringify(response))
		},
		function(response) {
			alert(JSON.stringify(response))
		});
}
var getAccessToken = function() {
	facebookConnectPlugin.getAccessToken(
		function(response) {
			alert(JSON.stringify(response))
		},
		function(response) {
			alert(JSON.stringify(response))
		});
}

var getStatus = function() {
	facebookConnectPlugin.getLoginStatus(
		function(response) {
			alert(JSON.stringify(response))
		},
		function(response) {
			alert(JSON.stringify(response))
		});
}
var logout = function () { 
    //alert('start');
                facebookConnectPlugin.logout( 
                    function (response) { //alert(JSON.stringify(response) + '1') 
                    },
                    function (response) { //alert(JSON.stringify(response)) 
                    });
      //      alert('end');
            }