// Initialize scroll listener for driver list expansion
export function initializeDriverListScroll(driverListId) {
    const driverList = document.getElementById(driverListId);
    if (!driverList) {
        console.error('Driver list element not found');
        return;
    }

    const driversContainer = driverList.querySelector('.drivers-container');
    if (!driversContainer) {
        console.error('Drivers container not found');
        return;
    }

    let isExpanding = false;
    let isExpanded = false;
    let touchStartY = 0;

    // Touch event handlers
    driversContainer.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });

    driversContainer.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const scrollTop = this.scrollTop;
        
        handleScrollChange(scrollTop, touchY < touchStartY);
    });

    // Scroll event handler
    driversContainer.addEventListener('scroll', function() {
        const scrollTop = this.scrollTop;
        const isScrollingUp = this.lastScrollTop > scrollTop;
        this.lastScrollTop = scrollTop;

        handleScrollChange(scrollTop, !isScrollingUp);
    });

    // Helper function to handle scroll state changes
    function handleScrollChange(scrollTop, isScrollingDown) {
        if (!isExpanded && !isExpanding && isScrollingDown && scrollTop > 10) {
            expandList();
        } else if (isExpanded && !isExpanding && !isScrollingDown && scrollTop <= 2) {
            collapseList();
        }
    }

    // Expand the driver list
    function expandList() {
        isExpanding = true;
        driverList.classList.add('full-height');
        
        setTimeout(() => {
            isExpanding = false;
            isExpanded = true;
        }, 400);
    }

    // Collapse the driver list
    function collapseList() {
        isExpanding = true;
        driverList.classList.remove('full-height');
        
        setTimeout(() => {
            isExpanding = false;
            isExpanded = false;
        }, 400);
    }

    // Reset state when the driver list is shown
    driverList.addEventListener('transitionend', function(e) {
        if (e.propertyName === 'bottom' && driverList.classList.contains('expanded')) {
            isExpanding = false;
            isExpanded = false;
            driverList.classList.remove('full-height');
            driversContainer.scrollTop = 0;
        }
    });
}

// Toggle UI sections
export function initializeUIToggle(buttonId, sectionClass) {
    const toggleBtn = document.getElementById(buttonId);
    if (!toggleBtn) {
        console.error('Toggle button not found');
        return;
    }

    toggleBtn.addEventListener('click', function() {
        const section = document.querySelector(`.${sectionClass}`);
        if (!section) {
            console.error('Target section not found');
            return;
        }

        section.classList.toggle('collapsed');
        this.classList.toggle('rotated');
    });
}

// Store trip details in session storage
export function storeTripDetails(origin, destination, duration) {
    sessionStorage.setItem('origin', origin);
    sessionStorage.setItem('destination', destination);
    sessionStorage.setItem('duration', duration);
}

// Display route results
export function displayRouteDetails(elementId, details) {
    const resultsElement = document.getElementById(elementId);
    if (!resultsElement) {
        console.error('Results element not found');
        return;
    }

    resultsElement.innerHTML = `
        <h2>Route Details</h2>
        <p><strong>Origin:</strong> ${details.origin}</p>
        <p><strong>Destination:</strong> ${details.destination}</p>
        <p><strong>Distance:</strong> ${details.distance.toFixed(2)} km</p>
        <p><strong>Estimated Duration:</strong> ${details.duration} minutes</p>
    `;
}
