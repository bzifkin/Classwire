/**
 * Created by Austin on 12/3/15.
 */

jQuery(($) => {
  var socket = io.connect();
  var $senderInfo = $('#sender_info');

  var $conversationList = $('#conv_list');
  var $conversations = $('.conversation');
  var $newConversationBtn = $('#new_conversation');

  var $chatContent = $('#chat_content');
  var $messageList = $('#message_list');
  var $messageListErrorBar = $('#message_list_error_bar');
  var $messageForm = $('#send_message');
  var $messageBox = $('#message');

  var $friendSearchErrorBar = $('#friend_search_error');
  var $friendSearchContent = $('#friend_search_content');
  var $friendSearchBar = $('#friend_search_bar');
  var $friendSearchResultsList = $('#friend_search_results');
  $friendSearchContent.hide();

  var current_conv_id;
  var friendsList;
  var friendSearchPlaceholderText = "Type a friend's name";
  var searching = false;

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

  $conversations.bind('click', conversationOnClick);

  function conversationOnClick() {
    if (searching) {
      hideSearchController();
    }
    var clicked_conv_id = $(this).attr('id');
    if (clicked_conv_id !== current_conv_id) {
      current_conv_id = clicked_conv_id;

      toggleActiveConversation();
      loadAllMessages(current_conv_id);
    }
  }

  function toggleActiveConversation() {
    $('li.active').removeClass('active');
    $conversations.each(function() {
      if ($(this).attr('id') === current_conv_id) {
        $(this).addClass('active');
      }
    });
  }

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

  $newConversationBtn.bind('click', function() {
    // Get the list of possible friends.
    $.getJSON('/friends/fetch', function(data) {
      // Hide and show the correct divs.
      $chatContent.hide();
      $friendSearchContent.show();

      if (data.error) {
        $friendSearchErrorBar.text(data.error);
      } else {
        friendsList = data.friends;
        searching = true;
      }
    });
  });

  $friendSearchBar.bind('click', function() {
    if ($(this).val() === friendSearchPlaceholderText) {
      $(this).val('');
    }
  });

  $friendSearchBar.keyup(function() {
    $friendSearchResultsList.empty();
    var search_text = $friendSearchBar.val().toLowerCase();
    if (search_text === '') {
      return;
    }

    var filtered_results = friendsList.filter(function(friend) {
      var friendName = friend.fname + ' ' + friend.lname;
      return friendName.toLowerCase().startsWith(search_text);
    });

    for (var i = 0; i < filtered_results.length; i++) {
      var friend = filtered_results[i];
      var elm = $('<li id=' + friend.id + '><strong>' + friend.fname + ' '
          + friend.lname + '</strong> ' + friend.course_number + '</li>');
      $friendSearchResultsList.append(elm);

      elm.bind('click', function() {
        var friend_id = $(this).attr('id');

        $.getJSON('/messages/new_conversation', {friend_id: friend_id}, function(data) {
          if (data.error) {
            $friendSearchErrorBar.text(data.error);
          } else {
            // Create the new conversation.
            var c = data.conversation;
            var elm = $('<li class="conversation" id=' + c.id + '>' + c.fname + ' ' + c.lname + '</li>');
            $conversationList.prepend(elm);

            // Redefine the conversations.
            $conversations = $('.conversation');
            socket.emit('subscribe', c.id);
            elm.bind('click', conversationOnClick);
            current_conv_id = c.id;
            toggleActiveConversation();

            elm.click();
          }
        });
      });
    }
  });

  function hideSearchController() {
    // Reset search controller.
    $friendSearchContent.hide();
    $friendSearchErrorBar.text('');
    $friendSearchBar.val(friendSearchPlaceholderText);
    $friendSearchResultsList.empty();

    $chatContent.show();
    searching = false;
  }

});
