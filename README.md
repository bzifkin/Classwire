# Classwire
Team Rose Gold's awesome web app

## Overview
	Classwire aims to provide a platform for students to connect, collaborate, and learn together with their classmates. While in college, many students find themselves in large class lectures. These lectures can often contain several hundred students. In such large lectures, students often have difficulty connecting with other students in the class. Classwire looks to solve this problem by creating social communities formed by the students in a class. Connecting with classmates offers a myriad of advantages to students, including shared resources, help keeping track of assignments, support systems, friendships, and networking to name a few. Whether a student wants to meet other classmates to succeed in class or just to make new friends with a common interest, Classwire helps make the introduction. 

## How To Run
	--FILL THIS IN. HOW DO WE RUN THE APP?
 
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

## Libraries
	--Fill in
## Views
	--Fill in
## Statefulness
	--Fill in
## Persistence
	--Fill in
