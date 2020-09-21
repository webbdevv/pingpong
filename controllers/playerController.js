var Player = require('../models/player')
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const validator = require('express-validator');

// Display the full list of players
exports.player_list = function(req, res, next) {
    Player.find()
    .sort([['last_name', 'ascending']])
    .exec(function (err, list_players) {
        //Return correct error
        if(err) {return next(err); }
        //Otherwise, successful, so render
        res.render('player_list', {title: 'Players', player_list: list_players });
    });
};

//Create a player
exports.player_create_get = function(req, res) {
    res.render('player_form', {title: 'Create Player'});
};

exports.player_create_post = [
    //Validation
    body('first_name').isLength({min: 1}).trim().withMessage('First name must be specified').isAlphanumeric().withMessage('First name must have alphanumeric characters'),
    body('last_name').isLength({min: 1}).trim().withMessage('Last name must be specified').isAlphanumeric().withMessage('Last name must have alphanumeric characters'),

    //Sanitize data
    sanitizeBody('first_name').escape(),
    sanitizeBody('last_name').escape(),

    //Process request
    (req, res, next) => {

        //Extract any validation errors
        const errors =validator.validationResult(req);

        if(!errors.isEmpty()){
            //Process errors if they exist
            res.render('player_form', {title: 'Create Player', player: req.body.first_name, errors: errors.array() });
            return;
        }
        else{
            //Process valid data
            var player = new Player(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                });
            player.save(function (err) {
                if (err){ return next(err); }
                //success, redirect to home
                req.flash('success', 'Player Created');
                res.redirect('/');
            });
        }
    }
];

exports.get_delete_player = function(req, res){
    Player.findById(req.params.id).exec(function (err, player){
        if(err) {return next(err); }
        if(player==null)
        {
            var error = new Error;
            error.status = 404;
            return next(err);
        }
        //Success otherwise
        res.render('player_delete', {title: 'Delete Player', player: player});
    });
};

exports.post_delete_player = function(req, res){
    Player.findByIdAndRemove(req.body.playerid, function deletePlayer(err) {
        if(err) {return next(err); }
        //Success, redirect
        req.flash('success', 'Player Deleted');
        res.redirect('/players');
    });
};