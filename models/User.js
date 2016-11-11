const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DeckSchema = new Schema({
    classDeck : String,
    deckName: String,
    description: String
});

let GameSchema = new Schema({
    classPlayed: String,
    classOpponent: String,
    deckUsed: DeckSchema,
    outcome: String,
    date: {type: Date, default: Date.now}
});

let UserSchema = new Schema({
    username: String,
    email: String,
    decks: [DeckSchema],
    arenaRuns: [
        {
            numberOfWins: Number,
            classPlayed: String,
            date: {type: Date, default: Date.now}
        }
    ],
    gamesRecord: [GameSchema]
});

let User = mongoose.model('User', UserSchema);
module.exports = User;