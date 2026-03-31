// recommender/static/recommender/js/master.js

// --- THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved user preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
});

// --- RECOMMENDATION MODAL LOGIC (NETFLIX STYLE) ---

// Initialize the Bootstrap Modal
const recommendModalElement = document.getElementById('recommendModal');
const recommendModal = new bootstrap.Modal(recommendModalElement);

// We use a global click listener so it works even if content is filtered or reloaded
document.addEventListener('click', function(e) {
    // Look for the "Recommend Next" button
    const btn = e.target.closest('a[href^="/recommend/"]');
    if (!btn) return;

    e.preventDefault();

    // 1. Show loading state on the button
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Thinking...';
    btn.classList.add('disabled'); // Prevent double-clicking

    const url = btn.getAttribute('href');

    // 2. Fetch data from Python
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Server error');
            return response.json();
        })
        .then(data => {
            // Populate the "Source" movie (The one you just clicked)
            document.getElementById('rec-watched-img').src = '/static/recommender/' + data.watching_now.image;
            document.getElementById('rec-watched-title').innerText = data.watching_now.title;

            // --- THE CRITICAL NEW LINE FOR THE DESCRIPTION ---
            document.getElementById('rec-watched-desc').innerText = data.watching_now.desc;

            // Clear the "More Like This" shelf
            const shelf = document.getElementById('recommendation-list');
            shelf.innerHTML = '';

            // Inject the new Netflix-style movie cards
            data.recommendations.forEach(movie => {
                const movieCard = `
                    <div class="netflix-card-mini">
                        <div class="position-relative">
                            <img src="/static/recommender/${movie.image}"
                                 class="img-fluid rounded shadow-sm mb-2"
                                 style="aspect-ratio: 2/3; object-fit: cover; border: 1px solid var(--border-color); width: 100%;">
                        </div>
                        <h6 class="modal-movie-title small mb-0 text-truncate" style="max-width: 150px;">${movie.title}</h6>
                        <p class="modal-sub-text mb-0" style="font-size: 0.7rem; opacity: 0.7;">${movie.genre || 'Movie'}</p>
                    </div>
                `;
                shelf.insertAdjacentHTML('beforeend', movieCard);
            });

            // 3. Open the Modal
            recommendModal.show();
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            alert("Oops! The recommendation engine hit a snag. Check your Python console.");
        })
        .finally(() => {
            // 4. ALWAYS reset the button, even if it fails
            btn.innerHTML = originalHtml;
            btn.classList.remove('disabled');
        });
});
// --- WATCHLIST LOGIC ---

// 1. Function to safely get the list from browser memory
function getWatchlist() {
    const list = localStorage.getItem('my_watchlist');
    return list ? JSON.parse(list) : [];
}

// 2. Function to add/remove a movie when clicked
function toggleWatchlist(movie) {
    let list = getWatchlist();

    // Check if the movie is already in the list (force both to Strings just in case)
    const index = list.findIndex(item => String(item.id) === String(movie.id));

    if (index > -1) {
        list.splice(index, 1); // It's there, so remove it
    } else {
        list.push(movie); // It's not there, so add it
    }

    // Save the updated list back to the browser
    localStorage.setItem('my_watchlist', JSON.stringify(list));

    // Update the button colors immediately
    updateButtonStates();
}

// 3. Function to paint the buttons Black (Unsaved) or Red (Saved)
function updateButtonStates() {
    const list = getWatchlist();

    document.querySelectorAll('.watchlist-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        const icon = btn.querySelector('i');

        // Check if this specific button's ID is in our saved list
        const isSaved = list.some(item => String(item.id) === String(id));

        if (isSaved) {
            // SAVED: Solid RED icon
            icon.classList.replace('fa-regular', 'fa-solid');
            icon.style.setProperty('color', '#e50914', 'important');
        } else {
            // NOT SAVED: Outline BLACK icon
            icon.classList.replace('fa-solid', 'fa-regular');
            icon.style.setProperty('color', '#000000', 'important');
        }
    });
}

// 4. Listen for clicks on the buttons
document.addEventListener('click', (e) => {
    // Find if a watchlist button (or the icon inside it) was clicked
    const btn = e.target.closest('.watchlist-btn');
    if (!btn) return; // If they clicked somewhere else, do nothing

    // Grab the data from the button
    const movieData = {
        id: btn.getAttribute('data-id'),
        title: btn.getAttribute('data-title'),
        image: btn.getAttribute('data-image')
    };

    // Run the toggle function
    toggleWatchlist(movieData);
});

// 5. THE CRITICAL FIX: Run this the exact second the page loads!
document.addEventListener('DOMContentLoaded', () => {
    updateButtonStates();
});

function updateButtonStates() {
    const list = getWatchlist();
    document.querySelectorAll('.watchlist-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        const icon = btn.querySelector('i');
        const isSaved = list.some(item => item.id === id);

        if (isSaved) {
            // SAVED: Solid RED icon
            icon.classList.replace('fa-regular', 'fa-solid');
            icon.style.setProperty('color', '#e50914', 'important'); // Turns RED
            icon.style.setProperty('text-shadow', 'none', 'important');
        } else {
            // NOT SAVED: Outline BLACK icon
            icon.classList.replace('fa-solid', 'fa-regular');
            icon.style.setProperty('color', '#000000', 'important'); // Stays BLACK
            icon.style.setProperty('text-shadow', 'none', 'important');
        }
    });
}