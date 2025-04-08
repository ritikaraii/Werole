const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    numberOfTrips: {
        type: Number,
        required: true,
        default: 0
    },
    accountBalance: {
        type: Number,
        required: true,
        default: 0
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 5
    },
    isOnTrip: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Passenger', passengerSchema);
