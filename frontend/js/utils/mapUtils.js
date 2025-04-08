import 'https://unpkg.com/leaflet/dist/leaflet.js';

// Map instance and layers
let map;
let routeLayer;
let originMarker;
let destinationMarker;

// Initialize map with default view
export function initializeMap(elementId, defaultCenter = [59.3293, 18.0686], defaultZoom = 13) {
    map = L.map(elementId).setView(defaultCenter, defaultZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Initialize user location if available
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude: lat, longitude: lon } = position.coords;
                L.marker([lat, lon]).addTo(map).bindPopup('You are here').openPopup();
            },
            error => console.error("Geolocation error: ", error)
        );
    }

    return map;
}

// Display route between two points
export async function displayRoute(origin, destination) {
    try {
        // Clear previous route and markers
        if (routeLayer) map.removeLayer(routeLayer);
        if (originMarker) map.removeLayer(originMarker);
        if (destinationMarker) map.removeLayer(destinationMarker);

        // Create markers
        originMarker = L.marker([origin.lat, origin.lon])
            .addTo(map)
            .bindPopup('Origin: ' + origin.display_name);
        
        destinationMarker = L.marker([destination.lat, destination.lon])
            .addTo(map)
            .bindPopup('Destination: ' + destination.display_name);

        // Fetch and display route
        const routeUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`;
        const response = await fetch(routeUrl);
        const routeData = await response.json();

        if (routeData.code !== "Ok" || routeData.routes.length === 0) {
            throw new Error("No route found");
        }

        routeLayer = L.geoJSON(routeData.routes[0].geometry).addTo(map);
        map.fitBounds(routeLayer.getBounds());

        return {
            distance: routeData.routes[0].distance / 1000, // Convert to km
            duration: Math.ceil(routeData.routes[0].duration / 60) // Convert to minutes
        };
    } catch (error) {
        console.error("Error displaying route:", error);
        throw error;
    }
}

// Get the map instance
export function getMap() {
    return map;
}
