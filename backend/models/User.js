const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['passenger', 'driver', 'admin'],
        default: 'passenger'
    },
    passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passenger'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
