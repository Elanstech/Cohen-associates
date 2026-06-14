/* ============================================================================
   COHEN & ASSOCIATES — services.js  (Services page · redesigned)
   ----------------------------------------------------------------------------
   The redesigned Services page relies on main.js for all motion ([data-reveal]
   fades, [data-count] counters, FAQ accordion, magnetic buttons, FAB,
   back-to-top). There are no page-specific visual effects to drive here, so
   this file is intentionally minimal.

   Wrapped in an IIFE so its locals never collide with main.js's globals.

   Modules
     01. Utilities
     02. Accessible in-page anchors  (move focus to the linked section)
     03. Bootstrap
============================================================================ */
(() => {
    'use strict';

    /* ========================================================================
       01. UTILITIES
    ======================================================================== */
    const selectAll = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


    /* ========================================================================
       02. ACCESSIBLE IN-PAGE ANCHORS
       ----------------------------------------------------------------------
       CSS already handles the smooth scroll and header offset (scroll-behavior
       + scroll-padding-top in style.css). The one thing CSS can't do is move
       keyboard focus — so a keyboard or screen-reader user who activates
       "Explore Services" or an overview row stays at the top of the document.
       Here we send focus to the target section without triggering a second
       scroll (preventScroll), making the jump work for everyone.
    ======================================================================== */
    const initAnchorFocus = () => {
        const links = selectAll('a[href^="#"]');
        if (!links.length) return;

        links.forEach((link) => {
            link.addEventListener('click', () => {
                const id = link.getAttribute('href').slice(1);
                if (!id) return; // ignore bare "#"

                const target = document.getElementById(id);
                if (!target) return;

                // Make non-interactive targets (e.g. <article>, <section>)
                // focusable just for this interaction, then clean up.
                if (!target.hasAttribute('tabindex')) {
                    target.setAttribute('tabindex', '-1');
                    target.addEventListener(
                        'blur',
                        () => target.removeAttribute('tabindex'),
                        { once: true }
                    );
                }

                // Defer so focus lands after the browser starts the scroll;
                // preventScroll keeps CSS in charge of the motion.
                requestAnimationFrame(() => {
                    try {
                        target.focus({ preventScroll: true });
                    } catch (e) {
                        target.focus();
                    }
                });
            });
        });
    };


    /* ========================================================================
       03. BOOTSTRAP
    ======================================================================== */
    const init = () => {
        initAnchorFocus();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
