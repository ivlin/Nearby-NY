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

                //moved inside asyncdata
                if (Parse.User.current()){
                    if (result.get("upvotes").indexOf(Parse.User.current().id) >= 0) {
                        $("#event-upvote").attr("class", "medium material-icons left black-text");
                    } else if (result.get("downvotes").indexOf(Parse.User.current().id) >= 0) {
                        $("#event-downvote").attr("class", "medium material-icons right red-text");
                    }
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

        EventPageView = Parse.View.extend({
            htmlData: null,
            jsonVersion: null,
            template: Handlebars.compile(document.getElementById("event-view-tpl").innerHTML),
            render: function(data) {
                var jsondata = data.toJSON();
                var eventDate = jsondata.time.iso;
                jsondata.short_desc = info.shortenDescription(jsondata);
                jsondata.time = info.buildDateString(eventDate);
                jsondata.countdown = info.timeUntilEvent(eventDate);
                jsondata.upvotes = jsondata.upvotes.length;
                jsondata.downvotes = jsondata.downvotes.length;

                var attendants = jsondata.to_attend;

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

    buildDateString: function(epoch) {
        var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        date = new Date(epoch);
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        minutes = date.getMinutes();
        minutes = minutes < 10 ? "0" + minutes : minutes;
        am_pm = date.getHours() >= 12 ? "AM" : "PM";

        dateStr = '';
        dateStr += days[date.getDay()] + ", ";
        dateStr += months[date.getMonth()] + " ";
        dateStr += date.getDate() + ", ";
        dateStr += date.getFullYear() + " \n";
        dateStr += (date.getHours() % 12) + ":";
        dateStr += minutes + am_pm; //+ " (EST)";

        return dateStr;
    },

    timeUntilEvent: function(eventDate) {
        var date = new Date();
        var timeNow = date.getTime();
        eventDate = new Date(eventDate);
        var eventTime = eventDate.getTime();
        var timeRemaining = eventTime - timeNow;
        // is this event in the past?
        if (timeRemaining <= 0) {
            return "This event is over";
        }

        // convert to seconds
        timeRemaining = Math.floor(timeRemaining / 1000);
        days = Math.floor(timeRemaining / (60 * 60 * 24));
        timeRemaining -= days * 60 * 60 * 24;
        hours = Math.floor(timeRemaining / (60 * 60));
        timeRemaining -= hours * 60 * 60;
        minutes = Math.floor(timeRemaining / (60));
        timeRemaining -= minutes * 60;

        if (days > 3) {
            return days + " days until event";
        } else if (days <= 3 && days > 1) {
            return days + " days, " + hours + " hours until event";
        } else {
            return hours + " hours, " + minutes + " minutes until event";
        }
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

        $("#goto-last").click(function() {
            controller.changeViewTo(info.lastPage);
        });

        $("#address-icon").click(function() {
            controller.changeViewTo("view-map");
            // map.initialize();
            google.maps.event.trigger(map.map, 'resize');
            var returnButton = $(".return-to-event");
            $(returnButton).css('display','block');
            $(returnButton).off('click').click(function(){
                controller.changeViewTo("view-event");
                $(this).css('display','none');
            });

            map.map.setCenter({lat: upData.location.latitude, lng: upData.location.longitude});
            map.map.setZoom(16);
        });

        if (Parse.User.current()){
    Parse.User.current().fetch().then(function (me){//start
    $("#event-reserve").click(function() {
        if (findMeInArray("to_attend") === -1) {
            addMeToArray("to_attend");
            var temp = me.get("to_attend");
            temp.push(objectId);
            me.set("to_attend", temp);
            me.save();
            $("#" + objectId).find(".star").html("<i class='material-icons left card-icon'>stars</i>"); 
            Materialize.toast('<span>You have shown interest in attending.</span>', 5000);
        } else {
            removeMeFromArray("to_attend");
            var temp = me.get("to_attend");
            temp.splice(temp.indexOf(objectId), 1);
            me.set("to_attend", temp);
            me.save();
            $("#" + objectId).find(".star").empty(); 
            Materialize.toast('<span>You are no longer interested in attending.</span>', 5000);
        }
        $("#event-to-attend-num").html(upData.to_attend.length);
    });


    $("#event-checkin").click(function() {
        if (findMeInArray("attended") === -1) {
            addMeToArray("attended");
            var temp = me.get("attended");
            temp.push(objectId);
            me.set("attended", temp);
            me.save();
            Materialize.toast('<span>Checked in! You can now rate this event.</span>', 5000);
        } else {
            removeMeFromArray("attended");
            removeMeFromArray("upvotes");
            removeMeFromArray("downvotes");
            var temp = me.get("attended");
            temp.splice(temp.indexOf(objectId), 1);
            me.set("attended", temp);
            me.save();
            Materialize.toast('<span>You are no longer registered as having checked in.</span>', 5000);
            $("#event-upvote").attr("class", "medium material-icons left grey-text");
            $("#event-upvote-count").html(result.get("upvotes").length);
            $("#event-downvote").attr("class", "medium material-icons right grey-text");
            $("#event-downvote-count").html(result.get("downvotes").length);
        }
        $("#event-attended-num").html(upData.attended.length);

    });

$("#event-upvote").click(function() {
    if (findMeInArray("attended") >= 0) {
        if (findMeInArray("upvotes") === -1) {
            addMeToArray("upvotes");
            removeMeFromArray("downvotes");
            $(this).attr("class", "medium material-icons left black-text");
            $("#event-downvote").attr("class", "medium material-icons right grey-text");
            $("#event-downvote-count").html(result.get("downvotes").length);
        } else {
            removeMeFromArray("upvotes");
            $(this).attr("class", "medium material-icons left grey-text");
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
            $(this).attr("class", "medium material-icons right red-text");
            $("#event-upvote").attr("class", "medium material-icons left grey-text");
            $("#event-upvote-count").html(result.get("upvotes").length);
        } else {
            removeMeFromArray("downvotes");
            $(this).attr("class", "medium material-icons right grey-text");
        }
        $("#event-downvote-count").html(result.get("downvotes").length);
    } else {
        Materialize.toast('You must have attended to vote.', 5000);
    }
});

    $("#event-invite-friends").click(function() {
        $(".sidebar-button").removeClass("grey lighten-4");
        $("#sidebar-friends").addClass("grey lighten-4");
        $("#invite-friends-prompt").css("display","block");
        controller.changeViewTo("view-friends");
        friends.initialize();
        friends.editMode = true;

        $("#push-prompt-event").html(upData.title);

            //handlers for friends page stuff
            $("#notify-selected-friends, #return-to-event").off("click");

            $("#return-to-event").off('click').click(function(){
                $("#invite-friends-prompt").css("display","none");
                controller.changeViewTo("view-event");
            });

            $("#notify-selected-friends").click(function(){
                // Parse.User.current().fetch().then(function (me){
                    var message;
                    if ($("input:radio[name='message-type']:checked").val() == 'invite-radio'){
                        message = "Invite from " + me.get("username");
                    }else if ($("input:radio[name='message-type']:checked").val() == 'notify-radio'){
                        message = me.get("username") + " is currently attending";
                    } 
                    var query = new Parse.Query(Parse.Installation);
                    query.containedIn("userId",friends.selected);
                    Parse.Push.send({
                        where: query,
                        data: {
                            alert: message,
                            title: upData.title,
                        }
                    },{
                        success:function(){},
                        error:function(e){console.log(e)}
                    });
                // });


});
});

        });//close the fetch current user block
}
},

}
