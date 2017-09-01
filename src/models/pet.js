const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: String
});

module.exports = mongoose.model('Pet', petSchema);