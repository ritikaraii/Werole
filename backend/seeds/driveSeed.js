const mongoose = require('mongoose');
const Drive = require('../models/Drive');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function generateSampleDrives() {
    // First get all drivers to reference their IDs
    const drivers = await mongoose.model('Driver').find();
    if (!drivers.length) {
        console.log('No drivers found. Please run driverSeed.js first.');
        return [];
    }

    // Sample locations
    const locations = [
        "Central Station",
        "Airport Terminal 1",
        "Shopping Mall",
        "Business District",
        "University Campus",
        "Beach Boulevard",
        "Downtown Plaza",
        "Sports Complex",
        "Convention Center",
        "Hotel Zone"
    ];

    const sampleDrives = [];
    
    // Create multiple drives for each driver
    for (const driver of drivers) {
        // Create 3-5 drives per driver
        const numberOfDrives = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < numberOfDrives; i++) {
            const origin = locations[Math.floor(Math.random() * locations.length)];
            let destination;
            do {
                destination = locations[Math.floor(Math.random() * locations.length)];
            } while (destination === origin); // Ensure different destination

            const distance = Math.floor(Math.random() * 30) + 5; // 5-35 km
            const duration = Math.floor(distance * 2) + Math.floor(Math.random() * 20); // Roughly 2 min/km plus traffic
            const price = Math.floor(distance * driver.rate * 100) / 100; // Based on driver's rate

            sampleDrives.push({
                driverId: driver._id,
                origin,
                destination,
                distance,
                duration,
                price,
                status: ['completed', 'completed', 'completed', 'in-progress', 'cancelled'][Math.floor(Math.random() * 5)], // More completed than others
                completedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date within last 30 days
            });
        }
    }

    return sampleDrives;
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Clear existing drives
        await Drive.deleteMany({});
        console.log('Cleared existing drives');

        // Generate and insert sample drives
        const sampleDrives = await generateSampleDrives();
        if (sampleDrives.length === 0) {
            console.log('No sample drives generated. Exiting.');
            await mongoose.disconnect();
            return;
        }
        const insertedDrives = await Drive.insertMany(sampleDrives);
        console.log(`Added ${insertedDrives.length} sample drives to the database`);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});
