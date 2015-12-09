/**
 * Created by Austin on 11/16/15.
 */
var pg = require('pg');
var constr = 'postgres://bsbqmkru:DnBa-_N7DfYYJDMjfmz94_3ZBYS4FMxz@pellefant.db.elephantsql.com:5432/bsbqmkru';

//Queries
var LookupQuery = 'SELECT * FROM _user WHERE email = $1';
var LookupClassQuery = 'SELECT * FROM course WHERE id = $1';

var CreateUserQuery = 'INSERT INTO _user (email, password, fname, lname, isAdmin) VALUES ($1, $2, $3, $4, $5)';
var CreateStudentQuery = 'INSERT INTO student(user_id) VALUES($1)';
var IsAdminQuery = 'SELECT isAdmin FROM _user WHERE email = $1';
var UserCoursesQuery = 'SELECT c.id, c.course_number, c.course_title, c.semester FROM course c, takes t, student s' +
                       ' WHERE s.user_id = $1 AND t.sid = s.user_id AND t.cid = c.id';

var ProfileInfoQuery = 'SELECT u.fname, u.lname, s.year, s.major, s.biography, s.activities, s.profile_picture_url' +
                        ' FROM student s, _user u ' +
                        'WHERE u.id = $1 AND s.user_id = $1';

var ConversationQuery = 'SELECT c.id, c.user1, c.user2, c.lastmessagesent, u.fname, u.lname' +
                        ' FROM conversation c, _user u' +
                        ' WHERE (c.user1=$1 OR c.user2=$1) AND (u.id=c.user1 OR u.id=c.user2) AND u.id<>$1' +
                        ' ORDER BY lastmessagesent DESC';

var ConversationMessagesQuery = 'SELECT m.message, m.date_sent, m.from_user, u.fname, u.lname' +
                                ' FROM chat_messages m, _user u' +
                                ' WHERE m.conversation = $1 AND u.id=m.from_user' +
                                ' ORDER BY date_sent ASC';

var ClassMessagesQuery = 'SELECT m.message, m.date_sent, m.from_user, u.fname, u.lname' +
                         ' FROM class_messages m, _user u' +
                         ' WHERE m.course = $1 AND u.id=m.from_user' +
                         ' ORDER BY date_sent ASC';

var CreateMessageQuery = 'INSERT INTO chat_messages (from_user, date_sent, conversation, message)' +
                         ' VALUES ($1, NOW(), $2, $3)';
var CreateClassMessageQuery = 'INSERT INTO class_messages (from_user, date_sent, course, message)' +
                              ' VALUES ($1, NOW(), $2, $3)';

var UpdateConversationDate = 'UPDATE conversation SET lastmessagesent = NOW() WHERE id = $1';

var ReportedContentQuery = 'select v.fname as authf, v.lname as authl, t.fname as reportf, t.lname as reportl, ' +
                            'c.message, r.explanation, r.reported_content'+
                            ' from _user t CROSS JOIN _user v, reported_content r, chat_messages c'+
                            ' where v.id = r.author AND t.id = r.report_user AND c.id = r.reported_content';

var CalendarQuery = 'SELECT c.id, calendar_date, title, description, course_title, course_number' +
                    ' FROM calendar c' +
                    ' INNER JOIN course u' +
                    ' ON c.course = u.id' +
                    ' WHERE c.course = $1';

var GetUsersCalendarQuery = 'SELECT s.id as calendar_id, t.sid as student_id, course, calendar_date, title, description, course_number'+
                            ' FROM calendar s, course c INNER JOIN takes t'+
                            ' ON t.cid = c.id'+
                            ' WHERE t.sid = $1 AND c.id = s.course';

var GetAllUsersResourcesQuery = 'SELECT t.sid as student_id, c.id, course_number, f.name, course_title, date_created, f.url'+
                                ' FROM file f, course c INNER JOIN takes t'+
                                ' ON t.cid = c.id'+
                                ' WHERE t.sid = $1 AND f.course = c.id' +
                                ' ORDER BY date_created DESC';

var SaveBioQuery = 'UPDATE student SET biography = $1 WHERE user_id = $2';
var SaveActivitiesQuery = 'UPDATE student SET activities = $1 WHERE user_id = $2';
var SaveProfileUrlQuery = 'UPDATE student s SET profile_picture_url = $1 WHERE user_id = $2';

var GetFriendsQuery = 'SELECT DISTINCT c.course_number, c.course_title, u.id, u.fname, u.lname' +
                      ' FROM course c, _user u, takes t' +
                      ' WHERE u.id <> $1 AND u.id = t.sid AND t.cid = c.id AND c.id IN' +
                      ' (SELECT c2.id FROM course c2, takes t2 WHERE t2.sid = $1 AND t2.cid = c.id)';

var GetConversationForBothUsersQuery = 'SELECT c.id, c.user1, c.user2, c.lastmessagesent, u.fname, u.lname' +
                                       ' FROM conversation c, _user u' +
                                       ' WHERE ((c.user1 = $1 AND c.user2 = $2) OR (c.user1 = $2 AND c.user2 = $1))' +
                                              ' AND u.id = $2';
var CreatePrivateConversationQuery = 'INSERT INTO conversation (user1, user2, lastmessagesent) VALUES ($1, $2, NOW())';

var DeleteReportedContentQuery = 'DELETE FROM reported_content'+
                                ' WHERE reported_content = $1';
var DeleteReportedMessageQuery = ' DELETE FROM chat_messages'+
                                 ' WHERE id = $1';

var AddCalendarEvent = 'INSERT INTO calendar(course, calendar_date, title, description) VALUES($1, $2, $3, $4)';

var SaveGraduationYearQuery = 'UPDATE student SET year = $1 WHERE user_id = $2';
var SaveMajorQuery = 'UPDATE student SET major = $1 WHERE user_id = $2';

var addClassQuery = 'INSERT INTO Takes(sid, cid) VALUES($1, $2)';
var studentIDQuery = 'SELECT * FROM Student WHERE user_id=$1';

var IsUserInClassQuery = 'select * from takes where sid = $1 AND cid = $2';

var GetUsersForCourseQuery = 'SELECT u.id, u.fname, u.lname, s.profile_picture_url' +
                             ' FROM _user u, takes t, student s' +
                             ' WHERE t.cid = $1 AND t.sid = u.id AND u.id <> $2 AND u.id = s.user_id';

var SaveResourceQuery = 'INSERT INTO File(name, course, owner, date_created, url) VALUES($1, $2, $3,NOW(), $4)';
var GetClassResources = 'SELECT * FROM File WHERE course = $1';
var GetUserResources = 'SELECT * FROM File WHERE owner = $1';

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

function lookupClass(class_id, cb) {
    // (1) connect to the database:
  pg.connect(constr, (err, client, done) => {
    // (2) check for an error connecting:
    if (err) {
      cb('could not connect to the database: ' + err);
      return;
    }

    // (3) make the query if successful:
    client.query(LookupClassQuery, [class_id], (err, result) => {
      // call done to release the client back to the pool:
      done();

      // (4) check if there was an error querying database:
      if (err) {
        cb('could not connect to the database: ' + err);
        return;
      }

      var u = result.rows[0];
      // (5) check to see if user exists:
      if (result.rows.length == 0) {
        cb('class with id ' + class_id + ' does not exist');
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

function createStudent(userId, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        client.query(CreateStudentQuery, [userId], (err, result) => {
            done();

            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            cb(undefined);
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
            //
            //// (5) check to see if user exists:
            //if (result.rows.length == 0) {
            //    cb('No Courses are being taken at this time.');
            //    return;
            //}
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

/*
 Returns all the messages for the given course id
 */
function getClassMessages(course_id, cb) {
  pg.connect(constr, (err, client, done) => {
    // (2) check for an error connecting:
    if (err) {
      cb('could not connect to the database: ' + err);
      return;
    }

    // (3) make the query if successful:
    client.query(ClassMessagesQuery, [course_id], (err, result) => {
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

function createNewMessage(sender_id, conv_id, msg, cb) {
  pg.connect(constr, (err, client, done) => {
    // (2) check for an error connecting:
    if (err) {
      cb('could not connect to the database: ' + err);
      return;
    }

    // (3) make the query if successful:
    client.query(CreateMessageQuery, [sender_id, conv_id, msg], (err, result) => {
      // call done to release the client back to the pool:
      done();

      // (4) check if there was an error querying database:
      if (err) {
        cb('could not connect to the database: ' + err);
        return;
      }

      cb(undefined, {success: true});

      client.query(UpdateConversationDate, [conv_id], (err, result) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
}

function createNewClassMessage(sender_id, course_id, msg, cb) {
  pg.connect(constr, (err, client, done) => {
    // (2) check for an error connecting:
    if (err) {
      cb('could not connect to the database: ' + err);
      return;
    }

    // (3) make the query if successful:
    client.query(CreateClassMessageQuery, [sender_id, course_id, msg], (err, result) => {
      // call done to release the client back to the pool:
      done();

      // (4) check if there was an error querying database:
      if (err) {
        cb('could not connect to the database: ' + err);
        return;
      }

      cb(undefined, {success: true});
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
            }

        });
    });
}

function saveProfilePictureUrl(url,id, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(SaveProfileUrlQuery, [url,id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            cb();
        });
    });
}

function saveResource(url,name,cid,id, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(SaveResourceQuery, [name,cid,id, url], (err, result) => {
            // call done to release the client back to the pool:
            done();
            console.log("Error: -> " + err);
            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            cb();
        });
    });
}

function getPossibleFirends(userId, cb) {
  pg.connect(constr, (err, client, done) => {
    // (2) check for an error connecting:
    if (err) {
      cb('could not connect to the database: ' + err);
      return;
    }

    // (3) make the query if successful:

    client.query(GetFriendsQuery, [userId], (err, result) => {
      // call done to release the client back to the pool:
      done();

      // (4) check if there was an error querying database:
      if (err) {
        cb('could not connect to the database: ' + err);
        return;
      }

      // (5) check to see if we got results.
      if (result.rows.length == 0) {
        cb('No friends :(');
        return;
      }

      cb(undefined, result.rows);
    });
  });
}

function getConversationForBothUsers(userId, friendId, cb) {
  pg.connect(constr, (err, client, done) => {
    // (2) check for an error connecting:
    if (err) {
      cb('could not connect to the database: ' + err);
      return;
    }

    // (3) make the query if successful:

    client.query(GetConversationForBothUsersQuery, [userId, friendId], (err, result) => {
      // call done to release the client back to the pool:
      done();

      // (4) check if there was an error querying database:
      if (err) {
        cb('could not connect to the database: ' + err);
        return;
      }

      cb(undefined, result.rows);
    });
  });
}

function createPrivateConversation(userId, friendId, cb) {
  pg.connect(constr, (err, client, done) => {
    // (2) check for an error connecting:
    if (err) {
      cb('could not connect to the database: ' + err);
      return;
    }

    // (3) make the query if successful:

    client.query(CreatePrivateConversationQuery, [userId, friendId], (err, result) => {
      // call done to release the client back to the pool:
      done();

      // (4) check if there was an error querying database:
      if (err) {
        cb('could not connect to the database: ' + err);
        return;
      }

      // Return the conversation we just made.
      getConversationForBothUsers(userId, friendId, cb);
    });
  });
}


function deleteReportedContent(messageId, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(DeleteReportedContentQuery, [messageId], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            client.query(DeleteReportedMessageQuery, [messageId], (err, result) => {
                // call done to release the client back to the pool:
                done();

                // (4) check if there was an error querying database:
                if (err) {
                    cb('could not connect to the database: ' + err);
                    return;
                }
                cb(undefined);
            });

        });
    });
}

function allowReportedContent(messageId, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(DeleteReportedContentQuery, [messageId], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            cb(undefined);
        });
    });
}

function getUsersCalendar(userId, cb) {
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(GetUsersCalendarQuery, [userId], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            cb(undefined, result.rows);
        });
    });
}
GetClassResources


function getClassResources(classId, cb) {
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(GetClassResources, [classId], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            cb(undefined, result.rows);
        });
    });
}



function addCalendarEvent(courseId,calendarDate,title,description, cb) {
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(AddCalendarEvent, [courseId,calendarDate,title,description], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            cb(undefined);
        });
    });
}

function saveMajorData(id,major, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(SaveMajorQuery, [major,id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
            }

        });
    });
}

function saveGraduationYearData(id,year, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(SaveGraduationYearQuery, [year,id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
            }

        });
    });
}

function addClass(sid, cid, cb) {
  pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        // (3) make the query if successful:

        client.query(addClassQuery, [sid,cid], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
              console.log('Error:'+ err);
                cb('could not connect to the database: ' + err);
                return;
            }

            cb(undefined);
        });
    });
}

function getStudentIDForUser(user_id, cb) {
  pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        client.query(studentIDQuery, [user_id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
              console.log('Error:'+ err);
                cb('could not connect to the database: ' + err);
                return;
            }
            if (result.rows.length == 0) {
                cb('No student');
                return;
            }
            var student = result[0];
            cb(undefined, student.user_id);
        });
  });
}

function isUserInClass(user_id,course_id, cb) {
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        client.query(IsUserInClassQuery, [user_id, course_id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                console.log('Error:'+ err);
                cb('could not connect to the database: ' + err);
                return;
            }


            cb(undefined, result.rows);
        });
    });
}

function getUsersForCourse(user_id, course_id, cb) {
  pg.connect(constr, (err, client, done) => {
    // (2) check for an error connecting:
    if (err) {
      cb('could not connect to the database: ' + err);
      return;
    }

    client.query(GetUsersForCourseQuery, [course_id, user_id], (err, result) => {
      // call done to release the client back to the pool:
      done();

      // (4) check if there was an error querying database:
      if (err) {
        cb('could not connect to the database: ' + err);
        return;
      }


      cb(undefined, result.rows);
    });
  });
}

function getAllUserResources(user_id, cb){
    pg.connect(constr, (err, client, done) => {
        // (2) check for an error connecting:
        if (err) {
            cb('could not connect to the database: ' + err);
            return;
        }

        client.query(GetAllUsersResourcesQuery, [user_id], (err, result) => {
            // call done to release the client back to the pool:
            done();

            // (4) check if there was an error querying database:
            if (err) {
                cb('could not connect to the database: ' + err);
                return;
            }

            cb(undefined, result.rows);
        });
    });
}

exports.lookup = lookup;
exports.lookupClass = lookupClass;
exports.registerUser = registerUser;
exports.isAdmin = isAdmin;
exports.coursesForUser = coursesForUser;
exports.getProfileInfo = getProfileInfo;
exports.getConversation = getConversation;
exports.getConversationMessages = getConversationMessages;
exports.getClassMessages = getClassMessages;
exports.saveBioData = saveBioData;
exports.saveActivitesData = saveActivitiesData;
exports.saveProfilePictureUrl = saveProfilePictureUrl;
exports.createNewMessage = createNewMessage;
exports.createNewClassMessage = createNewClassMessage;
exports.getReportedContent = getReportedContent;
exports.getUsersCalendar = getUsersCalendar;
exports.getCalendarsForCourse = getCalendarsForCourse;
exports.getClassResources = getClassResources;
exports.getPossibleFriends = getPossibleFirends;
exports.getConversationForBothUsers = getConversationForBothUsers;
exports.createPrivateConversation = createPrivateConversation;
exports.deleteReportedContent = deleteReportedContent;
exports.allowReportedContent = allowReportedContent;
exports.getUsersCalendar = getUsersCalendar;
exports.addCalendarEvent = addCalendarEvent;
exports.createStudent = createStudent;
exports.saveGraduationYearData = saveGraduationYearData;
exports.saveMajorData = saveMajorData;
exports.addClass = addClass;
exports.isUserInClass = isUserInClass;
exports.getUsersForCourse = getUsersForCourse;
exports.saveResource = saveResource;
exports.getAllUserResources = getAllUserResources;