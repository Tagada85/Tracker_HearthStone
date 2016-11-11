const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CharacterSchema = new Schema({
    name: String,
    className: String,
    description: String,
    image: String
});

let Character = mongoose.model('Character', CharacterSchema);
module.exports = Character;