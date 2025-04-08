const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    picture: {
        type: String,
        required: true
    },
    carModel: {
        type: String,
        required: true
    },
    numberOfTrips: {
        type: Number,
        required: true,
        default: 0
    },
    rate: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Driver', driverSchema);
