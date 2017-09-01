const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderReference: {
        type: String,
        required: true
    },
    pets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }]
});

module.exports = mongoose.model('Order', orderSchema);