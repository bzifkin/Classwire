/**
 * Created by Austin on 11/16/15.
 */
var pg = require('pg');

//Queries
var LookupQuery = 'SELECT * FROM _user WHERE email = $1';
var CreateUserQuery = 'INSERT INTO _user (email, password, fname, lname, isAdmin) VALUES ($1, $2, $3, $4, $5)';
var IsAdminQuery = 'SELECT isAdmin FROM _user WHERE email = $1';
var UserCoursesQuery = 'SELECT * FROM class'
var constr = 'postgres://bsbqmkru:DnBa-_N7DfYYJDMjfmz94_3ZBYS4FMxz@pellefant.db.elephantsql.com:5432/bsbqmkru';


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

    client.query(CreateUserQuery, [user.email, user.password, user.fname, user.lname, 'F'], (err, result) => {
      done();

      if (err) {
        cb('could not connect to the database: ' + err);
        return;
      }

      var u = result.rows[0];
      console.log(user);
      cb(undefined, user);
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
            console.log(admin);
            cb(undefined, admin);
        });
    });
}

function coursesForUser(id, cb) {

}

exports.lookup = lookup;
exports.registerUser = registerUser;
exports.isAdmin = isAdmin;
exports.coursesForUser = coursesForUser;
