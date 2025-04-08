import { formatPrice } from './utils/dateUtils.js';

document.addEventListener('DOMContentLoaded', function() {
    // Get booking details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const driverName = decodeURIComponent(urlParams.get('driverName') || '');
    const tripDetails = decodeURIComponent(urlParams.get('tripDetails') || '');
    const price = decodeURIComponent(urlParams.get('price') || '');
    
    // Display booking summary
    document.getElementById('driverName').textContent = `Driver: ${driverName}`;
    document.getElementById('tripDetails').textContent = tripDetails;
    document.getElementById('priceDetails').textContent = `Total Price: ${price}`;

    // Handle form submission
    document.getElementById('emailForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('/api/bookings/send-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    driverName,
                    tripDetails,
                    price
                })
            });

            if (response.ok) {
                // Redirect to feedback page
                window.location.href = '/html/feedback-confirmation.html';
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send booking details. Please try again.');
        }
    });

    // Handle cancel button
    document.getElementById('cancelBtn').addEventListener('click', function() {
        window.history.back();
    });
});
