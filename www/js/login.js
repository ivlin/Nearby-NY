var login = {
    initialize: function() {
        setupLoginHandlers();
    }
}

function setupLoginHandlers() {
    $("#signup-button").click(validateSignUp);
    $("#signin-button").click(validateSignIn);
    // $(".signout").click(signOut);
}

function validateSignIn() {
    var formName = $("#signin-username").val();
    var formPass = $("#signin-password").val();
    if (formName !== "" && formPass !== "") {
        Parse.User.logIn(formName, formPass).then(function() {
            $('#signin-username').val('');
            $('#signin-password').val('');
            controller.changeViewTo("view-trending");

            // map.initialize();
            // profile.initialize();
            // friends.initialize();
            
            parsePlugin.getInstallationId(function(id) {
                var query = new Parse.Query(Parse.Installation);
                query.equalTo("installationId", id);
                query.first().then(function(i) {
                    i.set("userId", Parse.User.current().id);
                    i.save();
                });
            }, function(e) {
                alert(e);
            });
        });
    }
}

function validateSignUp() {
    var formEmail = $("#signup-email").val();
    var formName = $("#signup-username").val();
    var formPass = $("#signup-password").val();
    var formConfirmPass = $("#signup-confirm-password").val();
    if (formName !== "" && formEmail !== "" && formPass !== "" && formConfirmPass === formPass) {
        Parse.User.signUp(formName, formPass, {
            email: formEmail,
            name: "",
            biography: "",
            friends: [],
            tags: [],
            to_attend: [],
            attended: [],
            pending_friends: [],
            profile_img: "",
            mailbox: new Mailbox({
                requests: []
            }),
        }, {
            success: function(user) {
                console.log("success");
                user.get("mailbox").set("ownerId", user.id);
                user.get("mailbox").save();
                controller.changeViewTo("view-trending");
            },
            error: function(user, error) {
                $("#signup-username").val("");
                $("#signup-password").val("");
                $("#signup-status").html("Registration failed.<br>Make sure all fields are valid and try again.");
            }
        });
    } else {
        $("#signup-status").html("Form incorrectly filled");
    }
}
