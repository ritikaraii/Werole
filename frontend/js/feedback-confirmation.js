document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.stars i');
    const ratingText = document.querySelector('.rating-text');
    const feedbackForm = document.getElementById('feedbackForm');
    const skipBtn = document.getElementById('skipBtn');
    let selectedRating = 0;

    // Rating text messages
    const ratingMessages = {
        1: 'Very Poor',
        2: 'Poor',
        3: 'Average',
        4: 'Good',
        5: 'Excellent'
    };

    // Handle star hover and click events
    stars.forEach(star => {
        // Hover effects
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(rating);
            ratingText.textContent = ratingMessages[rating];
        });

        star.addEventListener('mouseout', () => {
            if (selectedRating === 0) {
                clearStars();
                ratingText.textContent = 'Select your rating';
            } else {
                highlightStars(selectedRating);
                ratingText.textContent = ratingMessages[selectedRating];
            }
        });

        // Click event
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            highlightStars(selectedRating);
            ratingText.textContent = ratingMessages[selectedRating];
        });
    });

    // Function to highlight stars
    function highlightStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    // Function to clear star highlighting
    function clearStars() {
        stars.forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
    }

    // Handle form submission
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (selectedRating === 0) {
            alert('Please select a rating before submitting.');
            return;
        }

        const feedback = document.getElementById('feedback').value;

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: selectedRating,
                    feedback: feedback
                })
            });

            if (response.ok) {
                alert('Thank you for your feedback!');
                window.location.href = '/html/home.html';
            } else {
                throw new Error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit feedback. Please try again.');
        }
    });

    // Handle skip button
    skipBtn.addEventListener('click', () => {
        window.location.href = '/html/home.html';
    });
});
