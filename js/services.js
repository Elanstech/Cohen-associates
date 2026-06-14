/* ============================================================================
   COHEN & ASSOCIATES — services.js  (Services page · page-specific)
   ----------------------------------------------------------------------------
   Loads AFTER main.js. Wrapped in an IIFE so its locals never collide with
   main.js's top-level consts (select, selectAll, rafThrottle, init, …).

   Shared behaviour (loader, header, mobile nav, reveal, counters, magnetic
   buttons, FAQ accordion, back-to-top, FAB, footer year) all run from main.js
   and are NOT duplicated here.

   Modules
     01. Utilities
     02. Scroll-spy rail        (.svcnav → .is-visible / dots → .is-active)
     03. Image parallax         (.svcblock__img → translateY, gap-free)
     04. Timeline progress fill ([data-flow] → --flow: 0–100%)
     05. Card tilt              (.svcplan__card → --rx / --ry)
     06. Bootstrap
============================================================================ */
(() => {
    'use strict';

    /* ========================================================================
       01. UTILITIES
    ======================================================================== */
    const select = (sel, ctx = document) => ctx.querySelector(sel);
    const selectAll = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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
       02. SCROLL-SPY RAIL
       ----------------------------------------------------------------------
       • Reveals the fixed rail (.is-visible) while the services region
         (.svcwrap) occupies the central band of the viewport.
       • Marks the dot whose section has most recently crossed the ~42% line.
    ======================================================================== */
    const initScrollSpy = () => {
        const rail = select('.js-svcnav');
        if (!rail) return;

        const dots = selectAll('.svcnav__dot', rail);
        if (!dots.length) return;

        const wrap = select('.svcwrap');
        const sections = dots
            .map((dot) => document.getElementById(dot.dataset.spy))
            .filter(Boolean);
        if (!sections.length) return;

        const onScroll = () => {
            const vh = window.innerHeight;

            // Visibility — show while the services region is centre-stage
            if (wrap) {
                const r = wrap.getBoundingClientRect();
                const visible = r.top < vh * 0.6 && r.bottom > vh * 0.4;
                rail.classList.toggle('is-visible', visible);
            } else {
                rail.classList.add('is-visible');
            }

            // Active section — the last one whose top has passed the 42% line
            const line = vh * 0.42;
            let activeId = sections[0].id;
            sections.forEach((sec) => {
                if (sec.getBoundingClientRect().top - line <= 0) activeId = sec.id;
            });

            dots.forEach((dot) =>
                dot.classList.toggle('is-active', dot.dataset.spy === activeId)
            );
        };

        const throttled = rafThrottle(onScroll);
        window.addEventListener('scroll', throttled, { passive: true });
        window.addEventListener('resize', throttled, { passive: true });
        onScroll();
    };


    /* ========================================================================
       03. IMAGE PARALLAX
       ----------------------------------------------------------------------
       Each .svcblock__img is 120% of its frame height inside an overflow-hidden
       frame. We translate it within the safe range [0, -20% · frameH] as the
       frame transits the viewport, so it always fully covers the frame.
    ======================================================================== */
    const initParallax = () => {
        if (REDUCED_MOTION) return;

        const frames = selectAll('[data-parallax]');
        if (!frames.length) return;

        const pairs = frames
            .map((frame) => ({ frame, img: select('.svcblock__img', frame) }))
            .filter((p) => p.img);
        if (!pairs.length) return;

        const update = () => {
            const vh = window.innerHeight;

            pairs.forEach(({ frame, img }) => {
                const rect = frame.getBoundingClientRect();

                // Skip frames comfortably off-screen
                if (rect.bottom < -80 || rect.top > vh + 80) return;

                // p: 0 as the frame enters the bottom → 1 as it leaves the top
                const p = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
                const shift = -p * rect.height * 0.2; // 0 → -20% of frame height
                img.style.transform = `translateY(${shift.toFixed(1)}px)`;
            });
        };

        const throttled = rafThrottle(update);
        window.addEventListener('scroll', throttled, { passive: true });
        window.addEventListener('resize', throttled, { passive: true });
        update();
    };


    /* ========================================================================
       04. TIMELINE PROGRESS FILL
       ----------------------------------------------------------------------
       Sets --flow (0–100%) on the [data-flow] timeline. The copper fill
       (.svcflow__line-fill { height: var(--flow) }) tracks a reference line at
       50% of the viewport as it travels down the spine.
    ======================================================================== */
    const initTimeline = () => {
        const flow = select('[data-flow]');
        if (!flow) return;

        const update = () => {
            const rect = flow.getBoundingClientRect();
            const line = window.innerHeight * 0.5;
            const p = clamp((line - rect.top) / rect.height, 0, 1);
            flow.style.setProperty('--flow', `${(p * 100).toFixed(1)}%`);
        };

        const throttled = rafThrottle(update);
        window.addEventListener('scroll', throttled, { passive: true });
        window.addEventListener('resize', throttled, { passive: true });
        update();
    };


    /* ========================================================================
       05. CARD TILT  (desktop pointers only)
       ----------------------------------------------------------------------
       Sets --rx / --ry on each .svcplan__card so the CSS transform tilts it
       toward the cursor. Resets on leave.
    ======================================================================== */
    const initTilt = () => {
        if (!FINE_POINTER || REDUCED_MOTION) return;

        const cards = selectAll('.svcplan__card[data-tilt]');
        if (!cards.length) return;

        const TILT = 6; // max degrees

        cards.forEach((card) => {
            let frame = null;

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;   // 0 → 1
                const py = (e.clientY - rect.top) / rect.height;   // 0 → 1

                if (frame) cancelAnimationFrame(frame);
                frame = requestAnimationFrame(() => {
                    card.style.setProperty('--rx', `${((0.5 - py) * TILT).toFixed(2)}deg`);
                    card.style.setProperty('--ry', `${((px - 0.5) * TILT).toFixed(2)}deg`);
                });
            });

            card.addEventListener('mouseleave', () => {
                if (frame) cancelAnimationFrame(frame);
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
            });
        });
    };


    /* ========================================================================
       06. BOOTSTRAP
    ======================================================================== */
    const init = () => {
        initScrollSpy();
        initParallax();
        initTimeline();
        initTilt();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
