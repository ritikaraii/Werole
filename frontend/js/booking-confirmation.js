import { calculateArrivalTime, formatDistance, formatDuration, formatPrice, parseUrlDateParams } from './utils/dateUtils.js';
import { fetchDriverDetails } from './utils/driverUtils.js';

// Initialize booking details when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Setup button handlers
    document.getElementById('confirmBtn').addEventListener('click', () => {
        // Create URL with booking details
        const emailConfirmUrl = new URL('/html/email-confirmation.html', window.location.href);
        
        // Get driver and trip details
        const driverName = document.getElementById('driver-name').textContent;
        const distance = document.getElementById('distance').textContent;
        const price = document.getElementById('price').textContent;
        
        // Create trip details string
        const origin = document.getElementById('origin').textContent;
        const destination = document.getElementById('destination').textContent;
        const tripDetails = `Trip from ${origin} to ${destination} (${distance})`;

        // Add parameters to URL
        emailConfirmUrl.searchParams.set('driverName', encodeURIComponent(driverName));
        emailConfirmUrl.searchParams.set('tripDetails', encodeURIComponent(tripDetails));
        emailConfirmUrl.searchParams.set('price', encodeURIComponent(price));

        // Redirect to email confirmation page
        window.location.href = emailConfirmUrl.toString();
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        window.history.back();
    });

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('id');
    const origin = decodeURIComponent(urlParams.get('origin') || '');
    const destination = decodeURIComponent(urlParams.get('destination') || '');
    const { distanceKm, durationMin, passengers } = parseUrlDateParams(urlParams);
    
    // Check if this is a subscription booking
    const isSubscription = urlParams.get('isSubscription') === 'true';
    const subscriptionDays = urlParams.get('subscriptionDays')?.split(',') || [];
    const subscriptionSeats = urlParams.get('subscriptionSeats');

    // Handle subscription details
    if (isSubscription) {
        const subscriptionDetails = document.getElementById('subscriptionDetails');
        const subscriptionText = document.getElementById('subscription');
        const priceLabel = document.getElementById('priceLabel');
        
        const daysCount = subscriptionDays.length;
        const daysText = `${subscriptionDays[0]} to ${subscriptionDays[subscriptionDays.length - 1]} (${daysCount} days)`;
        const seatsText = `${subscriptionSeats} ${subscriptionSeats === '1' ? 'seat' : 'seats'}`;
        subscriptionText.textContent = `${daysText} with ${seatsText}`;
        
        // Update price label for subscription
        priceLabel.textContent = "Your Subscribed Week's Total Trip Price";
        
        subscriptionDetails.classList.remove('hidden');
    }

    // Populate trip details
    document.getElementById('origin').textContent = origin;
    document.getElementById('destination').textContent = destination;
    document.getElementById('distance').textContent = formatDistance(distanceKm);
    document.getElementById('duration').textContent = formatDuration(durationMin);

    // Calculate and display arrival time
    const arrival = calculateArrivalTime();
    document.getElementById('arrival-time').textContent = `${arrival.time} (${arrival.minutes} min)`;

    // Fetch and display driver details
    if (driverId) {
        try {
            const driver = await fetchDriverDetails(driverId);
            
            // Update driver details
            document.getElementById('driver-photo').src = driver.picture;
            document.getElementById('driver-name').textContent = driver.name;
            document.getElementById('driver-rating').innerHTML = 
                "★".repeat(Math.floor(driver.rating)) + 
                (driver.rating % 1 ? "½" : "") +
                ` (${driver.rating})`;
            document.getElementById('car-model').textContent = driver.carModel;
            
            // Calculate price
            let price;
            if (isSubscription) {
                const numberOfDays = subscriptionDays.length;
                const subscriptionPassengers = parseInt(subscriptionSeats);
                // Calculate subscription price based on driver's rate, distance, seats, and days
                price = driver.rate * distanceKm * subscriptionPassengers * numberOfDays;
            } else {
                price = driver.rate * distanceKm * passengers;
            }

            // Display total price
            document.getElementById('price').textContent = formatPrice(price);
            
            // Update subscription text to include price per day
            if (isSubscription) {
                const pricePerDay = price / subscriptionDays.length;
                const subscriptionText = document.getElementById('subscription');
                const originalText = subscriptionText.textContent;
                subscriptionText.textContent = `${originalText} (${formatPrice(pricePerDay)} per day)`;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error loading driver details. Please try again.');
        }
    }
});
