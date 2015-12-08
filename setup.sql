
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
  profile_picture_url VARCHAR(200)
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
  date_created date,
  url VARCHAR(200)
);

CREATE TABLE Chat_Messages (
  id SERIAL PRIMARY KEY,
  from_user integer REFERENCES _User(id),
  to_user integer REFERENCES _User(id),
  date_sent date,
  conversation integer REFERENCES Conversation,
  message VARCHAR(200)
);

CREATE TABLE Conversation (
  id SERIAL PRIMARY KEY,
  user1 integer REFERENCES _User(id),
  user2 integer REFERENCES _User(id),
  lastMessageSent date
);


CREATE TABLE reported_content (
  id SERIAL PRIMARY KEY,
  author integer REFERENCES _User(id),
  explanation VARCHAR(200),
  report_user integer REFERENCES _User(id),
  reported_content VARCHAR REFERENCES Chat_Messages(id)
);

CREATE TABLE Calendar (
  id SERIAL PRIMARY KEY,
  course integer REFERENCES Course ,
  calendar_date date,
  title VARCHAR(100),
  description VARCHAR(500)
);

