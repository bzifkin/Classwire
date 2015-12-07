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

  if ($courses.size() === 0) {
    $chatContent.hide();
  } else {
    $courses.eq(0).addClass('active');
    currentCourseId = $courses.eq(0).attr('id');

    // Subscribe to all courses.
    for (var i = 0; i < $courses.size(); i++) {
      var course_id = $courses.eq(i).attr('id');
      socket.emit('subscribe', course_id, true);
    }

    loadAllMessages(currentCourseId);
  }

  function loadAllMessages(course_id) {

  }

});
