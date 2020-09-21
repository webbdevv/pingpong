var express = require('express');
var router = express.Router();
let User = require('../models/user');
var userController = require('../controllers/userController');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//Registration
//Reg get
router.get('/register', userController.register_get);
//Reg post
router.post('/register', userController.register_post);

//Login
router.get('/login', userController.user_get_login);

router.post('/login', function(req, res, next){
   passport.authenticate('local', {
        successRedirect: '/matches',
        failureRedirect: '/users/login',
        failureFlash: 'Failed to login'
})(req,res,next);
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/');
});

module.exports = router;