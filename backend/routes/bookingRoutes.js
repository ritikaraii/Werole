const express = require('express');
const router = express.Router();

// Send booking details via email
router.post('/send-details', async (req, res) => {
    try {
        const { email, driverName, tripDetails, price } = req.body;

        // TODO: Implement actual email sending functionality
        // For now, just simulate successful email sending
        console.log('Sending booking details to:', email);
        console.log('Details:', { driverName, tripDetails, price });

        res.json({ message: 'Booking details sent successfully' });
    } catch (error) {
        console.error('Error sending booking details:', error);
        res.status(500).json({ message: 'Failed to send booking details' });
    }
});

module.exports = router;
