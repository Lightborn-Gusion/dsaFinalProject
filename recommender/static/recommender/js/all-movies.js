document.addEventListener("DOMContentLoaded", function() {
    const statusBtn = document.getElementById('status-btn');
    const genreBtn = document.getElementById('genre-btn');
    const monthBtn = document.getElementById('month-btn');
    const movieItems = document.querySelectorAll('.movie-item');

    // Handle clicking an option in the new custom dropdowns
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault(); // Stop page from jumping to top
            
            const target = this.getAttribute('data-target');
            const value = this.getAttribute('data-value');
            const text = this.innerText;

            // Update the button's text and hidden value
            if (target === 'status') {
                statusBtn.setAttribute('data-value', value);
                statusBtn.innerText = text;
            } else if (target === 'genre') {
                genreBtn.setAttribute('data-value', value);
                genreBtn.innerText = text;
            } else if (target === 'month') {
                monthBtn.setAttribute('data-value', value);
                monthBtn.innerText = text;
            }

            // Run the filter
            filterMovies();
        });
    });

    function filterMovies() {
        const selectedStatus = statusBtn.getAttribute('data-value');
        const selectedGenre = genreBtn.getAttribute('data-value').toLowerCase(); 
        const selectedMonth = monthBtn.getAttribute('data-value').toLowerCase(); 

        movieItems.forEach(item => {
            const itemStatus = item.getAttribute('data-status');
            const itemGenre = item.getAttribute('data-genre').toLowerCase();
            const itemMonth = item.getAttribute('data-month').toLowerCase();

            const matchesStatus = (selectedStatus === 'all' || itemStatus === selectedStatus);
            const matchesGenre = (selectedGenre === 'all' || itemGenre.includes(selectedGenre));
            const matchesMonth = (selectedMonth === 'all' || itemMonth.includes(selectedMonth));

            if (matchesStatus && matchesGenre && matchesMonth) {
                item.style.display = 'block'; 
            } else {
                item.style.display = 'none'; 
            }
        });
    }
});