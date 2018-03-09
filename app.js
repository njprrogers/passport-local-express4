// dependencies
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const routes = require('./routes/index');
const users = require('./routes/users');
const database = require('./database/mysql-connect');
const bCrypt = require('bcrypt-nodejs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat named nick',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/orders')(app);
require('./routes/edit_order')(app);

app.use('/', routes);

// middleware to store messages in locals
app.use(function(req, res, next){
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});
app.all('/', function(req, res){
  req.flash('test', 'it worked');
  res.redirect('/test')
});

// passport config
// var Account = require('./models/account');
// passport.use(new LocalStrategy(Account.authenticate()));
const createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
 }

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    // usernameField : 'user_name',
    // passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, username, password, done) {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    database.query("select * from user where user_name = '" + database.connection.escape( username ) + "'")
    .then(function(rows){
        console.log(rows);
        console.log("above row object");
         if (rows.length) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          // if there is no user with that email
          // create the user

          let newUserMysql = {};            
          newUserMysql.user_name = username;
          newUserMysql.password = createHash(password);

          const insertQuery = "INSERT INTO user ( user_name, password ) values ('" + database.connection.escape( username ) +"','"+ newUserMysql.password +"')";
          console.log(insertQuery);
          database.query(insertQuery)
          .then(function(rows) {
            console.log('the rows', rows);
            newUserMysql.id = rows.insertId;              
            return done(null, newUserMysql);
          })
          .catch(function (err) {
            console.log(err);
            return done(null, false, req.flash('error', err))
          }) 
        }	
    })
    .catch(function (err) {
      return done(err);
    })
}));

const isValidPassword = function(userPassword, password, req){
  try {
    return correctPassword = bCrypt.compareSync(password, userPassword);
  } catch (e) {
    console.log(e)
    req.flash('error', 'Invalid Password');
    return;
  }
}
passport.use('login', new LocalStrategy({
  passReqToCallback : true
},
function(req, username, password, done) { 

  database.query("select * from user where user_name = " + database.connection.escape( username ))
    .then(function(rows) {
      console.log(rows);
      console.log("above row object");

      if (!rows.length) {
        return done(null, false, req.flash('error', 'That user name does not exist.'));
      } else {

        // User exists but wrong password, log the error 
        if (!isValidPassword(rows[0].password, password, req)){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('error', 'Invalid Password'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, rows[0]);
      }	
    })
    .catch(function (err) {
      console.log('We have an error on login ', err);
      return done(err);
    });
}));


// passport.serializeUser(Account.serializeUser());
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
// passport.deserializeUser(Account.deserializeUser());
passport.deserializeUser(function(id, done) {
    database.query("select * from user where id = "+id,function(err,rows){	
        done(err, rows[0]);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
