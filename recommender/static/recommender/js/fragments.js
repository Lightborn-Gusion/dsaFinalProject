document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. PAGE LOADER LOGIC
    // ==========================================
    const loader = document.getElementById('page-loader');

    // INTRO: The new page is ready. Wait a tiny bit, then lift the curtain!
    setTimeout(() => {
        if (loader) loader.classList.add('loader-hidden');
    }, 100);

    // EXIT: Find all the links that go to different pages
    const links = document.querySelectorAll('a[href^="/"]:not(.dropdown-toggle):not([data-bs-toggle]):not([href^="/recommend/"])');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ignore clicks that open in new tabs
            if (e.ctrlKey || e.metaKey || e.button !== 0) return;

            e.preventDefault();
            const destination = this.href;

            // DROP THE CURTAIN! Fade the loader back in to cover the screen
            if (loader) {
                loader.classList.remove('loader-hidden');
            }

            // Wait 400ms for the curtain to turn fully opaque, then change pages behind it
            setTimeout(() => {
                window.location.href = destination;
            }, 400);
        });
    });

    // ==========================================
    // 2. THEME TOGGLE LOGIC
    // ==========================================
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // SYNC UP ON LOAD: Make sure body matches html perfectly before the curtain lifts
    const isCurrentlyDark = document.documentElement.classList.contains('dark-theme');
    if (isCurrentlyDark) {
        document.body.classList.add('dark-theme'); // Force body to match
        if(themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        document.body.classList.remove('dark-theme');
        if(themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // THE BUTTON CLICK LOGIC
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            // Figure out what the NEW state should be
            const willBeDark = !document.documentElement.classList.contains('dark-theme');

            // Force BOTH tags to explicitly match the new state
            if (willBeDark) {
                document.documentElement.classList.add('dark-theme');
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');

                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            } else {
                document.documentElement.classList.remove('dark-theme');
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');

                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }
        });
    }
});