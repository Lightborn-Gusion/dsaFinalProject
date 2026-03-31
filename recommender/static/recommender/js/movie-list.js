document.addEventListener("DOMContentLoaded", function() {
        const grid = document.getElementById('watchlist-grid');
        const emptyMsg = document.getElementById('empty-msg');
        const countBadge = document.getElementById('watchlist-count');

        const list = JSON.parse(localStorage.getItem('my_watchlist')) || [];

        if (list.length === 0) {
            emptyMsg.classList.remove('d-none');
            countBadge.innerText = "0 Movies";
        } else {
            countBadge.innerText = `${list.length} Movies`;
            list.forEach(movie => {
                // ANIMATION: Added 'wow fadeInUp' to the injected card
                grid.innerHTML += `
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-4 wow fadeInUp" data-wow-delay="0.2s">
                        <div class="movie-card position-relative shadow-sm rounded overflow-hidden" style="border: 1px solid var(--border-color); background: var(--card-bg);">
                            <img src="/static/recommender/${movie.image}" class="card-img-top" style="height: 350px; object-fit: cover;">
                            <div class="p-3">
                                <h6 class="text-truncate mb-0" style="color: var(--text-color);">${movie.title}</h6>
                            </div>
                        </div>
                    </div>
                `;
            });

            // Re-trigger WOW.js so it sees the newly injected JS cards!
            if (typeof WOW !== 'undefined') {
                new WOW().init();
            }
        }
    });