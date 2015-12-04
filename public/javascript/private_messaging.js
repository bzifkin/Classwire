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
  var $messageForm = $('#send_message');
  var $messageBox = $('#message');
  var current_conv_id;

  if ($conversations.size() === 0) {
    $chatContent.hide();
  } else {
    $conversations.eq(0).addClass('active');
    current_conv_id = $conversations.eq(0).attr('id');
    for (var i = 0; i < $conversations.size(); i++) {
      var conv_id = $conversations.eq(i).attr('id');
      socket.emit('subscribe', conv_id);
    }
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
    if (conv_id === current_conv_id) {
      $messageList.append(
          '<li class="comment" id=' + msg_data.user_id + '><strong>' +
          msg_data.fname + ' ' +  msg_data.lname +
          ' </strong>' + msg_data.msg + '</li>');
    } else {
      $conversations.each((index) => {
        if ($(this).attr('id') === conv_id) {
          $(this).addClass('new_message_available');
        }
      });
    }
  });
});
