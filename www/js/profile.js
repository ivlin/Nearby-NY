var profile = {

    curUser: null,

    initialize: function() {
        CalendarView = Parse.View.extend({
            data: null,
            template: Handlebars.compile(document.getElementById("calendar-list-tpl").innerHTML),
            render: function() {
                this.data = {
                    event: this.collection
                };
                this.el.innerHTML = this.template(this.data);
            }
        });

        this.setupProfilePage();
        this.setupHandlers();
    },

    setupProfilePage: function() {
        this.curUser = Parse.User.current().toJSON();
        this.updateInfo();
        this.updatePreferenceForm();
        this.updateUserHistory();
        this.updateUserSchedule();
        this.setupProfilePicture();
    },

    setupProfilePicture: function() {
        //var findMe = new Parse.Query(Parse.User);
        //findMe.get(Parse.User.current().id, {
          Parse.User.current().fetch({
            success: function(me) {
                var pic = me.get("profilePic");
                if (pic === undefined) {
                    $("#profile-pic").attr("src", "img/logo_nearby.png");
                } else if (me.get("profilePic")) {
                    $("#profile-pic").attr("src", pic.url());
                }
            }
        });
    },

    setupHandlers: function() {
        $("#edit-bio").click(function() {
            profile.drawForm();
            $("#set-bio-info").css("display", "inline");
            $("#get-bio-info").css("display", "none");
        });

        $("#save-bio").click(function(e) {
            e.preventDefault();
            Parse.User.current().fetch().then(function (me){
                me.set("name", $("#set-name").val());
                me.set("biography", $("#set-bio").val());
                me.save();
            }).then(function (){
                profile.setupProfilePage();
            });
            // Parse.User.current().save({
            //     "name":$("#set-name").val(),
            //     "biography":$("#set-bio").val()
            // });

            // profile.setupProfilePage();

            $("#set-bio-info").css("display", "none");
            $("#get-bio-info").css("display", "inline");
        });

        $("#set-profile-pic").change(function() {
            // if we've selected a picture from the file picker, let this button be pressed
            $("#upload-profile-pic").removeClass("disabled");
        });

        $("#upload-profile-pic").click(function(e) {
            imageFile = document.getElementById("set-profile-pic").files[0];
            preview = $("#profile-preview img");

            var reader = new FileReader();

            reader.onloadend = function() {
                preview.attr("src", reader.result);
                $("#profile-preview").show();
                localStorage.setItem("testProfilPic", reader.result);
            };

            if (imageFile) {
                reader.readAsDataURL(imageFile);
                var profilePic = new Parse.File("profilepic", imageFile);
                Parse.User.current().set("profilePic", profilePic);
                Parse.User.current().save(); //reads the data as a URL
            } else {
                preview.attr("src", "");
            }
        });

        $("#update-event-preferences").click(function() {
            profile.updateUserPreferences();
        });
    },

    updateInfo: function() {
        $("#get-username").html(profile.curUser.username);
        $("#get-name").html(profile.curUser.name);
        $("#get-email").html(profile.curUser.password);
        $("#get-bio").html(profile.curUser.biography.replace("\n","<br>"));
    },

    drawForm: function() {
        $("#set-username").attr("value", profile.curUser.username);
        $("#set-name").attr("value", profile.curUser.name);
        $("#set-email").attr("value", profile.curUser.email);
        $("#set-bio").html(profile.curUser.biography);

        // var labels = document.getElementsByTagName("label");
        // for (var i = 0; i < labels.length; i++) {
        //     labels[i].setAttribute("class", "active");
        // }

        $("label").attr("class","active");

    },

    updatePreferenceForm: function() {
        var userTags = profile.curUser.tags;

        for (var i = 0; i < userTags.length; i++) {
            document.getElementById(userTags[i]).checked = true;
        }
    },

    updateUserPreferences: function() {
        var tagBoxes = $(".tag-selector");
        var tagArray = [];
        for (var i = 0; i < tagBoxes.length; i++) {
            if (tagBoxes[i].checked) {
                tagArray[tagArray.length] = tagBoxes[i].id;
            }
        }
        Parse.User.current().set("tags", tagArray);
        Parse.User.current().save();
    },

    updateUserHistory: function() {
        // var query = new Parse.Query(Parse.User);
        // query.get(Parse.User.current().id, {
        Parse.User.current().fetch({
            success: function(result) {
                profile.makeEventList(result.get("attended"), "event-history");
            },
            error: function(error) {
                console.log("failed");
            }
        });
    },

    updateUserSchedule: function() {
        // var query = new Parse.Query(Parse.User);
        // query.get(Parse.User.current().id, {
      Parse.User.current().fetch({
            success: function(result) {
                profile.makeEventList(result.get("to_attend"), "event-schedule");
            },
            error: function(error) {
                console.log("failed");
            }
        });
    },

    makeEventList: function(array, sectionId) {
        var query = new Parse.Query(Event);
        query.containedIn("objectId", array);
        query.find({
            success: function(result) {
                for (var i = 0; i < result.length; i++) {
                    result[i] = result[i].toJSON();
                    result[i].time = (Date)(result[i].time);
                }
                result.sort(function(a, b) {
                    var x = a["time"];
                    var y = b["time"];
                    var diff = ((x < y) ? -1 : ((x > y) ? 1 : 0));
                    return diff;
                });
                var calendarList = new CalendarView({
                    collection: result
                });
                calendarList.render();
                if (result.length == 0) {
                    $("#" + sectionId).html('No events to show.');
                } else {
                    $("#" + sectionId).append(calendarList.el);
                }

                return calendarList.el;
            },
            error: function(error) {
                console.log("failed to get eventlist")
            }
        });
    }

};
