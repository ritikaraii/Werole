import { registerUser } from './utils/authUtils.js';
import { validateName, validateEmail, validatePassword, showError, hideErrors, handleImagePreview, handleImageURL } from './utils/formUtils.js';

document.addEventListener('DOMContentLoaded', function() {
    const errorIds = ['nameError', 'emailError', 'passwordError', 'pictureError'];

    // Image upload handler
    document.getElementById('picture').addEventListener('change', (event) => {
        handleImagePreview(event.target.files[0], 'imagePreview', 'pictureError');
    });

    // Image URL preview
    document.getElementById('picture').addEventListener('input', () => {
        const pictureInput = document.getElementById('picture');
        if (!pictureInput.files || pictureInput.files.length === 0) {
            handleImageURL(pictureInput.value, 'imagePreview', 'pictureError');
        }
    });

    // Form submission
    document.getElementById('signupForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset errors
        hideErrors(errorIds);

        // Get form inputs
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const imagePreview = document.getElementById('imagePreview');

        // Validate inputs
        if (!validateName(name)) {
            showError('nameError', 'Name must be at least 2 characters long');
            return;
        }

        if (!validateEmail(email)) {
            showError('emailError', 'Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            showError('passwordError', 'Password must be at least 6 characters long');
            return;
        }

        // Create registration data
        const registrationData = {
            email,
            password,
            name,
            picture: imagePreview.style.display === 'inline' ? 
                    imagePreview.src :
                    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        };

        try {
            await registerUser(registrationData);
            
            // Show success message
            document.getElementById('successMessage').style.display = 'block';
            
            // Reset form
            document.getElementById('signupForm').reset();
            imagePreview.style.display = 'none';

            // Redirect to home page after successful registration and auto-login
            setTimeout(() => {
                window.location.href = '/html/home.html';
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating account. Please try again.');
        }
    });
});
