"use strict";
(() => {
    const depthLimit = 500;
    const findAPI = win => {
        let depth = 0;
        while (!win.API && !win.API_1484_11 && win.parent && win.parent !== win && depth <= depthLimit) {
            depth++;
            win = win.parent;
        }
        return win.API_1484_11 || win.API || null;
    };
    const getAPI = win => {
        let API = findAPI(win);
        if (!API && win.parent && win.parent !== win) API = findAPI(win.parent);
        if (!API && win.top && win.top.opener) API = findAPI(win.top.opener);
        if (!API && win.top && win.top.opener && win.top.opener.document) API = findAPI(win.top.opener.document);
        return API;
    };
    // Only expose SCORM if API is found, and warn if a method is called without API
    const getCall = (lms, name) => {
        if (lms && typeof lms[name] === 'function') {
            return lms[name].bind(lms);
        }
        return function() {
            console.warn(`[SCORM] Method '${name}' called but SCORM API is not available.`);
        };
    };
    let api = null;
    const maxTries = 10;
    let tries = 0;
    const initAPI = () => {
        if (!api) return;
        const SCORM = {
            initialize: getCall(api, 'LMSInitialize'),
            getValue: getCall(api, 'LMSGetValue'),
            setValue: getCall(api, 'LMSSetValue'),
            commit: getCall(api, 'LMSCommit'),
            terminate: getCall(api, 'LMSFinish'),
            setLessonComplete(score) {
                this.setValue('cmi.core.score.raw', score === undefined ? 100 : score);
                this.setValue('cmi.core.lesson_status', 'completed');
                this.commit('');
            }
        };
        SCORM.initialize('');
        window.addEventListener('unload', () => {
            SCORM.terminate('');
        });
        window.SCORM = SCORM;
    };
    const tryGetAPI = () => {
        api = getAPI(window);
        if (api) {
            initAPI();
        } else if (++tries < maxTries) {
            setTimeout(tryGetAPI, 1000);
        } else {
            console.warn('[SCORM] SCORM API not found after maximum retries.');
        }
    };
    tryGetAPI();
})();