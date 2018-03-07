const express = require('express');
const passport = require('passport');
const router = express.Router();
const connection = require('../database/mysql-connect');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/register',
  failureFlash: true 
}));

// router.post('/register', (req, res, next) => {
//     const user_name = req.body.username;
//     const password = req.body.password;

//     passport.authenticate('local-signup', { 
//       successRedirect: '/',
//       failureRedirect: '/register',
//       failureFlash: true 
//     });

//     console.log('after local signup')
  //   passport.use('local-signup', new LocalStrategy({
  //     // by default, local strategy uses username and password, we will override with email
  //     usernameField : 'user_name',
  //     passwordField : 'password',
  //     passReqToCallback : true // allows us to pass back the entire request to the callback
  //   },

  //   function(req, user_name, password, done) {

  //     connection.query("select * from users where user_name = '"+user_name+"'", function(err,rows) {
  //       console.log(rows);
  //       console.log("above row object");
  //       if (err)
  //           return done(err);

  //       if (rows.length) {
  //           return done(null, false, req.flash('signupMessage', 'That user_name is already taken.'));
  //       } else {

  //         // if there is no user with that email
  //         // create the user
  //         var newUserMysql = {};
          
  //         newUserMysql.user_name = user_name;
  //         newUserMysql.password = password; // use the generateHash function in our user model
      
  //         var insertQuery = "INSERT INTO users ( user_name, password ) values ('" + user_name +"','"+ password +"')";
  //         console.log(insertQuery);
  //         connection.query(insertQuery,function(err,rows){
  //         newUserMysql.id = rows.insertId;
          
  //         return done(null, newUserMysql);
  //         });	
  //       }
  //     })
      
  //   })

  // );

// });

    // Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
    //     if (err) {
    //       return res.render('register', { error : err.message });
    //     }

    //     passport.authenticate('local')(req, res, () => {
    //         req.session.save((err) => {
    //             if (err) {
    //                 return next(err);
    //             }
    //             res.redirect('/');
    //         });
    //     });
    // });



router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.get('/testlogin', (req, res) => {
  res.render('login', { user : req.user, error : req.flash('error')});
});

// As with any middleware it is quintessential to call next()
// if the user is authenticated
const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

/* GET Home Page */
router.get('/home', isAuthenticated, function(req, res){
  res.render('home', { user: req.user });
});
 
router.post('/login', passport.authenticate('login', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/orders');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

module.exports = router;
