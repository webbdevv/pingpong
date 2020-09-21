// const LocalStrategy = require('passport-local').Strategy
// const bcrypt = require('bcrypt')
// const User = require('../models/user')

// function initialize(passport) {
//     const user = User.findOne({email: email})
//   const authenticateUser = async (email, password, done) => {
    

//     if (res == null) {
//       return done(null, false, { message: 'No user with that email' })
//     }

//     try {
//       if (await bcrypt.compare(password, res.password)) {
//         return done(null, res);
//       } 
//       else {
//         return done(null, false, { message: 'Password incorrect' });
//       }
//     } 
//     catch (e) {
//       return done(e);
//     }
// })
//   passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
//   passport.serializeUser((user, done) => done(null, user.id))
//   passport.deserializeUser((id, done) => {
//     return done(null, getUserById(id))
//   })
// }
// }
// module.exports = initialize

//FAILED ATTEMPT ABOVE

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports = function(passport){
    //Local Strategy
    passport.use(new LocalStrategy(function(username, password, done){
        //Match Username
        let query = {username: username};
        User.findOne(query, function(err, user){
            if(err) throw err;
            if(!user) {
                return done(null, false, {message: 'No user found'});
            }

            //Match Password
            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else{
                    return done(null, false, {message: 'Incorrect password'});
                }
            });
        });
    }));


passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

}