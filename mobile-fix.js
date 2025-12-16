// mobile-fix.js
document.addEventListener('DOMContentLoaded', () => {
    const mobileBreakpoint = 768; // Set the pixel width for what you consider "mobile"
    const body = document.body;
    const viewer = document.getElementById('viewer');

    if (!viewer) {
        console.error('3DVista #viewer element not found. Mobile fix script cannot run.');
        return;
    }

    // Create an observer to watch for size changes in the main viewer
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width } = entry.contentRect;
            if (width < mobileBreakpoint) {
                body.classList.add('mobile-view');
            } else {
                body.classList.remove('mobile-view');
            }
        }
    });

    // Start observing the main viewer container
    resizeObserver.observe(viewer);
});
