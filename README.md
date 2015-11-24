# Classwire
Team Rose Gold's awesome web app

## Overview

Classwire aims to provide a platform for students to connect, collaborate, and learn together with their classmates. While in college, many students find themselves in large class lectures. These lectures can often contain several hundred students. In such large lectures, students often have difficulty connecting with other students in the class. Classwire looks to solve this problem by creating social communities formed by the students in a class. Connecting with classmates offers a myriad of advantages to students, including shared resources, help keeping track of assignments, support systems, friendships, and networking to name a few. Whether a student wants to meet other classmates to succeed in class or just to make new friends with a common interest, Classwire helps make the introduction. 

## How To Run
	--FILL THIS IN. HOW DO WE RUN THE APP?

## Libraries
	--Fill in
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

## Persistence
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
```
#### School
```
id: Serial
name: varchar(50)
email_extension: varchar(20)
```
#### Course
```
id: Serial
course_number: int
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
```
#### Chat_Messages:
```
id: Serial
from_user: references User
to_user: references User
date: date
```
