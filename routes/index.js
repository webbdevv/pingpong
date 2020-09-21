var express = require('express');
var router = express.Router();

//Sanitation and validation
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Import controller modules
var playerController = require('../controllers/playerController')
var matchController = require('../controllers/matchController')

// Match Routes //

//GET request for creating a match
router.get('/create_match', matchController.create_match);

//POST processing for match form
router.post('/create_match', matchController.create_match_post);

//GET request for updating match
router.get('/match/:id/update', matchController.update_match_get);

//POST processing for updating match
router.post('/match/:id/update', matchController.update_match_post);

//GET request for deleting match
router.get('/match/:id/delete', matchController.delete_match_get);

//POST processing for match
router.post('/match/:id/delete', matchController.delete_match_post);

//Get request for details of a match
router.get('/match/:id', matchController.match_details);

//GET match list
router.get('/matches', matchController.match_list);

// Player Routes //

//GET request for player list
router.get('/players', playerController.player_list);

//GET request for player form
router.get('/player_form', playerController.player_create_get);

//POST processing for player form
router.post('/player_form', playerController.player_create_post);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ping Pong Zoomers' });
});

//Delete get request for player 
router.get('/player/:id/delete', playerController.get_delete_player);
//Delete post request for player
router.post('/player/:id/delete', playerController.post_delete_player);

//Post home page
module.exports = router;
