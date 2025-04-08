const express = require('express');
const router = express.Router();

// Store feedback
router.post('/feedback', async (req, res) => {
    try {
        const { rating, feedback } = req.body;

        // TODO: Store feedback in database
        // For now, just log it
        console.log('Received Feedback:', {
            rating,
            feedback,
            timestamp: new Date()
        });

        res.json({ message: 'Feedback received successfully' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ message: 'Failed to save feedback' });
    }
});

module.exports = router;
