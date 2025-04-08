// Form validation
export function validateEmail(email) {
    return email.includes('@');
}

export function validatePassword(password) {
    return password.length >= 6;
}

export function validateName(name) {
    return name.length >= 2;
}

// Error display
export function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

export function hideErrors(...elementIds) {
    elementIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Image handling
export function validateImage(file) {
    if (!file) return { valid: false, error: 'No file selected' };
    
    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'Please select an image file' };
    }
    
    if (file.size > 5 * 1024 * 1024) {
        return { valid: false, error: 'Image size should be less than 5MB' };
    }
    
    return { valid: true };
}

export function handleImagePreview(file, previewId, errorId) {
    const imagePreview = document.getElementById(previewId);
    const errorElement = document.getElementById(errorId);
    
    if (!imagePreview || !errorElement) return;

    if (!file) {
        imagePreview.style.display = 'none';
        return;
    }

    const validation = validateImage(file);
    if (!validation.valid) {
        showError(errorId, validation.error);
        imagePreview.style.display = 'none';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'inline';
        hideErrors(errorId);
    };
    reader.readAsDataURL(file);
}

export function handleImageURL(url, previewId, errorId) {
    const imagePreview = document.getElementById(previewId);
    if (!imagePreview) return;

    if (!url) {
        imagePreview.style.display = 'none';
        return;
    }

    imagePreview.style.display = 'inline';
    imagePreview.src = url;
    imagePreview.onerror = function() {
        imagePreview.style.display = 'none';
        showError(errorId, 'Invalid image URL. Please provide a valid image URL.');
    };
    imagePreview.onload = function() {
        hideErrors(errorId);
    };
}
