const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');

// Set CORS headers middleware
const setCorsHeaders = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

// Get drives by driver ID
router.get('/driver/:driverId', setCorsHeaders, async (req, res) => {
    try {
        const drives = await Drive.find({ driverId: req.params.driverId }).sort({ createdAt: -1 });
        res.json(drives);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all drives
router.get('/', setCorsHeaders, async (req, res) => {
    try {
        const drives = await Drive.find().sort({ createdAt: -1 });
        res.json(drives);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one drive
router.get('/:id', setCorsHeaders, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.id);
        if (drive) {
            res.json(drive);
        } else {
            res.status(404).json({ message: 'Drive not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a drive
router.post('/', setCorsHeaders, async (req, res) => {
    const drive = new Drive({
        driverId: req.body.driverId,
        origin: req.body.origin,
        destination: req.body.destination,
        distance: req.body.distance,
        duration: req.body.duration,
        price: req.body.price,
        status: req.body.status || 'in-progress'
    });

    try {
        const newDrive = await drive.save();
        res.status(201).json(newDrive);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update drive status
router.patch('/:id/status', setCorsHeaders, async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.id);
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        if (req.body.status) {
            drive.status = req.body.status;
            if (req.body.status === 'completed') {
                drive.completedAt = new Date();
            }
        }

        const updatedDrive = await drive.save();
        res.json(updatedDrive);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
