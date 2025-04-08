const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Passenger = require('../models/Passenger');

// Register new user and passenger
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, picture } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create passenger first
        const passenger = new Passenger({
            name,
            picture,
            numberOfTrips: 0,
            accountBalance: 0,
            rating: 5,
            isOnTrip: false
        });
        const savedPassenger = await passenger.save();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with passenger reference
        const user = new User({
            email,
            password: hashedPassword,
            role: 'passenger',
            passengerId: savedPassenger._id
        });
        const savedUser = await user.save();

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: savedUser._id,
                email: savedUser.email,
                role: savedUser.role,
                passenger: savedPassenger
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Get passenger info if role is passenger
        let passenger = null;
        if (user.role === 'passenger' && user.passengerId) {
            passenger = await Passenger.findById(user.passengerId);
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                passenger: passenger
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let profile = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        if (user.role === 'passenger' && user.passengerId) {
            const passenger = await Passenger.findById(user.passengerId);
            if (passenger) {
                profile.passenger = passenger;
            }
        }

        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
