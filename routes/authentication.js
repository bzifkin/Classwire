/**
 * Created by Austin on 11/16/15.
 */

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

function authenticateLogin(req, res, next) {
  // Get the user session if it exists.
  var user = req.session.user;

  // If no session, redirect to login.
  if (!user) {
    res.redirect('/auth/login');
  }
  else if (user && !online[user.email]) {
    req.flash('login', 'Login Expired');
    delete req.session.user;
    res.redirect('/auth/login')
  } else {
    next();
  }
}

//Performs normal login checks but checks to see if the user
//is admin before allowing them onto the admin page.
//Admin privilege is only granted for specific user at the database level
function authenticateAdmin(req, res, next){
    var user = req.session.user;

    if (!user) {
        res.redirect('/auth/login');
    }
    else if (user && !online[user.email]) {
        req.flash('login', 'Login Expired');
        delete req.session.user;
        res.redirect('/auth/login')
    } else {
        //Queries the database to see if the user is admin. If so, they are directed to that page.
        //Otherwise they are brought to profile and flashed a message.
        database.isAdmin(user.email, function(err, result){
            if(result.isadmin === "T"){
                next();
            }else{
                req.flash('profile', 'You don\'t have admin privileges.');
                res.redirect('/profile')
            }
        });
    }
}

router.get('/login', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.email]) {
    res.redirect('/');
  }

  else {
    // Grab any messages being sent to us from redirect:
    var messageLogin = req.flash('login') || '';
    var messageRegister = req.flash('register') || '';
    res.render('login', {
      messageLogin: messageLogin,
      messageRegister: messageRegister
    });
  }
});

// Authorize login credentials.
router.post('/auth', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user]) {
    res.redirect('/');
  }

  else {
    // Pull the values from the form:
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      req.flash('login', 'did not provide the proper credentials');
      res.redirect('/auth/login');
    }
    else {
      database.lookup(email, password, (error, user) => {
        if (error) {
          // Pass a message to login:
          req.flash('login', error);
          res.redirect('/auth/login');
        }
        else {
          // add the user to the map of online users:
          online[user.email] = user;

          // create a session variable to represent stateful connection
          req.session.user = user;

          // Pass a message to main:
          req.flash('home', 'authentication successful');
          res.redirect('/');
        }
      });
    }
  }
});

// Create a new user.
router.post('/register', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user]) {
    res.redirect('/');
  }

  else {
    // Pull the values from the form:
    var email = req.body.email;
    var password = req.body.password;
    var fname = req.body.fname;
    var lname = req.body.lname;

    if (!email || !password || ! fname || !lname) {
      req.flash('register', 'did not provide the proper credentials');
      res.redirect('/auth/login');
    }

    else {
      database.registerUser({email: email, password: password, fname: fname, lname: lname}, (error, user) => {
        if (error) {
          // Pass a message to login:
          req.flash('register', error);
          res.redirect('/auth/login');
        }
        else {
          // add the user to the map of online users:
          online[user.email] = user;

          // create a session variable to represent stateful connection
          req.session.user = user;

          // Pass a message to main:
          req.flash('home', 'User successfully created');
          res.redirect('/');
        }
      });
    }
  }
});

exports.router = router;
exports.isOnline = isOnline;
exports.authenticateLogin = authenticateLogin;
exports.authenticateAdmin = authenticateAdmin;
