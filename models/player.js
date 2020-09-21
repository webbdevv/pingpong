var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema(
    {
        first_name: {type: String, required: true, maxlength: 20},
        last_name: {type: String, required: true, maxlength: 20},
        lifetime_points: {type: Number, min: 0, required: true, default: 0},
        matches_won: {type: Number, required: true, min: 0, default: 0},
        matches_lost: {type: Number, required: true, min: 0, default: 0},
        elo: {type: Number, required: true, default: 1500}
        // matches: [{type: Schema.Types.ObjectId, ref: 'Match'}]
    }
);

playerSchema
    .virtual('get_elo')
    .get(function () {
        return this.elo;
    });
playerSchema
    .virtual('url')
    .get(function() {
        return '/player/' + this.id;
    });
//export model
module.exports = mongoose.model('Player', playerSchema);