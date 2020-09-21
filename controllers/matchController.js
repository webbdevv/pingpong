var Match = require('../models/match')
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');
var Player = require('../models/player');
var EloRating = require('elo-rating');
//Display the full match list
exports.match_list = function(req, res, next){

    Match.find()
    .populate('player_one player_two')
    .exec(function (err, list_matches) {
        if(err) {return next(err); }
        //Successful, so render
        res.render('match_history', {title: 'Match History', matches: list_matches});
    })
   
};

//Respond to create match get
exports.create_match = function(req, res, next){
    
    //Get all players which will used to add our match
    Player.find().exec(function (err, players){
        if(err) {return next(err); }
        //Success, render
        res.render('game_form', {title: 'Enter Match', player_list: players});
    });
};

exports.create_match_post = [

    //Validate fields
    body('matchType', 'Match must be selected'),
    body('winner', 'Winner must be selected'),
    body('player_one', 'Player one field must be filled in').trim().isLength({min: 1}),
    body('player_two', 'Player two must be filled in').trim().isLength({min:1}),
    body('g1_score_one', 'Score one must be filled in').trim().isLength({max: 2}).withMessage('Score must be filled in with leading zeroes (01)'),
    body('g1_score_two', 'Score two must be filled in').trim().isLength({max: 2}).withMessage('Score must be filled in with leading zeroes (06)'),
    body('g2_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g2_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),
    body('g3_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g3_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),
    body('g4_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g4_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),
    body('g5_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g5_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),
    body('g6_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g6_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),
    body('g7_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g7_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),


    //Sanitize All fields
    sanitizeBody('*').escape(),
    //Process request after validation and sanitization
    (req, res, next) => {
        //Extract all errors
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log('Errors found')
            //There are errors, so we must render the form again with sanitized values and error messages
            res.render('game_form', {match: req.body, errors: errors.array() });
            return;
        }
        else{
            //console.log("Passes Validation");
            //validation succeeded and data is valid
            var match = new Match(
                {
                    player_one: req.body.player_one,
                    player_two: req.body.player_two,
                    g1_score_one: req.body.g1_score_one,
                    g1_score_two: req.body.g1_score_two,
                    g2_score_one: req.body.g2_score_one,
                    g2_score_two: req.body.g2_score_two,
                    g3_score_one: req.body.g3_score_one,
                    g3_score_two: req.body.g3_score_two,
                    g4_score_one: req.body.g4_score_one,
                    g4_score_two: req.body.g4_score_two,
                    g5_score_one: req.body.g5_score_one,
                    g5_score_two: req.body.g5_score_two,
                    g6_score_one: req.body.g6_score_one,
                    g6_score_two: req.body.g6_score_two,
                    g7_score_one: req.body.g7_score_one,
                    g7_score_two: req.body.g7_score_two
                });
                // Match.findById(match._id).populate('player_one player_two').exec(function(err, results) {
                //     if(err) {return next(err); }
                //     var e1 = results.player_one.elo;
                //     var e2 = results.player_two.elo;
                //     var p1Win = false;
                //     if(req.body.winner == 'P1')
                //     {
                //         p1Win = true;
                //     }
                //     var elo = EloRating.calculate(e1, e2, p1Win);
                //     console.log('Inside match callback');
                //     console.log(elo.playerRating);
                //     console.log(elo.opponentRating);
                // });
                var elo1;
                var elo2;
                async.parallel({
                    player_one: function(callback) {
                        Player.findById(match.player_one).exec(callback);
                    },
                    player_two : function(callback) {
                        Player.findById(match.player_two).exec(callback);
                    },
                }, function(err, results) {
                    if (err) {return next(err); }
                    if(results.player_one ==null || results.player_two ==null) 
                    {
                        var err = new Error('Player not found');
                        err.status = 404;
                        return next(err);
                    }
                    var e1 = results.player_one.elo;
                    var e2 = results.player_two.elo;
                    var p1Win = false;
                    if(req.body.winner == 'P1')
                    {
                        p1Win = true;
                    }
                    var elo = EloRating.calculate(e1, e2, p1Win);
                    console.log('Inside match callback');
                    console.log(elo.playerRating);
                    console.log(elo.opponentRating);
                    results.player_one.elo = elo.playerRating;
                    results.player_two.elo = elo.opponentRating;
                    elo1 = elo.playerRating;
                    elo2 = elo.opponentRating;
                    Player.findByIdAndUpdate(match.player_one, {$set: {elo: elo.playerRating}}, function(err, results) {
                        if(err) {return next(err); }
                        results.save();
                    });
                    Player.findByIdAndUpdate(match.player_two, {$set: {elo: elo.opponentRating}}, function(err, results) {
                        if(err) {return next(err); }
                        results.save();
                    });
                });
                // console.log(match.player_one);
                // console.log(match.player_two);
                // console.log(match.g1_score_one);
                // console.log(match.g1_score_two);
                // console.log(match.winner);
                // console.log(req.body.winner);
                // console.log(req.body.matchType);
                console.log('Elos: ')
                console.log(elo1);
                console.log(elo2);
                var points = match.g1_score_one + match.g2_score_one + match.g3_score_one + match.g4_score_one + match.g5_score_one + match.g6_score_one + match.g7_score_one;
                const update_one = {$inc: {lifetime_points: points}}
            //Find and update the first player

                Player.findByIdAndUpdate(req.body.player_one, update_one, function(err, results){
                if (err) {return next(err); }
                //otherwise successful
                if(req.body.winner == 'P1')
                {
                    results.matches_won += 1;
                }
                else{
                    results.matches_lost += 1;
                }
                results.save();
            });

            var points_two = match.g1_score_two + match.g2_score_two + match.g3_score_two + match.g4_score_two + match.g5_score_two + match.g6_score_two + match.g7_score_two;
            const update_two = {$inc: {lifetime_points: points_two}}
            //Find and update the second player
            Player.findByIdAndUpdate(req.body.player_two, update_two, function(err, player_two){
                if(err) {return next(err); }
                //otherwise successful
                if(match.winner == 'P2')
                {
                    player_two.matches_won += 1;
                }
                else{
                    player_two.matches_lost += 1;
                }
                player_two.save();
            });
            match.save(function (err) {
                if (err) { return next(err); }
                //Successful otherwise
                res.redirect('/matches');
            });
        }
    }
];

//Generate match details
exports.match_details = function(req, res, next){
    Match.findById(req.params.id)
    .populate('player_one player_two')
    .exec(function (err, match) {
        if(err) {return next(err); }
        if(match==null) {   //no results
            var err = new Error('Match not found');
            err.status = 404;
            return next(err);
        }
        //Success, render
        res.render('match_detail', {match: match});
    });
};

//Update Match
exports.update_match_get = function(req, res, next){
    async.parallel({
        match: function(callback){
            Match.findById(req.params.id).exec(callback);
        },
        players: function(callback){
            Player.find().exec(callback);
        },
    }, function(err, results){
            if(err) {return next(err); }
            if(results == null) {
                var err = new Error;
                err.status = 404;
                return next(err);
            }
            //Success otherwise
            res.render('game_form', {match: results.match, player_list: results.players});
        });
};

exports.update_match_post = [
    body('player_one', 'Player One cannot be empty').trim().isLength({min: 1}),
    body('player_two', 'Player Two cannot be empty').trim().isLength({min: 1}),
    body('g1_score_one', 'Score one must be filled in').trim().isLength({max: 2}).withMessage('Score must be filled in with leading zeroes (01)'),
    body('g1_score_two', 'Score two must be filled in').trim().isLength({max: 2}).withMessage('Score must be filled in with leading zeroes (06)'),
    body('g2_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g2_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),
    body('g3_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g3_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),
    body('g4_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g4_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),
    body('g5_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g5_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),
    body('g6_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g6_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),
    body('g7_score_one', 'Score one must be filled in').trim().isLength({max: 2}).optional(),
    body('g7_score_two', 'Score two must be filled in').trim().isLength({max: 2}).optional(),

    sanitizeBody('*').escape(),
    (req, res, next) => {
        const errors =validationResult(req);
        var match = new Match({
            player_one: req.body.player_one,
            player_two: req.body.player_two,
            g1_score_one: req.body.g1_score_one,
            g1_score_two: req.body.g1_score_two,
            g2_score_one: req.body.g2_score_one,
            g2_score_two: req.body.g2_score_two,
            g3_score_one: req.body.g3_score_one,
            g3_score_two: req.body.g3_score_two,
            g4_score_one: req.body.g4_score_one,
            g4_score_two: req.body.g4_score_two,
            g5_score_one: req.body.g5_score_one,
            g5_score_two: req.body.g5_score_two,
            g6_score_one: req.body.g6_score_one,
            g6_score_two: req.body.g6_score_two,
            g7_score_one: req.body.g7_score_one,
            g7_score_two: req.body.g7_score_two,
            _id: req.params.id
        });
    if(!errors.isEmpty()){
        //There are errors, refill the form
    async.parallel({
        match: function(callback){
            Match.findById(req.params.id).exec(callback);
        },
    }, function(err, results){
            if(err) {return next(err); }
            if(results == null) {
                var err = new Error;
                err.status = 404;
                return next(err);
            }
            //Success otherwise
            res.render('game_form', {match: results.match});
        });
        return;
    }
    else{
        //Data from the form is valid, update
        Match.findByIdAndUpdate(req.params.id, match, {}, function(err, thematch){
            if(err) {return next(err);}
            //Success, redirect
            res.redirect(thematch.url);
        });
    }
}
];

//Delete Match
exports.delete_match_get = function(req, res, next){
    Match.findById(req.params.id).exec(function (err, match) {
        if(err) {return next(err); }
        if(match==null){    //no results
            res.redirect('/matches');
        }
        res.render('match_delete', {title: 'Delete Match', match: match});
    });
};

//Delete Match Post
exports.delete_match_post = function(req, res, next){
    Match.findByIdAndRemove(req.body.matchid, function deleteMatch(err)
    {
        if(err) {return next(err); }
        //Success, redirect
        res.redirect('/matches');
    });
};