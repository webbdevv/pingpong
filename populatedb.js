console.log('This script populates test data');

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

var players = []
var matches = []

function playerCreate(fn, ln, points, matchW, matchL, cb) {
    playerdetail = {first_name:fn, last_name:ln, lifetime_points:points, matches_won: matchW, matches_lost: matchL}
    var player = new Player(playerdetail);

    player.save(function (err) {
        if(err) {
            cb(err, null)
            return
        }
        console.log('New Player: ' + player);
        players.push(player)
        cb(null, player)
    });
}

function matchCreate(pOne, pTwo, match_date, score_one, score_two, elo, cb) {
    matchDetail = {
        player_one: pOne,
        player_two: pTwo,
        score_one: score_one,
        score_two: score_two,
        elo: elo
    }
    if (match_date != false) matchDetail.match_date = match_date
    var match = new Match(matchDetail);
    match.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Match: ' + match);
        matches.push(match);
        cb(null, match)
    });
}

function createPlayers(cb) {
    async.series([
        function(callback) {
            playerCreate('Goober', 'Magee', 1234, 2, 3, 1000, callback)
        },
        function(callback) {
            playerCreate('Zoomer', 'Reee', 132, 3, 2, 1000, callback)
        },
    ],
    cb);
}

function createMatches(cb) {
    async.parallel([
        function(callback) {
            matchCreate(players[0], players[1], false, 11, 6, callback);
        },
    ],
    cb);
}

async.series([
    createPlayers,
    createMatches,
],
//Optional callback
function(err, results) {
    if(err) {
        console.log('FINAL ERR: ' + err);
    }
    else{
        console.log('Success')
    }
    //disconnect
    mongoose.connection.close();
});
