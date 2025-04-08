import { formatPrice, parseUrlDateParams } from './utils/dateUtils.js';
import { calculateExperience, getCarImage, createDriveHistoryItem, fetchDriverDetails, fetchDriverHistory } from './utils/driverUtils.js';

// Initialize driver details when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Set up back button functionality
    document.getElementById('backButton').addEventListener('click', () => {
        history.back();
    });
    
    // Get params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('id');
    const { distanceKm: tripDistanceKm, passengers } = parseUrlDateParams(urlParams);

    if (!driverId) {
        document.getElementById('loading').textContent = 'No driver ID provided.';
        return;
    }

    try {
        // Fetch driver details
        const driver = await fetchDriverDetails(driverId);

        // Update driver info
        document.querySelector('.driver-name').textContent = driver.name;
        document.querySelector('.driver-rating').innerHTML = 
            "★".repeat(Math.floor(driver.rating)) + 
            (driver.rating % 1 ? "½" : "") +
            ` <span>(${driver.rating})</span>`;
        
        document.querySelector('.profile-image').src = driver.picture;
        document.querySelector('.car-model').textContent = driver.carModel;
        document.querySelector('.rate').textContent = `$${driver.rate}/km`;
        document.querySelector('.trips').textContent = driver.numberOfTrips;
        document.querySelector('.experience').textContent = calculateExperience(driver.numberOfTrips);
        
        // Show trip price if distance is provided
        if (tripDistanceKm) {
            const tripPrice = driver.rate * tripDistanceKm * passengers;
            document.getElementById('routeDetails').textContent = 
                `Price for ${tripDistanceKm.toFixed(2)} km Route (${passengers} passenger${passengers > 1 ? 's' : ''})`;
            document.querySelector('.total-price').textContent = formatPrice(tripPrice);
            document.getElementById('tripPriceSection').style.display = 'block';
        }

        // Set car image
        document.querySelector('.car-image').src = getCarImage(driver.carModel);

        // Show driver details
        document.getElementById('loading').style.display = 'none';
        document.getElementById('driverDetails').style.display = 'block';
        
        // Fetch and display past drives
        try {
            const drives = await fetchDriverHistory(driverId);
            const drivesContainer = document.getElementById('drivesContainer');
            const pastDrivesSection = document.getElementById('pastDrives');
            
            if (drives && drives.length > 0) {
                drivesContainer.innerHTML = drives.map(createDriveHistoryItem).join('');
                pastDrivesSection.style.display = 'block';
            } else {
                drivesContainer.innerHTML = `
                    <div class="no-drives">
                        <i class="fas fa-history"></i>
                        <p>No past routes found for this driver</p>
                    </div>`;
                pastDrivesSection.style.display = 'block';
            }
        } catch (historyError) {
            console.error('Error fetching driver history:', historyError);
            document.getElementById('drivesContainer').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to load drive history</p>
                    <small>${historyError.message}</small>
                </div>`;
            document.getElementById('pastDrives').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').textContent = 'Error loading driver details. Please try again.';
    }
});

// Subscription functionality
const calendarModal = document.getElementById('calendarModal');
const closeCalendarBtn = document.getElementById('closeCalendar');
const dayItems = document.querySelectorAll('.day-item');
const confirmSubscriptionBtn = document.getElementById('confirmSubscription');
const seatsInput = document.getElementById('seats');
let selectedDays = new Set();

// Open calendar modal
document.querySelector('.subscribe-btn').addEventListener('click', function() {
    calendarModal.classList.add('active');
});

// Close calendar modal
closeCalendarBtn.addEventListener('click', function() {
    calendarModal.classList.remove('active');
    selectedDays.clear();
    dayItems.forEach(day => day.classList.remove('selected'));
});

// Handle day selection
dayItems.forEach(day => {
    day.addEventListener('click', function() {
        const dayName = this.dataset.day.toLowerCase();
        if (dayName === 'saturday' || dayName === 'sunday') {
            alert('Weekend bookings are not available');
            return;
        }

        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
            selectedDays.delete(dayName);
        } else {
            this.classList.add('selected');
            selectedDays.add(dayName);
        }
    });
});

// Handle subscription confirmation
confirmSubscriptionBtn.addEventListener('click', function() {
    const seats = parseInt(seatsInput.value);
    if (selectedDays.size === 0) {
        alert('Please select at least one day');
        return;
    }
    if (seats < 1 || seats > 4) {
        alert('Please select between 1 and 4 passengers');
        return;
    }

    const selectedDaysList = Array.from(selectedDays);
    // Create URL with subscription and trip parameters
    const bookingUrl = new URL('/html/booking-confirmation.html', window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('id');
    const { distanceKm: tripDistanceKm, passengers } = parseUrlDateParams(urlParams);
    
    // Store current trip price for the booking
    const tripPriceElement = document.querySelector('.total-price');
    const currentPrice = tripPriceElement ? tripPriceElement.textContent : '';

    // Add subscription parameters
    bookingUrl.searchParams.set('id', driverId);
    bookingUrl.searchParams.set('subscriptionDays', selectedDaysList.join(','));
    bookingUrl.searchParams.set('subscriptionSeats', seats);
    bookingUrl.searchParams.set('isSubscription', 'true');
    
    // Add trip details
    bookingUrl.searchParams.set('distance', tripDistanceKm);
    bookingUrl.searchParams.set('basePrice', currentPrice);
    
    // Add route details from session storage if available
    ['origin', 'destination', 'duration'].forEach(key => {
        const value = sessionStorage.getItem(key);
        if (value) bookingUrl.searchParams.set(key, encodeURIComponent(value));
    });

    // Navigate to booking confirmation page
    window.location.href = bookingUrl.toString();
});

// Add booking functionality
document.querySelector('.book-btn').addEventListener('click', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('id');
    const { distanceKm, passengers } = parseUrlDateParams(urlParams);
    
    // Create URL with all necessary parameters
    const bookingUrl = new URL('/html/booking-confirmation.html', window.location.href);
    bookingUrl.searchParams.set('id', driverId);
    bookingUrl.searchParams.set('distance', distanceKm);
    bookingUrl.searchParams.set('passengers', passengers);
    
    // Add route details from session storage if available
    const routeDetails = ['origin', 'destination', 'duration'].reduce((params, key) => {
        const value = sessionStorage.getItem(key);
        if (value) params[key] = value;
        return params;
    }, {});

    // Add route details to URL if available
    Object.entries(routeDetails).forEach(([key, value]) => {
        bookingUrl.searchParams.set(key, value);
    });

    // Navigate to booking confirmation page
    window.location.href = bookingUrl.toString();
});
