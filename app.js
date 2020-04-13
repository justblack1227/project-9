//Techdegree Project 9
// By Justin Black
// Rest API

'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');


// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));



const Sequelize = require('sequelize');
const models = require('./models');
const { Course, User } = models;
var sequelize = require('./models').sequelize;

app.use(express.json());

// Function that handles async and await while data is retrieved
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
        await cb(req, res, next)
    } catch(error) {
        res.status(500).send(error)
    }
  }
}

//Function authenticates the user using the site.
const authenticateUser = asyncHandler(async(req, res, next) => {
  const credentials = auth(req);
  let message = null;

  if (credentials) {
    const users = await User.findAll();
    const user = users.find(u => u.emailAddress === credentials.name);  //changed

    if (user) {
      const authenticated = bcryptjs
       .compareSync(credentials.pass, user.password);

        if (authenticated) {
          req.currentUser = user;
        } else {
          message = `Authentication failure for username: ${user.emailAddress}`;
        }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = `Auth header not found`;
  }

  if (message) {
    console.warn(message);
    res.status(401).json({message: 'Access Denied'});
  } else {
    next();
  }
});

// TODO setup your api routes here

// *************  USER ROUTES *******************

// GET Authenticated Users
app.get('/api/users', authenticateUser,  (req, res) => {
  const user = req.currentUser;
  res.json(user);
});

//POST Create A New User
app.post('/api/users', asyncHandler(async (req, res) => {
  let user; 
  if (req.body.password) {
    req.body.password = bcryptjs.hashSync(req.body.password);
  }

  try {
    user = await User.create(req.body);
    res.location('/');
    res.status(201).json(user);

  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const err = error.errors.map( error => error.message);
      res.status(400).json({"errors": err });                                         //take out maybe
    } else if (error.name === "SequelizeUniqueConstraintError") {
      const err = error.errors.map( error => error.message);
      res.status(400).json({"errors": err });                                           //take out maybe
    }else {
      throw error;
    }
  }
}));


// ***************** COURSE ROUTES ********************

// GET Entire Course Listing
app.get('/api/courses',  asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
      }
    ],
  });
  res.status(200).json(courses);
}));

//GET A Course Entry
app.get('/api/courses/:id', asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
      }
    ],
  });
  if (course) {
    res.status(200).json(course);
  } else {
    res.status('404');
    next();
  }
}));

//POST Create A New Course
app.post('/api/courses', authenticateUser, asyncHandler(async (req, res) => {
  let course; 

  try {
    course = await Course.create(req.body);
    res.location('/api/courses/' + course.id);
    res.status(201).json(course);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const err = error.errors.map( error => error.message);
      res.status(400).json({"errors": err });
    } else {
      throw error;
    }
  }
}));

//PUT New Info For A Course
app.put('/api/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  let course; 

  try {
    course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
        }
      ],
    });
    if (course) {
      await course.update(req.body);
      res.status(204).end();
    } else {
      res.status('404');
      next();
    } 
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const err = error.errors.map( error => error.message);
      res.status(400).json({"errors": err });
      res.end();
    } else {
      throw error;
    }
  }
}));

//DELETE A Course From The Listing
app.delete('/api/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);

  if (course) {
    await course.destroy();
    res.status(204).end();
  } else {
    res.status('404');
    next();
  } 
}));

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.log('Connection to the database failed!');
  }
  console.log(`Express server is listening on port ${server.address().port}`);
});
