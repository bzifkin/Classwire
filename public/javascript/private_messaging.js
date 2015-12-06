/**
 * Created by Austin on 12/3/15.
 */

jQuery(($) => {
  var socket = io.connect();
  var $senderInfo = $('#sender_info');
  var $conversations = $('.conversation');
  var $newConversationBtn = $('#new_conversation');
  var $chatContent = $('#chat_content');
  var $messageList = $('#message_list');
  var $messageListErrorBar = $('#message_list_error_bar');
  var $messageForm = $('#send_message');
  var $messageBox = $('#message');
  var current_conv_id;

  if ($conversations.size() === 0) {
    $chatContent.hide();
  } else {
    $conversations.eq(0).addClass('active');
    current_conv_id = $conversations.eq(0).attr('id');

    // Subscribe to all conversations.
    for (var i = 0; i < $conversations.size(); i++) {
      var conv_id = $conversations.eq(i).attr('id');
      socket.emit('subscribe', conv_id);
    }

    loadAllMessages(current_conv_id);
  }

  $messageForm.submit((e) => {
    e.preventDefault();
    var senderInfo = {user_id: $senderInfo.attr('data-user-id'),
      fname: $senderInfo.attr('data-fname'),
      lname: $senderInfo.attr('data-lname')};
    var data = {msg: $messageBox.val(), conv_id: current_conv_id, sender_info: senderInfo};
    socket.emit('send_message', data);
    $messageBox.val('');
  });

  socket.on('display_private_message', (msg_data, conv_id) => {
    appendNewMessage(msg_data, conv_id, true);
  });

  function appendNewMessage(msg_data, conv_id, new_message) {
    if (conv_id === current_conv_id) {
      // Reset the error message.
      $messageListErrorBar.text('');

      // Append the new message.
      $messageList.append(
          '<li class="comment" id=' + msg_data.from_user + '><strong>' +
          msg_data.fname + ' ' +  msg_data.lname +
          ' </strong>' + msg_data.message + '</li>');
    } else if (new_message) {
      $conversations.each(function(index) {
        if ($(this).attr('id') === conv_id) {
          $(this).addClass('new_message_available');
        }
      });
    }
  }

  $conversations.bind('click', function() {
    var clicked_conv_id = $(this).attr('id');
    if (clicked_conv_id !== current_conv_id) {
      current_conv_id = clicked_conv_id;
      loadAllMessages(current_conv_id);
    }
  });

  function loadAllMessages(conv_id) {
    // Clear out old messages.
    $messageList.empty();

    // Make a request for the new messages.
    $.getJSON('/messages/fetch', {conv_id: conv_id}, function(data) {
      if (data.error) {
        $messageListErrorBar.text(data.error);
      } else {
        for (var i=0; i < data.messages.length; i++) {
          var msg_data = data.messages[i];
          appendNewMessage(msg_data, conv_id, false);
        }
      }
    });
  }

});



