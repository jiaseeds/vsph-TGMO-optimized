/* custom-optimizations.js */

function applyOptimizations() {
    const tour = window.tour;
    if (!tour) {
        console.warn('Tour object not found. Optimizations not applied.');
        return;
    }

    // C) 2. Disable heavy UI elements on mobile and VR
    if (tour.isMobile() || tour.isVR()) {
        const componentsToDisable = ['ThumbnailStrip', 'SomeComplexMenu']; // Add IDs/names
        tour.setComponentsVisibilityByTags(componentsToDisable, false, 'or');
    }

    // C) 4. Lazy-load hotspots
    tour.player.bind('mediaChange', (event) => {
        const media = event.data.media;
        // Hide all hotspots initially
        tour.setOverlaysVisibilityByTags(['hotspot'], false, 'or');

        // Show hotspots after a delay or on user interaction
        setTimeout(() => {
            tour.setOverlaysVisibilityByTags(['hotspot'], true, 'or');
        }, 1000); // 1-second delay
    });

    // C) 3. Single reusable info panel (Conceptual)
    // This requires more advanced DOM manipulation and event interception.
    // We'll create a single panel and reuse it.
    const infoPanel = document.createElement('div');
    infoPanel.id = 'reusable-info-panel';
    infoPanel.style.display = 'none';
    document.body.appendChild(infoPanel);

    tour.player.bind('hotspotClick', (event) => {
        const hotspot = event.data.hotspot;
        if (hotspot.get('data')?.isInfoHotspot) { // Add a custom data flag in 3DVista
            event.preventDefault(); // Stop the default 3DVista popup

            infoPanel.innerHTML = hotspot.get('data').content;
            infoPanel.style.display = 'block';
        }
    });
}

// We will call applyOptimizations from a modified onVirtualTourLoaded
