console.log('This script updates test data');

//Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async')
var Match = require('./models/match')
var Player = require('./models/player')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function updatePlayer()