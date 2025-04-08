// Time formatting
export function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

// Get random minutes within a range
export function getRandomMinutes(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calculate arrival time
export function calculateArrivalTime(baseMinutes = { min: 5, max: 15 }) {
    const now = new Date();
    const arrivalMinutes = getRandomMinutes(baseMinutes.min, baseMinutes.max);
    const arrivalTime = new Date(now.getTime() + arrivalMinutes * 60000);
    
    return {
        time: formatTime(arrivalTime),
        minutes: arrivalMinutes
    };
}

// Format full date
export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Format duration
export function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
}

// Format distance
export function formatDistance(kilometers) {
    return `${parseFloat(kilometers).toFixed(2)} km`;
}

// Format price
export function formatPrice(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

// Parse URL parameters for date/time values
export function parseUrlDateParams(params) {
    return {
        distanceKm: parseFloat(params.get('distance') || 0),
        durationMin: parseInt(params.get('duration') || 0),
        passengers: parseInt(params.get('passengers') || 1)
    };
}
