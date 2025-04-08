const express = require('express');
const router = express.Router();
const Passenger = require('../models/Passenger');

// Get all passengers
router.get('/', async (req, res) => {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    try {
        const passengers = await Passenger.find();
        res.json(passengers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one passenger
router.get('/:id', async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.id);
        if (passenger) {
            res.json(passenger);
        } else {
            res.status(404).json({ message: 'Passenger not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a passenger
router.post('/', async (req, res) => {
    const passenger = new Passenger({
        name: req.body.name,
        picture: req.body.picture,
        numberOfTrips: req.body.numberOfTrips || 0,
        accountBalance: req.body.accountBalance || 0,
        rating: req.body.rating || 5,
        isOnTrip: req.body.isOnTrip || false
    });

    try {
        const newPassenger = await passenger.save();
        res.status(201).json(newPassenger);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a passenger
router.patch('/:id', async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.id);
        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found' });
        }

        const allowedUpdates = ['name', 'picture', 'numberOfTrips', 'accountBalance', 'rating', 'isOnTrip'];
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                passenger[key] = req.body[key];
            }
        });

        const updatedPassenger = await passenger.save();
        res.json(updatedPassenger);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a passenger
router.delete('/:id', async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.id);
        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found' });
        }
        await passenger.deleteOne();
        res.json({ message: 'Passenger deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Toggle passenger trip status
router.patch('/:id/toggle-trip', async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.id);
        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found' });
        }

        passenger.isOnTrip = !passenger.isOnTrip;
        const updatedPassenger = await passenger.save();
        res.json(updatedPassenger);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
