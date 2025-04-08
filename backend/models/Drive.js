const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    distance: {
        type: Number,  // in kilometers
        required: true
    },
    duration: {
        type: Number,  // in minutes
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'cancelled', 'in-progress'],
        default: 'in-progress'
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Drive', driveSchema);
