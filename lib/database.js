/**
 * Created by Austin on 11/16/15.
 */

/* Takes a username, password and checks if that user exists in the database.

    email: A string representing the user's username.
    password: A String representing the user's password.
    callback: (error: String, user: {User}) -> Void
 */
function lookup(email, password, callback) {
    callback('Database not set up', undefined);
}

/* Takes a username, password and creates a new user.

 email: A string representing the user's username.
 password: A String representing the user's password.
 callback: (error: String, user: {User}) -> Void
 */
function registerUser(email, password, callback) {
    callback('Database not set up', undefined);
}

exports.lookup = lookup;
exports.registerUser = registerUser;
