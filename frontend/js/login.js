import { loginUser } from './utils/authUtils.js';
import { validateEmail, showError, hideErrors } from './utils/formUtils.js';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorIds = ['emailError', 'passwordError'];
    
    // Reset error messages
    hideErrors(errorIds);

    // Validate email
    if (!validateEmail(emailInput.value)) {
        showError('emailError', 'Please enter a valid email address');
        return;
    }

    try {
        await loginUser(emailInput.value, passwordInput.value);
        // Redirect to home page
        window.location.href = '/html/home.html';
    } catch (error) {
        console.error('Error:', error);
        showError('passwordError', error.message);
    }
});
