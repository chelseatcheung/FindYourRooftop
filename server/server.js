var express = require('express');
var path = require('path');
var bodyParser  = require('body-parser');
var request = require('request');
var app = express();
var Promise = require('bluebird');
var query = require('./queries.js');
var mid = require('./middleware.js');
var session = require('express-session');
var http = require('http');
var menu = require('./findmenu.js');
var test = require('./yelp.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/..'));
app.use(function(req, _, next) {
  console.log('Received a MARCUS ' + req.method + ' for: ' + req.path);
  next();
});

app.use(session({
  secret: "test",
  resave: false,
  saveUninitialized: true
}));

var acceptRouter = express.Router();
acceptRouter.post('/', query.approveSuggestions, function (req, res) {
  console.log('Accepted suggestions');
  res.send('Accepted suggestions')
})

var rejectRouter= express.Router();
rejectRouter.post('/', query.deleteSuggestions, function (req, res) {
  console.log('Deleted suggestions');
  res.send('Deleted suggestions');
})

var approveRouter = express.Router();

approveRouter.post('/', query.getSuggestions, function(req, res) {
  console.log('success');
  console.log('res SUGG ' + res.sugg[0]['name'])
  res.send(res.sugg);
})

var submissionRouter = express.Router();

submissionRouter.post('/', test.callYelpApi, function(req, res) {
  // this is here to provide a clearer console.log of the results form YELP
  console.log('-- results overview --');
  res.data
    .map(function(bar) {
      return {
        name: bar.name,
        number: bar.display_phone
      };
    })
    .forEach(function(bar) {
      console.log(JSON.stringify(bar, null, 2));
    });
  res.send(res.data);
});

var adminRouter = express.Router();

adminRouter.post('/admin', query.postToDB, function(req, res) {
  console.log('posted suggestion to database!');
  // res.send('posted suggestion to database!');
  res.send(JSON.stringify({
    status: 201,
    message: 'posted suggestion to database!'
  }));
})


var homeRouter = express.Router();

homeRouter.post('/', query.getList, function(req, res) {
  console.log('getting a POST request for /home');
  res.send(res.bars);
})

homeRouter.get('/', function(req, res) {
  console.log('getting a GET request for /home');
  console.log('about to test yelp api with node');
  test.callYelpApi();
  console.log('this is post yelp test');
  res.send('session created');
})

var mainRouter = express.Router();

mainRouter.post('/main', query.getList, function(req, res) {
  console.log('getting a POST request for /main');
  res.send(res.bars);
})

mainRouter.get('/main', function(req, res) {
  console.log('getting a GET request for /main');
  res.send('session created');
})


var userRouter = express.Router();

// userRouter.get('/login', function(req, res) {
//   console.log('###### JUST GOT LOGIN REQUEST #######');
//   res.sendFile(path.join(__dirname + '../client/register.html'));
// })

userRouter.post('/login', function(req, res) {
  mid.validateLogin(req, res);
})

// userRouter.get('/signup', function(req, res) {
//   console.log('GET REQUEST TO SIGNUP PAGE');
//   res.sendFile(path.join(__dirname + '../client/register.html'));
// })

userRouter.post('/signup', function(req, res) {
  mid.processSignup(req, res);
  // console.log('user was just added to database, redirecting to main');
  // res.redirect('/');
})

userRouter.get('/logout', function(req, res) {
  console.log('Before destroy ' + req.session.id);
  req.session.destroy(function() {
    console.log('destroyed')
    res.send('You\'ve been logged out!');
  })
  console.log('Session is: ' + req.session);
})

// userRouter.post('/add', mid.checkUser, function(req, res) {
//   res.send('success');
// })

var menuRouter = express.Router();
menuRouter.post('/', menu.downloadMenu, test.callYelpApi, function(req, res, next) {
  res.send(res.menu);
})

// apply routes to application
app.use('/reject', rejectRouter);
app.use('/accept', acceptRouter);
app.use('/approve', approveRouter);
app.use('/submission', submissionRouter);
app.use('/home', homeRouter);
app.use('/user', userRouter);
app.use('/menu', menuRouter);
app.use('/main', mainRouter);
app.use('/admin', adminRouter);

app.listen(3000);
console.log('Listening on 3000...')
module.exports = app;


module.exports = app;