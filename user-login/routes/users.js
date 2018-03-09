var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var multer = require('multer')
var upload = multer({dest: './uploads'})

var User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  //res.render('register');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.post('/register', upload.single('profileimage'), function(req, res, next) {
  var name = req.body.name
  var username = req.body.username
  var email = req.body.email
  var password = req.body.password
  var password2 = req.body.password2
  
  if(req.file) {
    console.log('image uploading...')
    var profileimage = req.file.filename
  }
  else {
    console.log('no image uploaded')
    //var profileimage = noimage.jpg
  }

  //form validation
  req.checkBody('name', 'Name field is required').notEmpty()
  req.checkBody('email', 'Email field is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('password', 'Password field is required').notEmpty()
  req.checkBody('username', 'Username field is required').notEmpty()
  req.checkBody('password2', 'Password does not match').equals(req.body.password)

  //check errors
  var errors = req.validationErrors()

  if(errors) {
    res.render('register', {errors})
  }
  else {
    var newUser = new User({
      name,
      email, 
      username,
      password,
      profileimage
    })
    User.createUser(newUser, (err, user) => {
      if(err) throw err
      console.log(user)
    })

    req.flash('success', 'U r registered successfully and can now login')

    res.location('/')
    res.redirect('/')
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

// router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}),
//   function(req, res) {
//     req.flash('success', 'You are now logged in')
//     res.redirect('/')
// })

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.getUserByUsername(username, function(err, user) {
    if(err) throw err
    if(!user) {
      return done(null, false, {message: 'Unknown User'})
    }

    User.comparePassword(password, user.password, function(err, isMatch) {
      if(err) throw err
      if(isMatch) {
        return done(null, user)
      }
      else {
        return done(null, false, {message: 'Invalid Password'})
      }
    })
  })
}))

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: 'Invalid username or password'
}), function(req, res) {
  console.log('Authentication Successful');
  req.flash('success', 'You are logged in');
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success' , 'You are now logged out!')
  res.redirect('/users/login')
})

module.exports = router;
