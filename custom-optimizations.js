
/**
 * 3DVista Performance Optimizations
 *
 * This script should be loaded BEFORE any 3DVista scripts.
 * It prepares the environment for better runtime performance.
 */
document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // 1. Prepare for CSS Containment on the player
  const style = document.createElement('style');
  style.textContent = `
    /* Apply CSS containment once the player is mounted */
    #tdv-container, .media-container, .panorama-container {
      contain: content;
    }
    /* Hide hotspots initially on mobile */
    .hotspot-wrapper {
      visibility: hidden;
    }
  `;
  document.head.appendChild(style);

  // 2. Override tour.load() to inject optimizations
  function overrideTourLoad() {
    if (window.tour && window.tour.load && !window.tour.load.__overridden) {
      const originalLoad = window.tour.load;

      window.tour.load = function(...args) {
        console.log('Gemini IDE: Applying 3DVista optimizations...');

        // Disable heavy features on mobile BEFORE loading the tour
        if (isMobile && window.tour.set) {
          console.log('Mobile device detected. Disabling bloom and flare effects.');
          window.tour.set('effect_bloom_enabled', false);
          window.tour.set('effect_flare_enabled', false);
        }

        // Hook into the 'onready' event to delay secondary UI
        const originalOnReady = window.tour.onready;
        window.tour.onready = function() {
          console.log('Gemini IDE: Tour is ready. Delaying hotspot visibility.');
          
          // Delay hotspot visibility until after the first scene is shown
          setTimeout(() => {
            style.textContent = style.textContent.replace(
              '.hotspot-wrapper { visibility: hidden; }',
              '.hotspot-wrapper { visibility: visible; }'
            );
            console.log('Gemini IDE: Hotspots are now visible.');
          }, 1500); // Delay can be adjusted

          // Call original onready if it existed
          if (typeof originalOnReady === 'function') {
            originalOnReady.apply(this, arguments);
          }
        };

        // Call the original tour.load() function
        return originalLoad.apply(this, args);
      };
      window.tour.load.__overridden = true;
      console.log('Gemini IDE: tour.load() has been successfully overridden.');
    } else {
       // If tour object is not ready, poll again
       setTimeout(overrideTourLoad, 50);
    }
  }

  overrideTourLoad();
});
