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
  console.log(req.session);

  if(!req.session.users) {
    req.session.users = [];
  }

  next();
});

// webroot
app.get('/', (req, res) => {

  if(req.session.users === undefined || req.session.users.length === 0) {
    res.render('login');
  } else {
    res.render('index');
  }

});

app.post('/login', (req, res) => {
  let loginInfo = req.body;
  console.log(req.body);
  console.log(loginData);

  // validating user has entered text into input fields
  req.checkBody('username', 'Please enter a username').notEmpty();
  req.checkBody('password', 'Please enter your password').notEmpty();

  let errors = req.getValidationResult();

  for (let i = 0; i < loginData.length; i++) {
    if (loginInfo.username === loginData[i].username && loginInfo.password === loginData[i].password) {
      // console.log(users);
      // session.cookie.users.push(loginInfo);
      // console.log(users);
      res.render('index');
    } else if (errors) {
      console.log(loginInfo);
      res.render('login', {errors: errors, loginInfo: loginInfo});
    } else {
      res.redirect('login');
    }
  }

})

app.listen(3000, function() {
  console.log('Application has successfully started');
});
