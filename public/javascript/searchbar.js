/**
 * Created by nickdelfino on 12/6/15.
 */

var $friendSearchErrorBar = $('#friend_search_error');
var $friendSearchContent = $('#friend_search_content');
var $friendSearchBar = $('#friend_search_bar');
var $friendSearchResultsList = $('#friend_search_results');
var friendSearchPlaceholderText = "Type a friend's name";

var friendsList;

var searching;

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
        var elm = $('<li class = \"friends\" id=' + friend.id + '><strong>' + friend.fname + ' '
            + friend.lname + '</strong> ' + friend.course_number + '</li>');
        $friendSearchResultsList.append(elm);

        elm.bind('click', function() {
            var friend_id = $(this).attr('id');
            window.location.href = '/profile?query=' + friend_id;
        });
    }
});

$friendSearchBar.bind('click', function() {

    $.getJSON('/friends/fetch', function(data) {
        // Hide and show the correct divs.
        $friendSearchContent.show();

        if (data.error) {
            $friendSearchErrorBar.text(data.error);
        } else {
            friendsList = data.friends;
            searching = true;
        }
    });
});
