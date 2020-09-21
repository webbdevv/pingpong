const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const passport = require('passport');
const validator = require('express-validator');
let User = require('../models/user');
var bcrypt = require('bcrypt');
const { nextTick } = require('async');
const saltrounds = 10;

  //Register Form
  exports.register_get = function(req, res){
    res.render('register', {title: 'Register'});
  };

  exports.register_post = [

    body('first_name', 'First name is required').isLength({min: 1}).trim(),
    body('last_name', 'Last name is required').isLength({min: 1}).trim(),
    body('email', 'Email is not valid email').isEmail().trim(),
    body('password', 'Password is required').isLength({min: 1}).trim().custom((value,{req, loc, path}) => {
        if (value !== req.body.password2) {
            // throw error if passwords do not match
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    }),
    //body('password2', 'Confirm password').matches('password').withMessage('Passwords must match'),
    

    sanitizeBody('*').escape(),
    (req, res, next) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const pass = req.body.password;
    const pass2 = req.body.password2;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.render('register', {errors: errors.array()});
    }
    else{
        let newUser = new User({
            first_name: first_name,
            last_name: last_name,
            email: email,
            username: email,
            password: pass,
        });
        bcrypt.genSalt(saltrounds, function(err, salt){
            if(err) {return next(err); }
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password =hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }
                    else{
                        req.flash('success', 'Registered, you can now login.')
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
}
];
  exports.user_get_login = function(req, res){
      res.render('login', {title: 'Login'});
  };

//   exports.user_post_login = function(req, res, next){
//     passport.authenticate('local', {
//         successRedirect: '/matches',
//         failureRedirect: '/login',
//         failureFlash: true
//     });
//   };