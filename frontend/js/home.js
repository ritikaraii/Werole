import { initializeMap, displayRoute } from './utils/mapUtils.js';
import { initializeLocationSearch, geocodeLocation } from './utils/locationSearch.js';
import { displayDrivers } from './utils/driverUtils.js';
import { initializeDriverListScroll, initializeUIToggle, storeTripDetails, displayRouteDetails } from './utils/uiUtils.js';

let originSelected = false;
let destinationSelected = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupMapAndSearch();
    setupDriverList();
});

// Setup map and search functionality
function setupMapAndSearch() {
    // Initialize map
    const map = initializeMap('map');

    // Initialize location search for both inputs
    initializeLocationSearch('origin', 'originSuggestions', () => { originSelected = true; });
    initializeLocationSearch('destination', 'destinationSuggestions', () => { destinationSelected = true; });

    document.getElementById('origin').addEventListener('input', () => { originSelected = false; });
    document.getElementById('destination').addEventListener('input', () => { destinationSelected = false; });

    document.getElementById('origin').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.querySelector('#originSuggestions .suggestion-item')?.click();
    }
    });

    document.getElementById('destination').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.querySelector('#destinationSuggestions .suggestion-item')?.click();
    }
    });

    // Initialize UI toggle
    initializeUIToggle('toggleUIButton', 'search-section');

    // Handle form submission
    document.getElementById('travelForm').addEventListener('submit', handleRouteSubmission);
}

// Setup driver list functionality
function setupDriverList() {
    // Initially hide the driver list
    const driverList = document.getElementById('driverList');
    if (driverList) {
        driverList.style.display = 'none';
    }

    // Add filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const tripDistance = window.tripDistanceKm;
            const passengers = document.getElementById('passengers').value;
            displayDrivers('.drivers-container', this.dataset.filter, tripDistance, passengers);
        });
    });
}

// Handle route form submission
async function handleRouteSubmission(e) {
    e.preventDefault();
    const originInput = document.getElementById('origin').value;
    const destinationInput = document.getElementById('destination').value;
    const passengers = document.getElementById('passengers').value;

    if (!originSelected || !destinationSelected) {
        alert('Please select both origin and destination.');
        return;
    }

    if (originInput === destinationInput) {
        alert('Origin and destination cannot be the same.');
        return;
    }

    try {
        // Geocode locations
        const origin = await geocodeLocation(originInput);
        const destination = await geocodeLocation(destinationInput);

        // Display route and get details
        const routeDetails = await displayRoute(origin, destination);

        // Store trip details
        window.tripDistanceKm = routeDetails.distance;
        window.passengers = passengers;
        storeTripDetails(origin.display_name, destination.display_name, routeDetails.duration);

        // Display route details
        displayRouteDetails('results', {
            origin: origin.display_name,
            destination: destination.display_name,
            distance: routeDetails.distance,
            duration: routeDetails.duration
        });

        // Show and update driver list
        const driverList = document.getElementById('driverList');
        const driverListHeader = driverList.querySelector('.driver-list-header h2');
        driverListHeader.textContent = `Available Professional Drivers for ${routeDetails.distance.toFixed(2)}km Trip`;

        // Show the driver list
        await displayDrivers('.drivers-container', 'all', routeDetails.distance, passengers);
        driverList.style.display = 'block';
        driverList.classList.add('expanded');

        // Collapse search section
        document.querySelector('.search-section').classList.add('collapsed');
        document.getElementById('toggleUIButton').classList.add('rotated');

        // Initialize driver list scroll behavior
        initializeDriverListScroll('driverList');
    } catch (error) {
        console.error('Error processing route:', error);
        alert(error.message);
    }
}
