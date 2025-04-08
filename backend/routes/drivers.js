const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// Get all drivers
router.get('/', async (req, res) => {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one driver
router.get('/:id', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (driver) {
            res.json(driver);
        } else {
            res.status(404).json({ message: 'Driver not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a driver
router.post('/', async (req, res) => {
    const driver = new Driver({
        name: req.body.name,
        rating: req.body.rating,
        picture: req.body.picture,
        carModel: req.body.carModel,
        numberOfTrips: req.body.numberOfTrips,
        rate: req.body.rate
    });

    try {
        const newDriver = await driver.save();
        res.status(201).json(newDriver);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a driver
router.patch('/:id', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const allowedUpdates = ['name', 'rating', 'picture', 'carModel', 'numberOfTrips', 'rate'];
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                driver[key] = req.body[key];
            }
        });

        const updatedDriver = await driver.save();
        res.json(updatedDriver);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a driver
router.delete('/:id', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await driver.deleteOne();
        res.json({ message: 'Driver deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
