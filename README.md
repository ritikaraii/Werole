# Werol - Ride Sharing Application

A web application for connecting drivers and passengers.

## Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/stignarnia/werol.git
```

2. Create a .env.docker file with your MongoDB connection string:
```env
MONGODB_URI=your_mongodb_connection_string
BACKEND_PORT=5000
FRONTEND_PORT=3000
```

3. Start the application:
```bash
docker compose up -d --force-recreate --build
```

The application will be available at http://localhost:3000

## Architecture

- Frontend: Express.js static file server (Port 3000)
- Backend: Express.js REST API
- Database: MongoDB Atlas (Cloud Database)

All services run in a single container using concurrently, with the frontend exposed on port 3000 and connecting to MongoDB Atlas in the cloud.
