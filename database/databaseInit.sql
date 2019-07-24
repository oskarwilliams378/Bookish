
--  DROP DATABASE bookish;

--  CREATE DATABASE "bookish"
--     WITH
--     OWNER = bookish
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'English_United Kingdom.1252'
--     LC_CTYPE = 'English_United Kingdom.1252'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

CREATE TABLE IF NOT EXISTS Book (
	id serial PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	isbn VARCHAR(16) NOT NULL,
	edition VARCHAR(255),
	image_url VARCHAR(255),
	barcode_image_url VARCHAR(255) NOT NULL	
);

CREATE TABLE IF NOT EXISTS Author (
	id serial PRIMARY KEY,
	fullname VARCHAR(255) UNIQUE NOT NULL,
	pseudonym1 VARCHAR(255),
	pseudonym2 VARCHAR(255),
	pseudonym3 VARCHAR(255),
	image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS BookAuthor (
	bookid INTEGER REFERENCES Book(id),
	authorid INTEGER REFERENCES Author(id),
	UNIQUE (bookid, authorid)
);

CREATE TABLE IF NOT EXISTS Account (
	fullname VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	UNIQUE(username)
);

CREATE TABLE IF NOT EXISTS BorrowBooks (
	id serial PRIMARY KEY,
	bookid INTEGER REFERENCES Book(id),
	accountusername VARCHAR(255) REFERENCES Account(username),
	duedate VARCHAR(255) NOT NULL,
	returned BOOLEAN NOT NULL,
	returndate VARCHAR(255)
);
