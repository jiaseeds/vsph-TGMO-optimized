
(function() {
    // Only run this script on mobile devices
    if (!/Mobi|Tablet|Android|iPad|iPhone/.test(navigator.userAgent)) {
        return;
    }

    // HELPER: Adds a class to the body to allow for broad CSS overrides as a fallback
    document.body.classList.add('mobile-view');

    /**
     * The main function to fix UI elements. This function will be called after the 3DVista tour is fully loaded.
     * It directly manipulates the 3DVista player objects.
     */
    function fixMobileUI(tour) {
        console.log("Attempting to apply mobile UI fixes...");

        if (!tour || !tour.player) {
            console.error("Mobile Fix: Tour object or player not available.");
            return;
        }

        const rootPlayer = tour.player.getById('rootPlayer');
        if (!rootPlayer) {
            console.error("Mobile Fix: rootPlayer not found.");
            return;
        }

        // 1. FIX POPUP WINDOWS and IFRAMES
        const windows = rootPlayer.getByClassName('Window');
        windows.forEach(win => {
            // Override hardcoded sizes for all windows to make them responsive
            win.set('width', '100%');
            win.set('height', '100%');
            win.set('minWidth', '100vw');
             // Setting positioning to ensure it covers the screen
            win.set('horizontalAlign', 'center');
            win.set('verticalAlign', 'middle');
        });

        const webFrames = rootPlayer.getByClassName('WebFrame');
        webFrames.forEach(frame => {
            frame.set('width', '100%');
            frame.set('height', '100%');
        });

        // 2. RESIZE BUTTONS AND ICONS
        const buttons = rootPlayer.getByClassName('Button');
        buttons.forEach(button => {
            // Increase the size of buttons for better touch interaction
            const currentWidth = button.get('width') || 40;
            const currentHeight = button.get('height') || 40;
            button.set('width', currentWidth * 1.5);
            button.set('height', currentHeight * 1.5);
        });
        
        const hotspotOverlays = rootPlayer.getByClassName('HotspotPanoramaOverlay');
        hotspotOverlays.forEach(overlay => {
            // Scale up hotspots
            const items = overlay.get('items');
            if(items && items.length > 0) {
                items.forEach(item => {
                    const currentWidth = item.get('width') || 32;
                    const currentHeight = item.get('height') || 32;
                    item.set('width', currentWidth * 1.5);
                    item.set('height', currentHeight * 1.5);
                })
            }
        });
        
        // 3. FORCE A RESIZE/REDRAW
        // This is crucial to make the player recalculate the layout with our new values.
        window.dispatchEvent(new Event('resize'));
        
        // Also, try to call internal resize methods if they exist
        const mainViewer = rootPlayer.getMainViewer();
        if (mainViewer && typeof mainViewer.resize === 'function') {
            mainViewer.resize();
        }

        console.log("Mobile UI fixes applied.");
    }

    /**
     * 3DVista takes time to initialize. We can't run our fix until the tour is ready.
     * We will listen for the custom 'tourLoaded' event that the main script dispatches.
     */
    function initializeFix() {
        // The global 'tour' object is created by 3DVista's scripts.
        if (window.tour && window.tour.isInitialized) {
            // If tour is already loaded, run the fix immediately.
            fixMobileUI(window.tour);
        } else {
            // Otherwise, wait for the 'tourLoaded' event.
            window.addEventListener('tourLoaded', () => {
                fixMobileUI(window.tour);
            });
        }
    }
    
    // The DOM is ready, but 3DVista might not be. Start the process.
     document.addEventListener('DOMContentLoaded', initializeFix);

})();
