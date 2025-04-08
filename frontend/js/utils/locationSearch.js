// Debounce utility function for search inputs
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Search locations using OpenStreetMap's Nominatim API
async function searchLocation(query) {
    if (query.length < 1) return [];
    
    try {
        const response = await fetch(
            'https://nominatim.openstreetmap.org/search?format=json&q=' + 
            encodeURIComponent(query)
        );
        return await response.json();
    } catch (error) {
        console.error('Location search error:', error);
        return [];
    }
}

// Helper function to update the highlighted suggestion and scroll into view
function updateHighlight(items, index, container) {
    items.forEach((item, i) => {
        item.classList.toggle('highlighted', i === index);
    });
    if (index >= 0) {
        items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

// Initialize location search for an input field
export function initializeLocationSearch(inputId, suggestionsId, onSelectCallback) {
    let currentHighlight = -1;
    const input = document.getElementById(inputId);
    const suggestionsDiv = document.getElementById(suggestionsId);

    if (!input || !suggestionsDiv) {
        console.error(`Elements not found: ${inputId} or ${suggestionsId}`);
        return;
    }

    input.addEventListener('keydown', (e) => {
        const items = suggestionsDiv.querySelectorAll('.suggestion-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentHighlight = (currentHighlight + 1) % items.length;
            updateHighlight(items, currentHighlight, suggestionsDiv);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentHighlight = (currentHighlight - 1 + items.length) % items.length;
            updateHighlight(items, currentHighlight, suggestionsDiv);
        } else if (e.key === 'Enter' && currentHighlight >= 0) {
            e.preventDefault();
            items[currentHighlight].click();
        }
    });

    input.addEventListener('input', debounce(async function() {
        const query = this.value;
        suggestionsDiv.innerHTML = '';

        const locations = await searchLocation(query);
        
        locations.forEach(location => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = location.display_name;
            
            suggestionItem.addEventListener('click', () => {
                input.value = location.display_name;
                suggestionsDiv.innerHTML = '';
                if (onSelectCallback) onSelectCallback();
            });
            
            suggestionsDiv.appendChild(suggestionItem);
        });

        // Initialize with first item highlighted
        const items = suggestionsDiv.querySelectorAll('.suggestion-item');
        if (items.length > 0) {
            currentHighlight = 0;
            updateHighlight(items, currentHighlight, suggestionsDiv);
        } else {
            currentHighlight = -1;
        }
    }, 300));
}

// Geocode a location string to coordinates
export async function geocodeLocation(locationString) {
    try {
        const results = await searchLocation(locationString);
        
        if (results.length === 0) {
            throw new Error(`Location not found: ${locationString}`);
        }

        return results[0];
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
}
