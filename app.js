// This requires the necessary libraries for the webapp.
// (1) express - this provides the express web framework
// (2) handlebars - this provides the handlebars templating framework
var express    = require('express');
var handlebars = require('express-handlebars');

// The body parser is used to parse the body of an HTTP request.
var bodyParser = require('body-parser');

// Require session library.
var session    = require('express-session');

// Require flash library.
var flash      = require('connect-flash');

// The cookie parser is used to parse cookies in an HTTP header.
var cookieParser = require('cookie-parser');

var fs = require('fs');

var multer = require('multer');

var upload = multer({ dest: 'public/uploads' });

//////////////////////////////////////////////////////////////////////
///// Express App Setup //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// The express library is a simple function. When you invoke this
// function it returns an express web application that you build from.
var app = express();

var router = express.Router();



// This will set an "application variable". An application variable is
// a variable that can be retrieved from your app later on. It is
// simply a key/value mapping. In this case, we are mapping the key
// 'port' to a port number. The port number will either be what you
// set for PORT as an environment variable (google this if you do not
// know what an evironment variable is) or port 3000.
app.set('port', process.env.PORT || 3000);

// This does the setup for handlebars. It first creates a new
// handlebars object giving it the default layout. This indicates
// that the default layout is called main.js in the views/layouts
// directory. We then set the app's view engine to 'handlebars' - this
// lets your express app know what the view engine is. We then set an
// app variable 'view engine' to 'handlebars'. This is mostly boiler
// plate so you need not worry about the details.
var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

// This does the setup for static file serving. It uses express'
// static middleware to look for files in /public if no other route
// matches. We use the __dirname special variable which indicates the
// directory this server is running in and append it to '/public'.
app.use(express.static(__dirname + '/public'));

// The `testmw` function represents out testing middleware. We use
// this in our views to conditionally include the Mocha and Chai
// testing framework as well as our own tests. Because this is a
// middleware function it expects to receive the request object
// (`req`), response object (`res`), and `next` function as arguments.
// The `next` function is used to continue processing the request
// with subsequent routes.
function testmw(req, res, next) {
  // This checks the 'env' application variable to determine if we are
  // in "production" mode. An application is in "production" mode if
  // it is actually deployed. This can be set by the NODE_ENV
  // environment variable. It also checks to see if the request has
  // given a `test` querystring parameter, such as
  // http://localhost:3000/about?test=1. If the route has that set
  // then showTests will be set to a "truthy" value. We can then
  // use that in our handlebars views to conditionally include tests.
  res.locals.showTests = app.get('env') !== 'production' &&
                         req.query.test;
  // Passes the request to the next route handler.
  next();
}

// This adds our testing middleware to the express app.
app.use(testmw);

// Body Parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cookie Parser:
app.use(cookieParser());

// Session Support:
app.use(session({
  secret: 'octocat',
  // Both of the options below are deprecated, but should be false
  // until removed from the library - sometimes, the reality of
  // libraries can be rather annoying!
  saveUninitialized: false, // does not save uninitialized session.
  resave: false             // does not save session if not modified.
}));

// Use Flash
app.use(flash());

//////////////////////////////////////////////////////////////////////
///// User Defined Routes ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
var team = require('./lib/team');
var database = require('./lib/database');
var authentication = require('./routes/authentication');
var course = require('./routes/class');
var authenticateLogin = authentication.authenticateLogin;
var authenticateAdmin = authentication.authenticateAdmin;

// Setup sockets.io
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log("User connected");

  socket.on('subscribe', (conv_id) => {
    console.log('Joining conversation: ' + conv_id);
    socket.join(conv_id);
  });

  socket.on('send_message', (data) => {
    // Display the message to clients in this conversation.
    var msg_data = {from_user: data.sender_info.user_id,
                    fname: data.sender_info.fname,
                    lname: data.sender_info.lname,
                    message: data.msg};
    io.sockets.in(data.conv_id).emit('display_private_message', msg_data, data.conv_id);

    // Save the message in the database.
    database.createNewMessage(data.sender_info.user_id, data.conv_id, data.msg, (err, success) => {
      if (err) {
        console.log('Error saving message: ' + err);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log("User disconnected");
  });
});

// Routes involving user login and registration.
app.use('/auth', require('./routes/authentication').router);

//Routes involving classes
app.use('/course', require('./routes/class').router);


app.post('/addevent', upload.single('photo'), function (req, res) {
    var userId = req.session.user.id;
    console.log(userId);

      var courseId = "1"
      var calendarDate = req.body.date;
      var title = req.body.name;
      var description = req.body.description;
      database.addCalendarEvent(courseId, calendarDate, title, description, (err, results)=> {
        if(err){
              console.log(err);
            }else{
                //added
            }
      });
     console.log(calendarDate +" " +title + " " + description)
     res.redirect("/class");
     res.end();
});

/*
This allows users to uploads a profile picture to their profile
Relies on a library called multer which takes in form data files
 */
app.post('/upload', upload.single('photo'), function (req, res, next) {
    var userId = req.session.user.id;

    console.log(req.file);

    if(typeof req.file === 'undefined'){
        //maybe add logic here to do something
    }else {

        var imageName = req.file.originalname;

        if (!imageName) {

            console.log("There was an error");
            res.redirect("/");
            res.end();

        } else {

            var newPath = req.file.path;

            fs.readFile(newPath, function (err, data) {

                //Saves the path of the picture in the database so it can be found when a profile is loaded
                database.saveProfilePictureUrl('/uploads/' + req.file.filename, userId, function () {
                    console.log('saved path successfully.');
                    res.redirect('back');
                });

                /// write file to uploads folder
                fs.writeFile(newPath, data, function (err) {

                });
            });
        }
    }

});

/*
Saves biography of the user's profile
 */
app.post('/savebio',(req,res) => {
    var userId = req.session.user.id;
    var body = req.body;
    var bioText = body['val'];

    database.saveBioData(userId, bioText, function(err){
        console.log(err);
    });
});

/*
Saves activities of the user's profile
 */
app.post('/saveact',(req,res) => {
    var userId = req.session.user.id;
    var body = req.body;
    var activities = body['val'];

    database.saveActivitesData(userId, activities, function(err){
        console.log(err);
    });
});

app.post('/savegrad',(req,res) => {
    var userId = req.session.user.id;
    var body = req.body;
    var gradYear = body['val'];

    database.saveGraduationYearData(userId, gradYear, function(err){
        console.log(err);
    });
});

app.post('/savemajor',(req,res) => {
    var userId = req.session.user.id;
    var body = req.body;
    var major = body['val'];

    database.saveMajorData(userId, major, function(err){
        console.log(err);
    });
});

app.post('/deletereportedcontent', (req,res) => {
   var body = req.body;
   var messageId = body['messageId'];

   database.deleteReportedContent(messageId, function(err, result){
      res.send({success:true});
   });
});

app.post('/allowreportedcontent', (req,res) => {
    var body = req.body;
    var messageId = body['messageId'];

    database.allowReportedContent(messageId, function(err, result){
        res.send({success:true});
    });
});

// Home/Splash screen.
app.get('/', authenticateLogin, (req, res) => {
  // Check whether the user's logged in and online
  // If so, render the home view
  if(authentication.isOnline(req.session.user)) {
    var userId = req.session.user.id;

    var events = '';
    database.getUsersCalendar(userId, (err, result) => {
      var message = '';
      if (err) {
        message = err;
        console.log("error : " + message);
      }
      events = result;
    });

    console.log("events : " + events);

    var courses = '';
    database.coursesForUser(userId, (err, result) => {
      var message = '';
      if (err) {
        message = err;
      }
      courses = result;
    });
    console.log("courses : " + courses);



      res.render('home', {
        courses: courses,
        calendar: [
          {
            date: '03/21/15',
            title: 'Assignment 1 Deadline',
            description: 'This is the deadline of some very important assignment that you best get done.',
            className: "CS326"
          },
          {
            date: '03/24/15',
            title: 'Assignment 2 Deadline',
            description: 'This is the deadline of some very important assignment that you best get done.',
            className: "MA233"
          }
        ],
        resources: [
          {
            title: 'Assignment One',
            timestamp: '04:12:53 03/12/15',
            filepath: 'http://amazons3storagecdnorthelike.com/assignment-one.zip',
            filename: 'assignment-one.zip',
            className: "CS326"
          },
          {
            title: 'Assignment Two',
            timestamp: '05:12:53 03/12/15',
            filepath: 'http://amazons3storagecdnorthelike.com/assignment-two.zip',
            filename: 'assignment-two.zip',
            className: "AM264"
          },
          {
            title: 'Syllabus',
            timestamp: '06:12:53 03/12/15',
            filepath: 'http://amazons3storagecdnorthelike.com/syllabus.pdf',
            filename: 'syllabus.pdf',
            className: "CS325"
          }
        ],
        messages: [
          {
            timestamp: '13:04:12',
            name: 'John',
            message: 'hey how did you do on the test?'
          },
          {
            timestamp: '09:00:01',
            name: 'Sam',
            message: 'Meet you outside of class!'
          },
          {
            timestamp: '14:01:00',
            name: 'Michael',
            message: 'Call me 774-281-1001'
          }
        ]
      });
  // Otherwise, user is not logged in
  // Render the landing view
  } else {
    res.render('landing');
  }
});

app.get('/profile', authenticateLogin, (req, res) => {
  var message = req.flash('profile') || '';
  var data = {message: message, edits: true};
  var userId = req.session.user.id;

  var goToUser = req.query.query;

  if(typeof goToUser !== 'undefined'){
      userId = goToUser;
      data.edits = false;
  }

  // Start by getting user info.
  database.getProfileInfo(userId, (err, info) => {
    if (err) {
      data.message = err;
    } else {
      data.user = info;
    }

    // Now get user courses.
    database.coursesForUser(userId, (err, courses) => {
      if (err) {
        data.message = err;
      } else {
        data.courses = courses;
      }

      // Render with data.
      res.render('profile', data);
    });
  });
});

app.get('/admin', authenticateAdmin, (req, res) => {
    var message = req.flash('admin') || '';
    var data = {message: message};

  database.getReportedContent(function content(err, reportedContent){

    if(err){
        data.message = err;
    }else{
        data.reported = reportedContent;
    }

    console.log(data);

    res.render('admin', data);

  });
});

app.get('/class', authenticateLogin, (req, res) => {
  //res.render('class');

  var events = null;
    database.getCalendarsForCourse("courseId",function content(err, classEvents){
      if(err){
       message = err;
     }else{
       events = classEvents;
     }
   });

  res.render('class', {
    className: 'CS326',
    messages: [
      {
        timestamp: '16:07:34',
        name: 'Roo',
        message: 'hey is olive around?'
      },
      {
        timestamp: '16:18:42',
        name: 'Olive',
        message: 'yup I\'m here'
      },
      {
        timestamp: '19:05:09',
        name: 'Roo',
        message: 'cool.'
      }
    ],
    calendar: [
      {
        date: '03/21/15',
        title: 'Assignment 1 Deadline',
        description: 'This is the deadline of some very important assignment that you best get done.'
      },
      {
        date: '03/24/15',
        title: 'Assignment 2 Deadline',
        description: 'This is the deadline of some very important assignment that you best get done.'
      }
    ],
    resources: [
      {
        title: 'Assignment One',
        timestamp: '04:12:53 03/12/15',
        filepath: 'http://amazons3storagecdnorthelike.com/assignment-one.zip',
        filename: 'assignment-one.zip'
      },
      {
        title: 'Assignment Two',
        timestamp: '05:12:53 03/12/15',
        filepath: 'http://amazons3storagecdnorthelike.com/assignment-two.zip',
        filename: 'assignment-two.zip'
      },
      {
        title: 'Syllabus',
        timestamp: '06:12:53 03/12/15',
        filepath: 'http://amazons3storagecdnorthelike.com/syllabus.pdf',
        filename: 'syllabus.pdf'
      }
    ],
    members: [
      {
        name: 'Roo',
        year: 'Senior'
      },
      {
        name: 'Olive',
        year: 'Freshman'
      }
    ]
  });
});

app.get('/messages', authenticateLogin, (req, res) => {
  var message = req.flash('messages') || '';
  var data = {message: message, sender: req.session.user};
  var userId = req.session.user.id;

  // First get all conversations that involve us.
  database.getConversation(userId, (err, results) => {
    if (err) {
      data.message = err;
      res.render('messages', data);
    } else {
      data.conversations = results;
      res.render('messages', data);
    }
  });
});

app.get('/messages/fetch', authenticateLogin, (req, res) => {
  var conv_id = req.query.conv_id;
  database.getConversationMessages(conv_id, (err, results) => {
    var data = {};
    if (err) {
      data.error = err;
    } else {
      data.messages = results;
    }
    res.send(data);
  });
});

app.get('/friends/fetch', authenticateLogin, (req, res) => {
  var user_id = req.session.user.id;
  database.getPossibleFriends(user_id, (err, results) => {
    var data = {};
    if (err) {
      data.error = err;
    } else {
      data.friends = results;
    }
    res.send(data);
  });
});

app.get('/messages/new_conversation', authenticateLogin, (req, res) => {
  var friend_id = req.query.friend_id;
  var user_id = req.session.user.id;
  var data = {};

  // First make sure this conversation doesn't already exist.
  database.getConversationForBothUsers(user_id, friend_id, (err, results) => {
    if (err) {
      data.error = err;
      res.send(data);
    } else if (results.length > 0) {
      data.error = "You're already talking to this friend!";
      res.send(data);
    }

    // Now create a new conversation and return it to the view.
    else {
      database.createPrivateConversation(user_id, friend_id, (err, results) => {
        if (err) {
          data.error = err;
        } else if (results.length === 0) {
          data.error = "Something went wrong. Please try again later";
        } else {
          data.conversation = results[0];
        }
        res.send(data);
      });
    }
  });
});

app.get('/team', (req, res) => {
  var result;
  if (req.query.user) {
    // Retrieve the selected user from the query.
    result = team.one(req.query.user);
  } else {
    // No query string, show the whole team.
    result = team.all();
  }

  if (!result.success) {
    notFound404(req, res);
  } else {
    res.render('team', {
      members: result.data,
      multiple: result.multiple,
      pageTestScript: '/qa/tests-team.js'
    });
  }
});


app.get('/about', (req, res) => {
  res.render('about')
});


//////////////////////////////////////////////////////////////////////
///// Error Middleware ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// A middleware function that will be invoked if no other route path
// has been matched. HTTP 404 indicates that the resource was not
// found. We set the HTTP status code in the response object to 404.
// We then render our views/404.handlebars view back to the client.
function notFound404(req, res) {
  res.status(404);
  res.render('404');
}

// A middleware function that will be invoked if there is an internal
// server error (HTTP 500). An internal server error indicates that
// a serious problem occurred in the server. When there is a serious
// problem in the server an additional `err` parameter is given. In
// our implementation here we print the stack trace of the error, set
// the response status code to 500, and render our
// views/500.handlebars view back to the client.
function internalServerError500(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
}

// This adds the two middleware functions as the last two middleware
// functions. Because they are at the end they will only be invoked if
// no other route defined above does not match.
app.use(notFound404);
app.use(internalServerError500);

//////////////////////////////////////////////////////////////////////
//// Application Startup /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// Starts the express application up on the port specified by the
// application variable 'port' (which was set above). The second
// parameter is a function that gets invoked after the application is
// up and running.
server.listen(app.get('port'), () => {
  console.log('Express started on http://localhost:' +
              app.get('port') + '; press Ctrl-C to terminate');
});

