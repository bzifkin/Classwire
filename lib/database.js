/**
 * Created by Austin on 11/16/15.
 */

/* Takes a username, password and checks if that user exists in the database.

    username: A string representing the user's username.
    password: A String representing the user's password.
    callback: (error: String, user: {User}) -> Void
 */
function lookup(username, password, callback) {
    callback('Username or Password is incorrect', undefined);
}

exports.lookup = lookup;
