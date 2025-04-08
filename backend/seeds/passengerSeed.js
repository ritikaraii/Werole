const mongoose = require('mongoose');
const Passenger = require('../models/Passenger');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('MongoDB Connection Error:', err));

const samplePassengers = [
    {
        name: "Emma Thompson",
        picture: "https://randomuser.me/api/portraits/women/1.jpg",
        numberOfTrips: 45,
        accountBalance: 350.50,
        rating: 4.8,
        isOnTrip: false
    },
    {
        name: "James Wilson",
        picture: "https://randomuser.me/api/portraits/men/2.jpg",
        numberOfTrips: 28,
        accountBalance: 125.75,
        rating: 4.5,
        isOnTrip: false
    },
    {
        name: "Sophia Rodriguez",
        picture: "https://randomuser.me/api/portraits/women/3.jpg",
        numberOfTrips: 62,
        accountBalance: 580.25,
        rating: 4.9,
        isOnTrip: true
    },
    {
        name: "Michael Chen",
        picture: "https://randomuser.me/api/portraits/men/4.jpg",
        numberOfTrips: 15,
        accountBalance: 90.00,
        rating: 4.3,
        isOnTrip: false
    },
    {
        name: "Isabella Kumar",
        picture: "https://randomuser.me/api/portraits/women/5.jpg",
        numberOfTrips: 37,
        accountBalance: 275.50,
        rating: 4.7,
        isOnTrip: false
    },
    {
        name: "William Taylor",
        picture: "https://randomuser.me/api/portraits/men/6.jpg",
        numberOfTrips: 51,
        accountBalance: 420.75,
        rating: 4.6,
        isOnTrip: false
    },
    {
        name: "Olivia Martinez",
        picture: "https://randomuser.me/api/portraits/women/7.jpg",
        numberOfTrips: 24,
        accountBalance: 180.25,
        rating: 4.4,
        isOnTrip: true
    },
    {
        name: "David Lee",
        picture: "https://randomuser.me/api/portraits/men/8.jpg",
        numberOfTrips: 42,
        accountBalance: 315.00,
        rating: 4.8,
        isOnTrip: false
    }
];

async function seedPassengers() {
    try {
        // Clear existing passengers
        await Passenger.deleteMany({});
        console.log('Cleared existing passengers');

        // Add new sample passengers
        await Passenger.insertMany(samplePassengers);
        console.log('Added sample passengers to the database');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedPassengers();
