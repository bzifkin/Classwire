var express = require('express');

// This gives us access to the user database.
var database = require('../lib/database');

// This creates an express "router" that allows us to separate
// particular routes from the main application.
var router = express.Router();

// A list of users who are online:
var online = require('../lib/online').online;

// Check whether user's session exists and their login isn't expired
function isOnline(user) {
  return user && online[user.email] ? true : false;
}

router.post('/addCourse', (req, res) => {
	console.log('adding course');
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user]) {
    res.redirect('/');
  } else {
    // Pull the values from the form:
    var course_id = req.body.course_id;

    if (!course_id) {
      req.flash('home', 'did not provide the proper a course id');
      res.redirect('/'); 
    } else {
      	database.lookupClass(course_id, (error, course) => {
        	if (error) {
	          // Pass a message to login:
	          req.flash('home', error);
	          console.log(error);
	          res.redirect('/');
	        } else {
	        	console.log('user = ' + user);
	        	var userId = user.id;
         		database.addClass(userId, course_id, (error) => {
         			if (error) {
         			req.flash('home', error);
          			res.redirect('/');
         			} else {
         				console.log('Added class');
         				// Pass a message to main:
          				req.flash('home', 'Added Course!');
         		 		res.redirect('/');
         			}
         		});
        	}
      	});
    }
  }
});
exports.router = router;
exports.isOnline = isOnline;