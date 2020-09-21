var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment')

var matchSchema = new Schema(
    {
        player_one: {type: Schema.Types.ObjectId, ref: 'Player', required: true},
        player_two: {type: Schema.Types.ObjectId, ref: 'Player', required: true},
        g1_score_one: {type: Number, required: true},
        g1_score_two: {type: Number, required: true},
        g2_score_one: {type: Number, default: 0},
        g2_score_two: {type: Number, default: 0},
        g3_score_one: {type: Number, default: 0},
        g3_score_two: {type: Number, default: 0},
        g4_score_one: {type: Number, default: 0},
        g4_score_two: {type: Number, default: 0},
        g5_score_one: {type: Number, default: 0},
        g5_score_two: {type: Number, default: 0},
        g6_score_one: {type: Number, default: 0},
        g6_score_two: {type: Number, default: 0},
        g7_score_one: {type: Number, default: 0},
        g7_score_two: {type: Number, default: 0},
        match_date: {type: Date, default: Date.now},
    }
);

//Virtual for formatted match date
matchSchema
    .virtual('match_date_formatted')
    .get(function (){
        return moment(this.match_date).format('MMMM Do, YYYY');
    });
    
//Virtual for the URL
matchSchema
    .virtual('url')
    .get(function() {
        return '/match/' + this.id;
    });

module.exports = mongoose.model('Match', matchSchema);