import { formatDate, formatDistance, formatDuration, formatPrice } from './dateUtils.js';

// Driver card creation
export function getCarIcon(carModel) {
    return carModel.toLowerCase().includes('suv') ? 'fa-truck-monster' : 'fa-car';
}

export function calculateExperience(numberOfTrips) {
    const years = Math.max(1, Math.floor(numberOfTrips / 500));
    return `${years} years`;
}

// Create HTML for a driver card
export function createDriverCard(driver, tripDistanceKm = null, passengers = 1) {
    const carType = driver.carModel.toLowerCase().includes('suv') ? 'suv' : 'sedan';
    const carIconClass = carType;
    
    return `
        <div class="driver-card" data-type="${carType}">
            <img src="${driver.picture}" alt="${driver.name}" class="driver-photo">
            <div class="driver-info">
                <div class="driver-name">${driver.name}</div>
                <div class="driver-rating">
                    ${"★".repeat(Math.floor(driver.rating))}${driver.rating % 1 ? "½" : ""}
                    <span>(${driver.rating})</span>
                </div>
                <div class="car-info">
                    <i class="car-icon fas ${getCarIcon(driver.carModel)} ${carIconClass}"></i>
                    ${driver.carModel}
                </div>
                <div class="driver-stats">
                    <div class="stat">
                        <i class="fas fa-route"></i>
                        <span class="stat-value">${driver.numberOfTrips}</span>
                        <span class="stat-label">Total Trips</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-clock"></i>
                        <span class="stat-value">${calculateExperience(driver.numberOfTrips).split(' ')[0]}</span>
                        <span class="stat-label">Years Exp.</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-tag"></i>
                        <span class="stat-value">$${driver.rate}/km</span>
                        <span class="stat-label">Rate</span>
                    </div>
                    ${tripDistanceKm ? `
                    <div class="stat trip-price">
                        <i class="fas fa-dollar-sign"></i>
                        <span class="stat-value">
                            ${(driver.rate * tripDistanceKm * passengers).toFixed(2)}
                        </span>
                        <span class="stat-label">Price for ${passengers} passenger${passengers > 1 ? 's' : ''}</span>
                    </div>
                    ` : ''}
                </div>
                <a href="driver-details.html?id=${driver._id}${tripDistanceKm ? '&distance=' + tripDistanceKm + '&passengers=' + passengers : ''}" 
                   class="book-btn">
                    <i class="fas fa-check-circle"></i>
                    View Details & Book
                </a>
            </div>
        </div>
    `;
}

// Driver profile display
export function getCarImage(carModel) {
    const model = carModel.toLowerCase();
    if (model.includes('tesla')) {
        return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3';
    } else if (model.includes('bmw')) {
        return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3';
    } else if (model.includes('mercedes')) {
        return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3';
    } else if (model.includes('audi')) {
        return 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3';
    }
    return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3';
}

// Drive history
export function getStatusClass(status) {
    return {
        'completed': 'status-completed',
        'in-progress': 'status-in-progress',
        'cancelled': 'status-cancelled'
    }[status] || 'status-in-progress';
}

export function createDriveHistoryItem(drive) {
    return `
        <div class="drive-item">
            <div class="drive-details">
                <div class="drive-info">
                    <span class="drive-info-label">From</span>
                    <span class="drive-info-value">${drive.origin}</span>
                </div>
                <div class="drive-info">
                    <span class="drive-info-label">To</span>
                    <span class="drive-info-value">${drive.destination}</span>
                </div>
                <div class="drive-info">
                    <span class="drive-info-label">Distance</span>
                    <span class="drive-info-value">${formatDistance(drive.distance)}</span>
                </div>
                <div class="drive-info">
                    <span class="drive-info-label">Duration</span>
                    <span class="drive-info-value">${formatDuration(drive.duration)}</span>
                </div>
                <div class="drive-info">
                    <span class="drive-info-label">Price</span>
                    <span class="drive-info-value">${formatPrice(drive.price)}</span>
                </div>
                <div class="drive-info">
                    <span class="drive-info-label">Date</span>
                    <span class="drive-info-value">${formatDate(drive.createdAt)}</span>
                </div>
            </div>
            <div class="drive-status ${getStatusClass(drive.status)}">
                ${drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
            </div>
        </div>
    `;
}

// Display filtered drivers in container
export async function displayDrivers(containerSelector, filter = 'all', tripDistanceKm = null, passengers = 1) {
    try {
        const driversContainer = document.querySelector(containerSelector);
        if (!driversContainer) {
            throw new Error(`Drivers container not found: ${containerSelector}`);
        }

        const drivers = await fetchDrivers();
        
        if (!drivers || drivers.length === 0) {
            driversContainer.innerHTML = '<p>No drivers available at this time.</p>';
            return;
        }

        const filteredDrivers = drivers.filter(driver => {
            if (filter === 'all') return true;
            return filter === (driver.carModel.toLowerCase().includes('suv') ? 'suv' : 'sedan');
        });

        driversContainer.innerHTML = filteredDrivers.length > 0 
            ? filteredDrivers.map(driver => createDriverCard(driver, tripDistanceKm, passengers)).join('')
            : '<p>No drivers available for selected filter.</p>';
    } catch (error) {
        console.error('Error displaying drivers:', error);
    }
}

// API calls
export async function fetchDrivers() {
    const response = await fetch('/api/drivers', {
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch drivers: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
}

export async function fetchDriverDetails(driverId) {
    const response = await fetch(`/api/drivers/${driverId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch driver details');
    }
    return response.json();
}

export async function fetchDriverHistory(driverId) {
    try {
        const response = await fetch(`/api/drives/driver/${driverId}`);
        console.log('Fetching history for driver:', driverId);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            // Try to parse as JSON, but handle case where response is not JSON
            let errorMessage = 'Failed to fetch driver history';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (parseError) {
                // If response is not JSON (e.g., HTML error page), use status text
                errorMessage = `Server returned ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error details:', error);
        throw new Error(`Failed to fetch driver history: ${error.message}`);
    }
}
