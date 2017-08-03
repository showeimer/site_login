// Loading necessary packages/modules
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const loginData = require('./loginData');
const expressValidator = require('express-validator');

// creating my log-in app
const app = express();

// telling express to use the handlebars template
app.engine('handlebars', handlebars());
app.set('views', './views');
app.set('view engine', 'handlebars');

// configure session support middleware with express-session
app.use(session({
    secret: 'password', // this is a password. make it unique
    resave: false, // don't resave the session into memory if it hasn't changed
    saveUninitialized: true // always create a session, even if we're not storing anything in it.
  }));

// tell express how to serve static files
app.use(express.static('public'));

// telling express to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// middleware for validating bodyparser results
app.use(expressValidator());

// session middleware
app.use((req, res, next) => {
  // console.log(req.session);
  if(!req.session.users) {
    req.session.users = [];
  }
  next();
});


// webroot
app.get('/', (req, res) => {

  if(req.session.users === undefined || req.session.users.length === 0) {
    res.redirect('/login');
  } else {
    console.log(req.session.users);
    res.render('index', {userInfo: req.session.users});
  }

});


// login page
app.get('/login', (req, res) => {
  res.render('login');
})


// Login submission code
app.post('/login/auth', (req, res) => {
  let loginInfo = req.body;
  // console.log(loginInfo);
  // console.log(loginData);

  // validating user has entered text into input fields
  req.checkBody('userName', 'Please enter a username').notEmpty();
  req.checkBody('password', 'Please enter your password').notEmpty();

  let errors = req.getValidationResult();

  // if (errors) {
  //   res.render('login', {errors:errors});
  // }

  // Compare user's input with loginData database for login authentication
  for (let i = 0; i < loginData.length; i++) {
    if (loginInfo.username === loginData[i].userName && loginInfo.password === loginData[i].password) {
      req.session.users.push(loginData[i]);
      // console.log(req.session.users);
    }
  }
  res.redirect('/');
})


// Sends user to sign up form page
app.get('/signup', (req, res) => {
  res.render('signup');
})


// code that runs when signup form is submitted
app.post('/register', (req,res) => {
  let registration = req.body;
  loginData.push(registration);
  res.redirect('/')
})


// Logs user out
app.post('/logout', (req, res) => {
  req.session.users = undefined;
  res.redirect('/')
})


app.listen(3000, function() {
  console.log('Application has successfully started');
});
