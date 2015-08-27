info = {
    lastPage: null,

    description: {
        isShortened: false,
        full: '',
        shortened: ''
    },

    drawEventPage: function(objectId, lastView) {
        info.lastPage = lastView;
        var eventObject, eventPageDisplay;
        var query = new Parse.Query(Event);

        query.get(objectId, {
            success: function(result) {
                eventObject = result;
                //     console.log(eventObject);
                eventPageDisplay = new EventPageView();
                eventPageDisplay.render(result);
                controller.changeViewTo("view-event");
                //   loadAsyncData(result,eventPageDisplay);//adds the html
                $('html, body').animate({
                    scrollTop: 0
                }, 0);
                $("#event-info-body").html(eventPageDisplay.htmlData);

                info.setupHandlers(objectId, result);

                $(".goto-friends").click(function() {
                    $("#invite-friends-prompt").slideToggle();
                });

                $("#send-invites").click(function() {
                    Materialize.toast("Successfully sent notices.", 500);
                    $("#friend-notification, #friend-email-notification, #friend-user-notification").val("");
                    $("#invite-friends-prompt").slideToggle();
                });

                //moved inside asyncdata
                if (result.get("upvotes").indexOf(Parse.User.current().id) >= 0) {
                    $("#event-upvote").attr("class", "large material-icons left black-text");
                } else if (result.get("downvotes").indexOf(Parse.User.current().id) >= 0) {
                    $("#event-downvote").attr("class", "large material-icons right red-text");
                }

                if (info.description.isShortened) {
                    $('#see-more').show();

                    $('#see-more').click(function(e) {
                        $('#event-desc').html(info.description.full);
                        $(this).hide();
                        $('#see-less').show();
                    });

                    $('#see-less').click(function(e) {
                        $('#event-desc').html(info.description.shortened);
                        $(this).hide();
                        $('#see-more').show();
                    });
                }

            },
            error: function(error) {
                console.dir(error);
            }
        });


        //                 function loadAsyncData(result, eventPageDisplay){
        //                   var jsondata = eventPageDisplay.jsonVersion;
        //                   if (Parse.User.current()){
        //                     var getMe = new Parse.Query(Parse.User);
        //                     getMe.get(Parse.User.current().id).then(function(me){
        //                       var myfriends = me.get("friends");
        //                       for (var i = 0; i < myfriends.length; i++){
        //                         if (result.get("to_attend").indexOf(myfriends[i]) >= 0){
        //                           jsondata.num_friends_to_attend ++;
        //                           if (jsondata.friends_to_attend.length < 3){
        //                             jsondata.friends_to_attend.push(myfriends[i]);
        //                           }
        //                         }
        //                         if (result.get("attended").indexOf(myfriends[i]) >= 0){
        //                           jsondata.num_friends_attended ++;
        //                           if (jsondata.friends_attended.length < 3){
        //                             jsondata.friends_attended.push(myfriends[i]);
        //                           }
        //                         }
        //                       }
        //                     }).then(function(){
        //                       var attendingQuery = new Parse.Query(Parse.User);
        //                       var attendedQuery = new Parse.Query(Parse.User);
        //                       attendingQuery.containedIn("objectId",jsondata.friends_to_attend);
        //                       attendedQuery.containedIn("objectId",jsondata.friends_attended);
        //                       attendingQuery.find().then(function (r){
        //                         jsondata.friends_to_attend = [];
        //                         for (var i = 0; i < r.length; i++){
        //                           jsondata.friends_to_attend.push(r[i].get("username"));
        //                         }
        //                         return attendedQuery.find();
        //                       }).then(function (r){
        //                         jsondata.friends_attended = [];
        //                         for (var i = 0; i < r.length; i++){
        //                           jsondata.friends_attended.push(r[i].get("username"));
        //                         }
        //                       }).then(function (r){
        //                         jsondata.to_attend = jsondata.to_attend.length;
        //                       }).then(function(){
        //                         eventPageDisplay.htmlData = eventPageDisplay.template(jsondata);
        //                       }).then(function(r){
        //                         eventPageDisplay.htmlData = eventPageDisplay.template(jsondata);
        //                         document.getElementById("view-event").innerHTML = eventPageDisplay.htmlData;
        //                       });
        //                     });
        // }
        // console.log("okay");
        // }                


        EventPageView = Parse.View.extend({
            htmlData: null,
            jsonVersion: null,
            template: Handlebars.compile(document.getElementById("event-view-tpl").innerHTML),
            render: function(data) {
                var jsondata = data.toJSON();

                jsondata.short_desc = info.shortenDescription(jsondata);
                jsondata.time = new Date(jsondata.time.iso);
                jsondata.upvotes = jsondata.upvotes.length;
                jsondata.downvotes = jsondata.downvotes.length;

                jsondata.to_attend = jsondata.to_attend.length;
                jsondata.attended = jsondata.attended.length;

                this.jsonVersion = jsondata;
                info.description.full = jsondata.description;
                this.htmlData = this.template(jsondata);
            }
        });
    }, //end of draw

    shortenDescription: function(jsondata) {
        // Truncate the description if necessary
        var shortDesc = '';
        var previewLength = 200;
        if (jsondata.description.length > previewLength) {
            shortDesc = jsondata.description.substring(0, previewLength);
            lastChar = shortDesc.slice(-1);
            while (lastChar != ' ' && lastChar != '\n' && lastChar != '.') {
                previewLength++;
                if (previewLength >= jsondata.description.length)
                    break;
                shortDesc = jsondata.description.substring(0, previewLength);
                lastChar = shortDesc.slice(-1);
            }
            shortDesc = shortDesc + " ...";
            this.description.isShortened = true;
        } else {
            shortDesc = jsondata.description;
        }

        this.description.shortened = shortDesc;
        return shortDesc;
    },

    setupHandlers: function(objectId, result) {
        var upData = result.toJSON();

        function addMeToArray(attr) {
            if (Parse.User.current()) {
                upData[attr].push(Parse.User.current().id);
                result.save(upData);
            }
        };

        function removeMeFromArray(attr) {
            if (Parse.User.current()) {
                var ind = findMeInArray(attr);
                if (ind !== -1) {
                    upData[attr].splice(ind, 1);
                    result.save(upData);
                }
            }
        }

        function findMeInArray(attr) {
            if (Parse.User.current()) {
                return upData[attr].indexOf(Parse.User.current().id);
            }
            return -1; //guest
        }

        $("#event-reserve").click(function() {
            if (findMeInArray("to_attend") === -1) {
                addMeToArray("to_attend");
                var query = new Parse.Query(Parse.User);
                query.get(Parse.User.current().id, {
                    success: function(r) {
                        var temp = r.get("to_attend");
                        temp.push(objectId);
                        r.set("to_attend", temp);
                        r.save();
                    }
                });
                Materialize.toast('<span>You have shown interest in attending.</span>', 5000);
            } else {
                removeMeFromArray("to_attend");
                var query = new Parse.Query(Parse.User);
                query.get(Parse.User.current().id, {
                    success: function(r) {
                        var temp = r.get("to_attend");
                        temp.splice(temp.indexOf(objectId), 1);
                        r.set("to_attend", temp);
                        r.save();
                    }
                });
                Materialize.toast('<span>You are no longer interested in attending.</span>', 5000);
            }
            $("#event-to-attend-num").html(upData.to_attend.length);
        });


        $("#event-checkin").click(function() {
            if (findMeInArray("attended") === -1) {
                addMeToArray("attended");
                var query = new Parse.Query(Parse.User);
                query.get(Parse.User.current().id, {
                    success: function(r) {
                        var temp = r.get("attended");
                        temp.push(objectId);
                        r.set("attended", temp);
                        r.save();
                    }
                });
                Materialize.toast('<span>Checked in! You can now rate this event.</span>', 5000);
            } else {
                removeMeFromArray("attended");
                removeMeFromArray("upvotes");
                removeMeFromArray("downvotes");
                var query = new Parse.Query(Parse.User);
                query.get(Parse.User.current().id, {
                    success: function(r) {
                        var temp = r.get("attended");
                        temp.splice(temp.indexOf(objectId), 1);
                        r.set("attended", temp);
                        r.save();
                    }
                });
                Materialize.toast('<span>You are no longer registered as having checked in.</span>', 5000);
                $("#event-upvote").attr("class", "large material-icons left grey-text");
                $("#event-upvote-count").html(result.get("upvotes").length);
                $("#event-downvote").attr("class", "large material-icons left grey-text");
                $("#event-downvote-count").html(result.get("downvotes").length);
            }
            $("#event-attended-num").html(upData.attended.length);
        });

        $("#event-upvote").click(function() {
            if (findMeInArray("attended") >= 0) {
                if (findMeInArray("upvotes") === -1) {
                    addMeToArray("upvotes");
                    removeMeFromArray("downvotes");
                    $(this).attr("class", "large material-icons left black-text");
                    $("#event-downvote").attr("class", "large material-icons right grey-text");
                    $("#event-downvote-count").html(result.get("downvotes").length);
                } else {
                    removeMeFromArray("upvotes");
                    $(this).attr("class", "large material-icons left grey-text");
                }
                $("#event-upvote-count").html(result.get("upvotes").length);
            } else {
                Materialize.toast('You must have attended to vote.', 5000);
            }
        });

        $("#event-downvote").click(function() {
            if (findMeInArray("attended") >= 0) {
                if (findMeInArray("downvotes") === -1) {
                    addMeToArray("downvotes");
                    removeMeFromArray("upvotes");
                    $(this).attr("class", "large material-icons right red-text");
                    $("#event-upvote").attr("class", "large material-icons left grey-text");
                    $("#event-upvote-count").html(result.get("upvotes").length);
                } else {
                    removeMeFromArray("downvotes");
                    $(this).attr("class", "large material-icons right grey-text");
                }
                $("#event-downvote-count").html(result.get("downvotes").length);
            } else {
                Materialize.toast('You must have attended to vote.', 5000);
            }
        });

        $("#goto-last").click(function() {
            controller.changeViewTo(info.lastPage);
        });

    },
}
