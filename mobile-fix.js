/* mobile-fix.js - V4 (Aggressive Watchdog) */

(function() {
    // Only run this script on mobile devices
    if (!/Mobi|Tablet|Android|iPad|iPhone/.test(navigator.userAgent)) {
        return;
    }

    document.body.classList.add('mobile-view');

    const FIX_INTERVAL = 500; // Re-apply the fix every 500ms
    let fixIntervalId = null;
    let attempts = 0;

    function applyFixes(rootPlayer) {
        console.log(`[MobileFix V4] Applying fixes (Attempt #${attempts})...`);

        // 1. Aggressively fix POPUP WINDOWS and IFRAMES
        const windows = rootPlayer.getByClassName('Window');
        windows.forEach(win => {
            win.set('width', '100%');
            win.set('height', '100%');
            win.set('minWidth', '100vw');
            win.set('minHeight', '100vh');
            win.set('horizontalAlign', 'center');
            win.set('verticalAlign', 'middle');
        });

        const webFrames = rootPlayer.getByClassName('WebFrame');
        webFrames.forEach(frame => {
            frame.set('width', '100%');
            frame.set('height', '100%');
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
                 if(item.get('width') < 40) item.set('width', 40);
                 if(item.get('height') < 40) item.set('height', 40);
             }
        });

        const closeButton = rootPlayer.getById('closeButtonPopupPanorama');
        if (closeButton) {
            closeButton.set('width', 50);
            closeButton.set('height', 50);
        }

        window.dispatchEvent(new Event('resize'));
        attempts++;

        if (attempts > 20) { // Let's run it a bit longer to be safe
            clearInterval(fixIntervalId);
            console.log("[MobileFix V4] Fix interval cleared after 20 successful runs.");
        }
    }

    function initializeWatchdog() {
        const tour = window.tour;
        if (tour && tour.isInitialized) {
            const rootPlayer = tour.player.getById('rootPlayer');
            if (rootPlayer) {
                console.log("[MobileFix V4] Tour is ready. Starting fix interval.");
                applyFixes(rootPlayer);
                fixIntervalId = setInterval(() => applyFixes(rootPlayer), FIX_INTERVAL);
            } else {
                console.error("[MobileFix V4] Tour is initialized, but rootPlayer not found!");
            }
        } else {
            setTimeout(initializeWatchdog, 200);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        console.log("[MobileFix V4] DOM Loaded. Initializing watchdog.");
        initializeWatchdog();
    });

})();
