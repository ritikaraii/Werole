const mongoose = require('mongoose');
const Driver = require('../models/Driver');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const sampleDrivers = [
    {
        name: "John Smith",
        rating: 4.8,
        picture: "https://randomuser.me/api/portraits/men/1.jpg",
        carModel: "Toyota Camry 2022",
        numberOfTrips: 1250,
        rate: 2.55
    },
    {
        name: "Maria Garcia",
        rating: 4.9,
        picture: "https://randomuser.me/api/portraits/women/2.jpg",
        carModel: "Honda Civic 2023",
        numberOfTrips: 875,
        rate: 2.40
    },
    {
        name: "David Chen",
        rating: 4.7,
        picture: "https://randomuser.me/api/portraits/men/3.jpg",
        carModel: "Tesla Model 3",
        numberOfTrips: 2100,
        rate: 3.50
    },
    {
        name: "Sarah Johnson",
        rating: 4.6,
        picture: "https://randomuser.me/api/portraits/women/4.jpg",
        carModel: "Hyundai Sonata 2022",
        numberOfTrips: 650,
        rate: 2.25
    },
    {
        name: "Michael Brown",
        rating: 4.9,
        picture: "https://randomuser.me/api/portraits/men/5.jpg",
        carModel: "BMW 3 Series",
        numberOfTrips: 1800,
        rate: 4.00
    },
    // 10 more random drivers
    {
        name: "Emma Wilson",
        rating: 4.7,
        picture: "https://randomuser.me/api/portraits/women/15.jpg",
        carModel: "Mercedes-Benz GLC SUV",
        numberOfTrips: 950,
        rate: 3.80
    },
    {
        name: "James Taylor",
        rating: 4.8,
        picture: "https://randomuser.me/api/portraits/men/20.jpg",
        carModel: "Audi Q5 SUV",
        numberOfTrips: 1560,
        rate: 4.20
    },
    {
        name: "Sophia Martinez",
        rating: 4.9,
        picture: "https://randomuser.me/api/portraits/women/25.jpg",
        carModel: "Lexus RX SUV",
        numberOfTrips: 2200,
        rate: 4.50
    },
    {
        name: "William Lee",
        rating: 4.6,
        picture: "https://randomuser.me/api/portraits/men/30.jpg",
        carModel: "Volkswagen Passat",
        numberOfTrips: 780,
        rate: 2.80
    },
    {
        name: "Isabella Anderson",
        rating: 4.8,
        picture: "https://randomuser.me/api/portraits/women/35.jpg",
        carModel: "BMW X5 SUV",
        numberOfTrips: 1350,
        rate: 4.10
    },
    {
        name: "Lucas Thompson",
        rating: 4.7,
        picture: "https://randomuser.me/api/portraits/men/40.jpg",
        carModel: "Tesla Model Y SUV",
        numberOfTrips: 890,
        rate: 3.90
    },
    {
        name: "Olivia White",
        rating: 4.9,
        picture: "https://randomuser.me/api/portraits/women/45.jpg",
        carModel: "Porsche Cayenne SUV",
        numberOfTrips: 1750,
        rate: 4.80
    },
    {
        name: "Daniel Kim",
        rating: 4.8,
        picture: "https://randomuser.me/api/portraits/men/50.jpg",
        carModel: "Kia K5",
        numberOfTrips: 1100,
        rate: 2.60
    },
    {
        name: "Ava Rodriguez",
        rating: 4.7,
        picture: "https://randomuser.me/api/portraits/women/55.jpg",
        carModel: "Range Rover Sport SUV",
        numberOfTrips: 1900,
        rate: 4.60
    },
    {
        name: "Benjamin Foster",
        rating: 4.8,
        picture: "https://randomuser.me/api/portraits/men/60.jpg",
        carModel: "Genesis G80",
        numberOfTrips: 1450,
        rate: 3.70
    }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Clear existing drivers
        await Driver.deleteMany({});
        console.log('Cleared existing drivers');

        // Insert sample drivers
        const insertedDrivers = await Driver.insertMany(sampleDrivers);
        console.log(`Added ${insertedDrivers.length} sample drivers to the database`);

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
