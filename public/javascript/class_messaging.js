/**
 * Created by Austin on 12/7/15.
 */

jQuery(($) => {
  var socket = io.connect();
  var $senderInfo = $('#sender_info');

  var $courseList = $('#course_list');
  var $courses = $('.course');

  var $chatContent = $('#class_message_wrapper');
  var $messageList = $('#message_list');
  var $messageListErrorBar = $('#message_list_error_bar');
  var $messageForm = $('#send_message');
  var $messageBox = $('#message');

  var currentCourseId;

  $courses.bind('click', courseOnClick);

  if ($courses.size() === 0) {
    $chatContent.hide();
  } else {
    // Subscribe to all courses.
    for (var i = 0; i < $courses.size(); i++) {
      var course_id = $courses.eq(i).attr('id');
      socket.emit('subscribe', course_id, true);
    }

    $courses.eq(0).click();
  }

  function courseOnClick() {
    var clicked_course_id = $(this).attr('id');
    if (clicked_course_id !== currentCourseId) {
      currentCourseId = clicked_course_id;

      toggleActiveCourse();
      loadAllMessages(currentCourseId);
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
  // MESAGGES
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
          '<li class="comment" id=' + msg_data.from_user + '><strong>' +
          msg_data.fname + ' ' +  msg_data.lname +
          ' </strong>' + msg_data.message + '</li>');
    } else if (new_message) {
      $courses.each(function(index) {
        if ($(this).attr('id') === course_id) {
          $(this).addClass('new_message_available');
        }
      });
    }
  }

  $messageForm.submit((e) => {
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

  socket.on('display_class_message', (msg_data, course_id) => {
    appendNewMessage(msg_data, course_id, true);
  });

});
