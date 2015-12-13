/**
 * Created by Austin on 12/7/15.
 */

jQuery(function($) {
  var socket = io.connect();
  var $senderInfo = $('#sender_info');

  var $courses = $('.course');
  var $courseContent = $('#course_content');

  var $messageList = $('#message_list');
  var $messageListErrorBar = $('#message_list_error_bar');
  var $messageForm = $('#send_message');
  var $messageBox = $('#message');

  var $eventsList = $('#events_list');
  var $eventsListErrorBar = $('#events_list_error_bar');


  var $resourcesList = $('#resources_list');
  var $resourcesListErrorBar = $('#resources_list_error_bar');


  var $courseIdInputFieldMarker = $('#course_id_input_field');
  var $courseIdInputFieldMarker2 = $('#course_id_input_field2');

  var $membersList = $('#members_list');
  var $membersListErrorBar = $('#members_list_error_bar');

  var currentCourseId;




  $courses.bind('click', courseOnClick);


    $(document).on("click", ".report", function(e){
        e.preventDefault();
        console.log('report');
        console.log($(this).parent());
        var parent = $(this).parent();
        var currentText = parent[0].childNodes[1].textContent;
        $('#message_content').text(currentText);
        $('#from_user_report').attr('value', parent[0].id);
        $('#message_report').attr('value', parent[0].value);
        $('#course_id_reported').attr('value', currentCourseId);
        $('#message_content_reported').attr('value', currentText);
    });

  if ($courses.size() === 0) {
    $courseContent.hide();
  } else {
    var init_course_index = 0;
    var init_cid = $senderInfo.attr('data-init-cid');

    // Subscribe to all courses.
    for (var i = 0; i < $courses.size(); i++) {
      var course_id = $courses.eq(i).attr('id');
      socket.emit('subscribe', course_id, true);

      // Check if this is our initial course.
      if (course_id === init_cid) {
        init_course_index = i;
      }
    }

    $courses.eq(init_course_index).click();
  }

  function courseOnClick() {
    var clicked_course_id = $(this).attr('id');
    if (clicked_course_id !== currentCourseId) {
      currentCourseId = clicked_course_id;
      $courseIdInputFieldMarker.attr('value', currentCourseId);
      $courseIdInputFieldMarker2.attr('value', currentCourseId);

      toggleActiveCourse();

      loadAllMessages(currentCourseId);
      loadAllEvents(currentCourseId);
      loadAllResources(currentCourseId);
      loadAllMembers(currentCourseId);
    }
  }

  function toggleActiveCourse() {
    $('li.active').removeClass('active');
    $courses.each(function() {
      if ($(this).attr('id') === currentCourseId) {
        $(this).addClass('active');
      }
    });
  }

  //
  // MESSAGES
  //

  function loadAllMessages(course_id) {
    // Clear out old messages.
    $messageList.empty();

    // Make a request for the new messages.
    $.getJSON('/class/messages/fetch', {course_id: course_id}, function(data) {
      if (data.error) {
        $messageListErrorBar.text(data.error);
      } else {
        for (var i=0; i < data.messages.length; i++) {
          var msg_data = data.messages[i];
          appendNewMessage(msg_data, course_id, false);
        }
      }
    });
  }

  function appendNewMessage(msg_data, course_id, new_message) {
    if (course_id === currentCourseId) {
      // Reset the error message.
      $messageListErrorBar.text('');

      // Append the new message.
      $messageList.append(
          '<li class="comment" id=' + msg_data.from_user + ' value = ' + msg_data.id +
          '><strong>' + msg_data.fname + ' ' +  msg_data.lname + ' </strong>' +
          '<p class = "message_data" >' + msg_data.message + '</p>' +
          '<button class="report" data-toggle="modal" data-target="#report">Report</button></li>');

    } else if (new_message) {
      $courses.each(function(index) {
        if ($(this).attr('id') === course_id) {
          $(this).addClass('new_message_available');
        }
      });
    }
  }

  $messageForm.submit(function(e) {
    e.preventDefault();

    var message = $messageBox.val().trim();
    $messageBox.val('');
    if (message === '') {
      return;
    }

    var senderInfo = {user_id: $senderInfo.attr('data-user-id'),
      fname: $senderInfo.attr('data-fname'),
      lname: $senderInfo.attr('data-lname')};
    var data = {msg: message, course_id: currentCourseId, sender_info: senderInfo};
    socket.emit('send_class_message', data);
  });

  socket.on('display_class_message', function(msg_data, course_id)  {
    appendNewMessage(msg_data, course_id, true);
  });


  //
  // Events
  //

  function loadAllEvents(course_id) {
    var calendar = $('#calendar');

    // Clear out old events.
    $eventsList.empty();
    calendar.fullCalendar('removeEvents');

    // Make a request for the new events.
    $.getJSON('/class/events/fetch', {course_id: course_id}, function(data) {
      if (data.error) {
        $eventsListErrorBar.text(data.error);
      } else {
        var events = data.events;
        console.log(events);

        events.forEach(function(event) {
          var eventDate = Date.parse(event.calendar_date);

          var calendarEvent = {
            title: event.title,
            description: event.course_number + ': ' + event.description,
            start: eventDate,
            backgroundColor: '#00c0ef', //Info (aqua)
            borderColor: '#00c0ef' //Info (aqua)
          };

          calendar.fullCalendar('renderEvent', calendarEvent, true);
        });

        for (var i=0; i < data.events.length; i++) {
          var event_data = data.events[i];
          appendNewEvent(event_data, course_id);
        }
      }
    });
  }

  function appendNewEvent(event_data, course_id) {
    if (course_id === currentCourseId) {
      // Reset the error message.
      $eventsListErrorBar.text('');
    var date = new Date(event_data.calendar_date);
    var dateString = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "     ";
      // Append the new event.
      $eventsList.append(
          '<li class="calendar_entry" id=' + event_data.id +
              '><h4>' + dateString + ' - ' + event_data.title
              + '</h4><p>' + event_data.description + '</p></li>');
    }
  }



  //
  // Resources
  //

  function loadAllResources(course_id) {
    // Clear out old events.
    $resourcesList.empty();

    // Make a request for the new events.
    $.getJSON('/class/resources/fetch', {course_id: course_id}, function(data) {
      if (data.error) {
        $resourcesListErrorBar.text(data.error);
      } else {
        for (var i=0; i < data.resources.length; i++) {
          var resources_data = data.resources[i];
          appendNewResource(resources_data, course_id);
        }
      }
    });
  }

  function appendNewResource(resources_data, course_id) {
    if (course_id === currentCourseId) {
      // Reset the error message.
      $resourcesListErrorBar.text('');

      console.log($courses);

      // Append the new event.
      $resourcesList.append(
          '<div class="class-resource" id="' + resources_data.id + '"> <h4>' + resources_data.name + '</h4> <p>Uploaded: ' + resources_data.date_created + '<br><a href="' + resources_data.url + '">Download</a></p></div>'
       );
    }
  }


  //
  // Members
  //

  function loadAllMembers(course_id) {
    // Clear out old events.
    $membersList.empty();

    // Make a request for the new events.
    $.getJSON('/class/members/fetch', {course_id: course_id}, function(data) {
      if (data.error) {
        $membersListErrorBar.text(data.error);
      } else {
        for (var i=0; i < data.members.length; i++) {
          var member_data = data.members[i];
          appendNewMember(member_data, course_id);
        }
      }
    });
  }

  function appendNewMember(member_data, course_id) {
    if (course_id === currentCourseId) {
      // Reset the error message.
      $membersListErrorBar.text('');

      var elm = $('<li class="classmate" id=' + member_data.id + '>' +
          '<img class="profile_icture" src=' + member_data.profile_picture_url
          + ' alt="No Profile Picture" width = "100" height="100">' +
          '<div class= "name">' + member_data.fname + ' ' + member_data.lname + '</div></li>');
      elm.bind('click', function() {
        window.location.href = '/profile?query=' + member_data.id;
      });

      // Append the new event.
      $membersList.append(elm);
    }
  }

});
