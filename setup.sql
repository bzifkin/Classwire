
CREATE TABLE _User (
  id SERIAL UNIQUE,
  email VARCHAR(50) PRIMARY KEY,
  password VARCHAR(50),
  fname VARCHAR(50),
  lname VARCHAR(50),
  isAdmin VARCHAR(1)
);

CREATE TABLE Student (
  id SERIAL PRIMARY KEY,
  user_id integer UNIQUE REFERENCES _User(id),
  year VARCHAR(20),
  major VARCHAR(50),
  biography VARCHAR(500),
  activities VARCHAR(1000),
  profileURL VARCHAR(200)
);

CREATE TABLE School (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  email_extension VARCHAR(20)
);

CREATE TABLE Course (
  id SERIAL PRIMARY KEY,
  course_number int,
  course_title VARCHAR(100),
  semester int
);

CREATE TABLE Takes (
  id SERIAL PRIMARY KEY,
  sid integer REFERENCES Student,
  cid integer REFERENCES Course
);

CREATE TABLE Took (
  id SERIAL PRIMARY KEY,
  sid integer REFERENCES Student,
  cid integer REFERENCES Course
);

CREATE TABLE File (
  id SERIAL PRIMARY KEY,
  name VARCHAR(75),
  data bytea,
  course integer REFERENCES Course,
  owner integer REFERENCES _User(id),
  date_created date
);

CREATE TABLE Chat_Messages (
  id SERIAL PRIMARY KEY,
  from_user integer REFERENCES _User(id),
  to_user integer REFERENCES _User(id),
  date_sent date,
  conversation integer REFERENCES Conversation
);

CREATE TABLE Conversation (
  id SERIAL PRIMARY KEY,
  user1 integer REFERENCES Student,
  user2 integer REFERENCES Student
);
