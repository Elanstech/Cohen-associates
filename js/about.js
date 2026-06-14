/* ============================================================================
   COHEN & ASSOCIATES — about.js  (About page · editorial behaviour)
   ----------------------------------------------------------------------------
   Loads AFTER main.js. Wrapped in an IIFE so its locals never collide with
   main.js's top-level consts (select, selectAll, rafThrottle, init, …).

   Shared behaviour (loader, header, mobile nav, reveal, counters, magnetic
   buttons, back-to-top, FAB, footer year) all run from main.js and are NOT
   duplicated here.

   Modules
     01. Utilities
     02. Reading progress bar   (.js-ab-progress → width)
     03. Headline reveal        ([data-hero] → .is-in, staggered after loader)
     04. Image clip-wipes       (.ed-frame[data-reveal-img] → .is-in)
     05. Bootstrap
============================================================================ */
(() => {
    'use strict';

    /* ========================================================================
       01. UTILITIES
    ======================================================================== */
    const select = (sel, ctx = document) => ctx.querySelector(sel);
    const selectAll = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const HAS_IO = 'IntersectionObserver' in window;

    const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

    /** Run a handler at most once per animation frame. */
    const rafThrottle = (fn) => {
        let ticking = false;
        return (...args) => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                fn(...args);
                ticking = false;
            });
        };
    };


    /* ========================================================================
       02. READING PROGRESS BAR
       ----------------------------------------------------------------------
       Fills .js-ab-progress from 0 → 100% as the page scrolls.
    ======================================================================== */
    const initProgress = () => {
        const bar = select('.js-ab-progress');
        if (!bar) return;

        const update = () => {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - window.innerHeight;
            const p = scrollable > 0 ? window.scrollY / scrollable : 0;
            bar.style.width = `${(clamp(p, 0, 1) * 100).toFixed(2)}%`;
        };

        const throttled = rafThrottle(update);
        window.addEventListener('scroll', throttled, { passive: true });
        window.addEventListener('resize', throttled, { passive: true });
        update();
    };


    /* ========================================================================
       03. HEADLINE REVEAL
       ----------------------------------------------------------------------
       The hero headline is above the fold, so we play its staggered entrance
       once the page has settled (loader dismissed) rather than on first paint.
       A safety timeout guarantees it never stays hidden.
    ======================================================================== */
    const initHeadline = () => {
        const title = select('[data-hero]');
        if (!title) return;

        const reveal = () => title.classList.add('is-in');

        if (REDUCED_MOTION) { reveal(); return; }

        let fired = false;
        const go = () => {
            if (fired) return;
            fired = true;
            reveal();
        };

        if (document.readyState === 'complete') {
            setTimeout(go, 300);
        } else {
            window.addEventListener('load', () => setTimeout(go, 300), { once: true });
            setTimeout(go, 1600); // safety net — never leave the headline hidden
        }
    };


    /* ========================================================================
       04. IMAGE CLIP-WIPES
       ----------------------------------------------------------------------
       Each .ed-frame[data-reveal-img] wipes open (clip-path) as it enters view.
    ======================================================================== */
    const initImageReveals = () => {
        const frames = selectAll('.ed-frame[data-reveal-img]');
        if (!frames.length) return;

        if (REDUCED_MOTION || !HAS_IO) {
            frames.forEach((f) => f.classList.add('is-in'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

        frames.forEach((f) => observer.observe(f));
    };


    /* ========================================================================
       05. BOOTSTRAP
    ======================================================================== */
    const init = () => {
        initProgress();
        initHeadline();
        initImageReveals();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
