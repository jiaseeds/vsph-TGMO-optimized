/* mobile-fix.js - V3 (Watchdog Version) */

(function() {
    // Only run this script on mobile devices
    if (!/Mobi|Tablet|Android|iPad|iPhone/.test(navigator.userAgent)) {
        return;
    }

    document.body.classList.add('mobile-view');

    const FIX_INTERVAL = 500; // Re-apply the fix every 500ms
    let fixIntervalId = null;
    let attempts = 0;

    /**
     * The core UI fixing logic. It directly manipulates 3DVista objects.
     */
    function applyFixes(rootPlayer) {
        console.log(`[MobileFix] Applying fixes (Attempt #${attempts})...`);

        // 1. FIX POPUP WINDOWS and IFRAMES
        const windows = rootPlayer.getByClassName('Window');
        windows.forEach(win => {
            win.set('width', '100%');
            win.set('height', '100%');
            win.set('minWidth', '100vw');
            win.set('minHeight', '100vh');
            win.set('horizontalAlign', 'center');
            win.set('verticalAlign', 'middle');
        });

        // 2. RESIZE BUTTONS, ICONS, and OVERLAYS
        const buttons = rootPlayer.getByClassName('Button');
        buttons.forEach(button => {
            button.set('minWidth', 48);
            button.set('minHeight', 48);
        });

        const hotspots = rootPlayer.getByClassName('HotspotPanoramaOverlay');
        hotspots.forEach(spot => {
             const items = spot.get('items');
             if(items && items.length > 0){
                const item = items[0];
                // Ensure hotspots are not too small
                 if(item.get('width') < 40) item.set('width', 40);
                 if(item.get('height') < 40) item.set('height', 40);
             }
        });

        // Special handling for the main close button in popups
        const closeButton = rootPlayer.getById('closeButtonPopupPanorama');
        if (closeButton) {
            closeButton.set('width', 50);
            closeButton.set('height', 50);
        }

        // 3. FORCE A RESIZE/REDRAW EVENT
        // This encourages the player to acknowledge our changes.
        window.dispatchEvent(new Event('resize'));
        console.log("[MobileFix] Fixes applied.");
        attempts++;

        // After 10 successful applications, we can probably stop.
        if (attempts > 10) {
            clearInterval(fixIntervalId);
            console.log("[MobileFix] Fix interval cleared after 10 successful runs.");
        }
    }

    /**
     * This function waits for the 3DVista tour to be fully initialized
     * and then starts the recurring fix.
     */
    function initializeWatchdog() {
        const tour = window.tour;

        if (tour && tour.isInitialized) {
            const rootPlayer = tour.player.getById('rootPlayer');
            if (rootPlayer) {
                console.log("[MobileFix] Tour is ready. Starting fix interval.");
                // Run it once immediately, then start the interval
                applyFixes(rootPlayer);
                fixIntervalId = setInterval(() => applyFixes(rootPlayer), FIX_INTERVAL);
            } else {
                console.error("[MobileFix] Tour is initialized, but rootPlayer not found!");
            }
        } else {
            // If the tour isn't ready yet, wait and try again.
            console.log("[MobileFix] Waiting for tour to initialize...");
            setTimeout(initializeWatchdog, 200);
        }
    }

    // Start the process once the basic DOM is loaded.
    document.addEventListener('DOMContentLoaded', () => {
        console.log("[MobileFix] DOM Loaded. Initializing watchdog.");
        initializeWatchdog();
    });

})();
