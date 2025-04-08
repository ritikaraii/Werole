// User authentication state management
export function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}

export function setUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
}

export function removeUser() {
    localStorage.removeItem('user');
}

export function redirectIfLoggedIn(redirectPath = '/html/home.html') {
    if (getUser()) {
        window.location.href = redirectPath;
    }
}

export function redirectIfNotLoggedIn(redirectPath = '/html/welcome.html') {
    if (!getUser()) {
        window.location.href = redirectPath;
    }
}

// API calls
export async function loginUser(email, password) {
    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
    }

    setUser(data.user);
    return data;
}

export async function registerUser(userData) {
    const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    // Automatically log in the user after registration
    setUser(data.user);
    return data;
}
