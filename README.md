# Classwire
Team Rose Gold's awesome web app

## Overview

Classwire aims to provide a platform for students to connect, collaborate, and learn together with their classmates. While in college, many students find themselves in large class lectures. These lectures can often contain several hundred students. In such large lectures, students often have difficulty connecting with other students in the class. Classwire looks to solve this problem by creating social communities formed by the students in a class. Connecting with classmates offers a myriad of advantages to students, including shared resources, help keeping track of assignments, support systems, friendships, and networking to name a few. Whether a student wants to meet other classmates to succeed in class or just to make new friends with a common interest, Classwire helps make the introduction. 

## How To Run
	1. Pull the project into a folder.
	2. Navigate to that folder in terminal. 
	3. Once in the folder, perform the command "npm install".
	4. Once done, use the command "node app.js" to start the application on your local machine.

## Libraries

[Body-Parser](https://github.com/expressjs/body-parser)

[Connect-Flash](https://github.com/jaredhanson/connect-flash)

[Cookie-Parser](https://github.com/expressjs/cookie-parser)

[Express](http://expressjs.com/en/index.html)

[Express-Handlebars](https://github.com/ericf/express-handlebars)

[Express-Session](https://www.npmjs.com/package/express-session)

[Multer](https://www.npmjs.com/package/multer)

[Pg](http://www.postgresql.org/)

[Socket.io](http://socket.io/)

	
## Views
#### admin.handlebars 
(https://github.com/bzifkin/Classwire/blob/master/views/admin.handlebars)
This admin view is where users can change the email address they registered with, their password, or their university.
They can also enable two-step verification for their account for added security.

####calendar.handlebars 
(https://github.com/bzifkin/Classwire/blob/master/views/calendar.handlebars)
-TBA

#### class.handlebars 
(https://github.com/bzifkin/Classwire/blob/master/views/class.handlebars)
The classes view is where users can access large chat hubs, resource directories, and a calendar view for each
of their individual classes. They'll be able to see the current members of their class and which users are online chatting. 
This will be used as place for students to communicate about the course and anything happening within.

#### home.handlebars 

(https://github.com/bzifkin/Classwire/blob/master/views/home.handlebars)
The home view is where users can see all the courses they are currently in, an aggregated calendar view of all the assignments due in their classes, and class resources from all their classes.

#### login.handlebars 
(https://github.com/bzifkin/Classwire/blob/master/views/login.handlebars)
The login view is where users can sign in to the application or register if they do not have an account.

#### messages.handlebars 
(https://github.com/bzifkin/Classwire/blob/master/views/messages.handlebars)
The messages view is where users can send and receive individual messages from classmates. In this view all the
people this user has received or sent messages to will be presented to them. Another faucet of this is messages will
persist throughout the application so on any view a user can receive and respond to messages without being in the
messages view.

#### profile.handlebars 
(https://github.com/bzifkin/Classwire/blob/master/views/profile.handlebars)
The profile view is the outward facing view other users will see when they come to that specific view. It contains
fields such as a profile picture, list of their current classes, a short bio (provided their wrote one), and any activities
they are in.
#### team.handlebars 
(https://github.com/bzifkin/Classwire/blob/master/views/team.handlebars)
A view detailing the members of the Classwire development team.

#### about.handlebars 
(https://github.com/bzifkin/Classwire/blob/master/views/about.handlebars)
A short view explaining what the app is all about.

## Statefulness

 All the authentication logic occurs in authentication.js(https://github.com/bzifkin/Classwire/blob/master/routes/authentication.js). Another file, app.js(https://github.com/bzifkin/Classwire/blob/master/app.js), uses the function authenticateLogin, which is inside authentication.js, to check to see if the user is appropriately signed in when they use routes which require logged in user information. These routes, found in the app.js, are profile,admin, class, messages, and calendar. There are two routes where no authentication the about and team page. When a user attempts to access them they are either authenticated as already signed in and appropriately redirected or have to complete sign in or sign up forms. The first place a user is brought to after a failed authentication is to the login.handlebars view (https://github.com/bzifkin/Classwire/blob/master/views/login.handlebars). From here, they can easily enter their credentials and sign into the application. If they do not have credentials, they can register on this same view right below the login form. 
 
 For admin authentication there is another method inside authentication.js called authenticateAdmin which is invoked when someone tries to access the admin route. This route and authentication pathway are only accessible if a user specifically enters "/admin" in the address bar. The user also needs admin privilege set to "T" in the database directly. There is no way to make a user an admin in the UI. This route calls the database to see if the current user is an admin and if they are allows them onto the view. Otherwise, they are brought to login if they are not logged in or back to their profile if they are logged in and have no privileges.

## Persistence
(https://github.com/bzifkin/Classwire/blob/master/lib/database.js)
Data is important. Especially if it is used for an application such as Classwire. That's why the Classwire team takes Persistence very seriously. For our database we are using postgressql. The database is hosted on (ElephantSQL.com). We have multiple tables to help make sure that data can easily be changed/updated and appended onto with ease. We promote Encapsulation! All of our tables talk to other tables by one form or another. In this case, its mostly by references by each tuple's id in a respective table. 
In our database.js file we created queries that will select the data that is needed for each view. We created these queries as string constants and then used them in our respective functions.

## Data Model - SQL Statemts in setup.sql file
 
#### User

 ```
uid: Serial
email: varchar(50) PRIMARY KEY
password: varchar(50)
fname: varchar(50)
lname: varchar(75)
isAdmin: varchar(1) or Bool
```

#### Student

```
id: Serial
user_id: references User
year: varchar(20)
major VARCHAR(50),
biography VARCHAR(500),
activities VARCHAR(1000),
profile_picture_url VARCHAR(200)
```
#### School
##### ***Currently this table is not being used, but would be used later down as we add more schools.***
```
id: Serial
name: varchar(50)
email_extension: varchar(20)
```
#### Course
```
id: Serial
course_number: varchar(7)
course_title: varchar(100)
semester: int
```
#### Takes
```
id: serial
sid: references Student
cid: references Course
```
#### Took
```
id: serial
sid: references Student
cid: references Course
```
#### File
```
id: Serial
name: varchar(75)
data: bytea
course: references Course
owner: references User
date_created: date
url VARCHAR(200)
```
#### Chat_Messages:
```
id: Serial
from_user: references User
date: date
conversation integer REFERENCES Conversation,
message VARCHAR(200)
```

#### Conversation
```
id: Serial Primary Key
user1 integer REFERENCES _User(id),
user2 integer REFERENCES _User(id),
lastMessageSent date
```

#### reported_content
```
id SERIAL PRIMARY KEY
author integer REFERENCES _User(id)
explanation VARCHAR(200)
report_user integer REFERENCES _User(id)
reported_content VARCHAR REFERENCES Chat_Messages(id)
```
#### Calendar
```
id: SERIAL PRIMARY KEY,
course: integer REFERENCES Course ,
calendar_date: date,
title: VARCHAR(100),
description: VARCHAR(500)
```
