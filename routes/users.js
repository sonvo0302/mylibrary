// const express = require('express');
// const router =express.Router();
// const User=require('../models/user')
// const bcrypt=require('bcryptjs')
// const passport = require('passport')
//   , LocalStrategy = require('passport-local').Strategy;



// router.get('/',(req,res)=>{
//     res.render('users')
// })

// router.get('/login',(req,res)=>{
//     res.render('users/login')
// })

// // passport.serializeUser(function(user, done) {
// //     done(null, user.id);
// //   });
  
// //   passport.deserializeUser(function(id, done) {
// //     User.getUserByID(id, function(err, user) {
// //       done(err, user);
// //     });
// //   });

// // passport.use(new LocalStrategy(function(email,password,done){
// //     User.getUserByEmail(email,function(err,user){
// //         if(!user){
// //             return done(null,false,{message:'No user with that email'})
// //         }
// //     User.comparePassword(password,user.password,function(err,user){
// //         if(err) return done(err);
// //         if(isMatch){
// //             return done(null,user);
// //         }else{
// //             return done(null,false,{message:'Invalid Password'})
// //         }
// //     });
// //     })
// // }))
// passport.use(new LocalStrategy(
//     function(email, password, done) {
//       User.findOne({ email: email }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) {
//           return done(null, false, { message: 'Incorrect username.' });
//         }
//         if (!user.validPassword(password)) {
//           return done(null, false, { message: 'Incorrect password.' });
//         }
//         return done(null, user);
//       });
//     }
//   ));
// router.post('/login',
//  passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid user or password'}),function(req,res){
//     req.flash('success','You are now logged in');
//     res.redirect('/')  ; 
// });



// router.get('/register',(req,res)=>{
//     res.render('users/register')
// })
// router.post('/register',async(req,res)=>{
//     var name=req.body.name;
//     var email=req.body.email;
//     var password= req.body.password;
    
//     const newUser=new User({
//         name:name,
//         email:email,
//         password:password
//     })

//     try{
//         User.createUser(newUser,function(err,user){
//             if(err) throw err
          
//         });
//         res.render('users/login',{errorMessage:'Register Sucessfully'});
//     }catch{
//         res.render('users/register',{errorMessage:'Register Failed'})
//     }
// })

// module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/user');
router.get('/',(req,res)=>{
  res.render('users/index')
})

// Login Page
router.get('/login', (req, res) => res.render('users/login'));

// Register Page
router.get('/register', (req, res) => res.render('users/register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('users/register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});
// router.post('/login',
//  passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid user or password'}),function(req,res){
//     req.flash('success','You are now logged in');
//     res.redirect('/users/index')
    
// });
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;