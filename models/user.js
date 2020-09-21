var mongoose = require('mongoose');

//User Schema
var userSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('User', userSchema);