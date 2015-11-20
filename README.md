# Classwire
Team Rose Gold's awesome web app

## Overview

Classwire aims to provide a platform for students to connect, collaborate, and learn together with their classmates. While in college, many students find themselves in large class lectures. These lectures can often contain several hundred students. In such large lectures, students often have difficulty connecting with other students in the class. Classwire looks to solve this problem by creating social communities formed by the students in a class. Connecting with classmates offers a myriad of advantages to students, including shared resources, help keeping track of assignments, support systems, friendships, and networking to name a few. Whether a student wants to meet other classmates to succeed in class or just to make new friends with a common interest, Classwire helps make the introduction. 

## How To Run
	--FILL THIS IN. HOW DO WE RUN THE APP?

## Libraries
	--Fill in
## Views
	--Fill in
## Statefulness

 All the authentication logic occurs in authentication.js(https://github.com/bzifkin/Classwire/blob/master/routes/authentication.js). Another file, app.js(https://github.com/bzifkin/Classwire/blob/master/app.js), uses the function authenticateLogin, which is inside authentication.js, to check to see if the user is appropriately signed in when they use routes which require logged in user information. These routes, found in the app.js, are profile,admin, class, messages, and calendar. The only route where no authentication is needed is the about page. When a user attempts to access them they are either authenticated as already signed in and appropriately redirected or have to complete sign in or sign up forms. The first place a user is brought to after a failed authentication is to the login.handlebars view (https://github.com/bzifkin/Classwire/blob/master/views/login.handlebars). From here, they can easily enter their credentials and sign into the application. If they do not have credentials, they can register on this same view right below the login form. 

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
