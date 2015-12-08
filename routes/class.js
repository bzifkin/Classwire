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
  var data = {};

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

	        	var userId = user.id;
                database.isUserInClass(userId,course_id,function(err, results){
                    console.log(results);
                    if (err) {
                        data.error = err;
                        res.redirect('/',data);
                    } else if (results.length > 0) {
                        data.error = "You're already taking this course!";
                        req.flash('home', 'You\'re already taking this course!');
                        res.redirect('/');
                    }else{
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
      	});
    }
  }
});
exports.router = router;
exports.isOnline = isOnline;