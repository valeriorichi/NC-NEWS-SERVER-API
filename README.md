# Project NC-NEWS SERVER
# README

Welcome to my first backend project! I'm currently a student at Northcoders school, and I'm excited to share what I've been working on. This project is focused on building a database with real-looking development data, as well as test data. I've included detailed instructions on how to set up the environment variables and run the project locally, so please don't hesitate to reach out if you have any questions or feedback. Thank you for taking the time to check out my work!


## Project Overview

This project contains two databases - one for real-looking development data and another for test data. The project structure includes a `db` folder with some data, a `setup.sql` file, and a `seeds` folder.


## Getting Started

To get started with this project, you'll need to set up your environment variables. There are two `.env` files you need to create: `.env.test` and `.env.development`. In each file, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names).

It's important to double check that these `.env` files are added to the `.gitignore` file so that they're not accidentally committed to version control.

Once you've set up your environment variables, run `npm install` to install all the necessary packages. Please do not install specific packages as you can do this down the line when you need them.


## NPM Scripts

The project comes with some pre-defined npm scripts that you should be aware of:

* `npm run setup-dbs`: Sets up the development and test databases based on the information in the /db/setup.sql file.
* `npm run seed`: Seeds the development database with data from the /db/seeds folder.
* `npm run test`: Runs the tests using the test database.


## Folder Structure

The `index.js` file in each of the data folders exports all the data from that folder, currently stored in separate files. This is so that, when you need access to the data elsewhere, you can write one convenient require statement - to the index file, rather than having to require each file individually. Think of it like an index of a book - a place to refer to! Make sure the index file exports an object with values of the data from that folder with the keys:

* `topicData`
* `articleData`
* `userData`
* `commentData`

## Connecting to the Databases
As `.env.*` is added to the `.gitignore`, anyone who wishes to clone your repo will not have access to the necessary environment variables. In order to connect to the two databases locally, a developer must create two `.env` files in the root directory of the project:

* `.env.test`: Add `PGDATABASE=<test_database_name_here>`
* `.env.development`: Add `PGDATABASE=<dev_database_name_here>`

Replace `<test_database_name_here>` and `<dev_database_name_here>` with the correct names of the test and development databases, respectively (see `/db/setup.sql` for the database names).

## Conclusion 

We hope this helps you get started with the project! If you have any questions or concerns, please reach out to the project team.