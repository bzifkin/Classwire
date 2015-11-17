# Classwire
Team Rose Gold's awesome web app
 
 ## Data Model - SQL Statemts in setup.sql file
 
 #### _User

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
