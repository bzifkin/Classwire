/**
 * Created by Austin on 11/16/15.
 */
var pg = require('pg');
var constr = 'postgres://bsbqmkru:DnBa-_N7DfYYJDMjfmz94_3ZBYS4FMxz@pellefant.db.elephantsql.com:5432/bsbqmkru';

//Queries
var LookupQuery = 'SELECT * FROM _user WHERE email = $1';
var CreateUserQuery = 'INSERT INTO _user (email, password, fname, lname, isAdmin) VALUES ($1, $2, $3, $4, $5)';
var IsAdminQuery = 'SELECT isAdmin FROM _user WHERE email = $1';
var UserCoursesQuery = 'SELECT c.id, c.course_number, c.course_title, c.semester FROM course c, takes t, student s WHERE s.user_id = $1 AND t.sid = s.user_id AND t.cid = c.id';
var ProfileInfoQuery = 'SELECT u.fname, u.lname, s.year, s.major, s.biography, s.activities, s.profile_picture_url' +
                        ' FROM student s, _user u ' +
                        'WHERE u.id = $1 AND s.user_id = $1';
var ConversationQuery = 'SELECT c.id, c.user1, c.user2, c.lastmessagesent, u.fname, u.lname' +
                        ' FROM conversation c, _user u' +
                        ' WHERE (c.user1=$1 OR c.user2=$1) AND (u.id=c.user1 OR u.id=c.user2) AND u.id<>$1' +
                        ' ORDER BY lastmessagesent';

var ConversationMessagesQuery = 'SELECT * FROM chat_messages WHERE conversation = $1 ORDER BY date_sent';
var ReportedContentQuery = 'SELECT * FROM reported_content';
var CalendarQuery = 'SELECT * FROM calendar WHERE course = $1';

var SaveBioQuery = 'UPDATE student SET biography = $1 WHERE user_id = $2';
var SaveActivitiesQuery = 'UPDATE student SET activities = $1 WHERE user_id = $2';


/* Takes a username, password and checks if that user exists in the database.

    email: A string representing the user's username.
    password: A String representing the user's password.
    callback: (error: String, user: {User}) -> Void
 */
function lookup(email, password, cb) {
    // (1) connect to the database:
  pg.connect(constr, (err, client, done) => {
    // (2) check for an error connecting:
    if (err) {
      cb('could not connect to the database: ' + err);
      return;
    }

    // (3) make the query if successful:
    client.query(LookupQuery, [email], (err, result) => {
      // call done to release the client back to the pool:
      done();

      // (4) check if there was an error querying database:
      if (err) {
        cb('could not connect to the database: ' + err);
        return;
      }

      // (5) check to see if user exists:
      if (result.rows.length == 0) {
        cb('user with email ' + email + ' does not exist');
        return;
      }

      // (6) check the password:
      var u = result.rows[0];
      if (u.password != password) {
        cb('password for ' + u.fname + ' is not correct');
        return;
      }

      // (7) otherwise, we invoke the callback with the user data.
      cb(undefined, u);
    });

  });
}

/* Takes a user dictionary and creates a new user in the database.

 User {email, password, fname, lname}
 callback: (error: String, user: {User}) -> Void
 */
function registerUser(user, cb) {
    // (1) connect to the database:
  pg.connect(constr, (err, client, done) => {
    // (2) check for an error connecting:
    if (err) {
      cb('could not connect to the database: ' + err);
      return;
    }

    // Make sure this email hasn't already been used.
    client.query(LookupQuery, [user.email], (err, result) => {
      done();

      if (err) {
        cb('could not connect to the database: ' + err);
        return;
      }

      if (result.rows.length > 0) {
        cb('user with email ' + user.email + ' already exists');
        return;
      }

      // Now create the new user.
      client.query(CreateUserQuery, [user.email, user.password, user.fname, user.lname, 'F'], (err, result) => {
        done();

        if (err) {
          cb('could not connect to the database: ' + err);
          return;
        }

        // Query for the full uer object now that it exists;
        lookup(user.email, user.password, cb);
      });
    });
  });
}

/* Takes a user email and sees if they have admin privileges*/

function isAdmin(email, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        client.query(IsAdminQuery, [email], (err, result) => {
            done();

            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            var admin = result.rows[0];
            cb(undefined, admin);
        });
    });
}

function coursesForUser(id, cb) {
	pg.connect(constr, (err, client, done) => {
    // (2) check for an error connecting:
    if (err) {
      cb('could not connect to the database: ' + err);
      return;
    }

    // (3) make the query if successful:
    client.query(UserCoursesQuery, [id], (err, result) => {
      // call done to release the client back to the pool:
      done();

      // (4) check if there was an error querying database:
      if (err) {
        cb('could not connect to the database: ' + err);
        return;
      }

      // (5) check to see if user exists:
      if (result.rows.length == 0) {
        cb('No Courses are being taken at this time.');
        return;
      }
 	  cb(undefined, result.rows);
    });
  });
}

/*
Returns all the information needed to fill in the profile view
 */
function getProfileInfo(id, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:
        client.query(ProfileInfoQuery, [id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            // (5) check to see if user exists:
            if (result.rows.length == 0) {
                cb('No Courses are being taken at this time.');
                return;
            }
            cb(undefined, result.rows[0]);
        });
    });
}

/*
Returns all the users the current user has had conversations with
 */
function getConversation(id, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:
        client.query(ConversationQuery, [id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            // (5) check to see if user exists:
            if (result.rows.length == 0) {
                cb('You haven\'t started any conversations');
                return;
            }

            cb(undefined, result.rows);
        });
    });
}

/*
Returns all the messages for the given conversation id
 */
function getConversationMessages(id, cb) {
  pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:
        client.query(ConversationMessagesQuery, [id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            // (5) check to see if user exists:
            if (result.rows.length == 0) {
                cb('No messages yet.');
                return;
            }

            cb(undefined, result.rows);
        });
    });
}


function getReportedContent(cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:
        client.query(ReportedContentQuery, (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            // (5) check to see if user exists:
            if (result.rows.length == 0) {
                cb('No report content yet.');
                return;
            }

            cb(undefined, result.rows);
        });
    });
}

/*
Returns all the calendars for a given course
 */
function getCalendarsForCourse(id, cb) {
  pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(CalendarQuery, [id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            // (5) check to see if user exists:
            if (result.rows.length == 0) {
                cb('No calendars yet.');
                return;
            }

            cb(undefined, result.rows);
        });
    });
}

function saveBioData(id,biotext, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(SaveBioQuery, [biotext,id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

        });
    });
}

function saveActivitiesData(id,activities, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(SaveActivitiesQuery, [activities,id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

        });
    });
}

exports.lookup = lookup;
exports.registerUser = registerUser;
exports.isAdmin = isAdmin;
exports.coursesForUser = coursesForUser;
exports.getProfileInfo = getProfileInfo;
exports.getConversation = getConversation;
exports.getConversationMessages = getConversationMessages;
exports.saveBioData = saveBioData;
exports.saveActivitesData = saveActivitiesData;
