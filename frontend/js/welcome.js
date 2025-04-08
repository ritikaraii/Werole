import { redirectIfLoggedIn } from './utils/authUtils.js';

// Check if user is already logged in and redirect if needed
document.addEventListener('DOMContentLoaded', function() {
    redirectIfLoggedIn();
});
