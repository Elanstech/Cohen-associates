/* ============================================================================
   COHEN & ASSOCIATES — faq.js  (FAQ page · behaviour)
   ----------------------------------------------------------------------------
   Loads AFTER main.js. Wrapped in an IIFE so its locals never collide with
   main.js's top-level consts (select, selectAll, …).

   main.js already handles the loader, header, mobile nav, [data-reveal],
   counters, magnetic buttons, back-to-top, FAB and footer year — none of that
   is duplicated here. main.js's initFaq() targets `.js-faq` only, which this
   page doesn't use, so the accordion below is the sole handler for .faq__item.

   Modules
     01. Utilities
     02. Accordion        (independent open/close per question)
     03. Category chips   (scroll-spy → .is-active)
     04. Bootstrap
============================================================================ */
(() => {
    'use strict';

    /* ====================================================================
       01. UTILITIES
    ==================================================================== */
    const select = (sel, ctx = document) => ctx.querySelector(sel);
    const selectAll = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const HAS_IO = 'IntersectionObserver' in window;


    /* ====================================================================
       02. ACCORDION
       ------------------------------------------------------------------
       Every .faq__item toggles independently — a help center reads best
       when answers can stay open side by side. The height reveal, icon
       rotation and accent bar are all pure CSS, driven by .is-open.
    ==================================================================== */
    const initAccordion = () => {
        const items = selectAll('.faq__item');
        if (!items.length) return;

        items.forEach((item) => {
            const question = select('.faq__q', item);
            if (!question) return;

            question.addEventListener('click', () => {
                const open = item.classList.toggle('is-open');
                question.setAttribute('aria-expanded', String(open));
            });
        });
    };


    /* ====================================================================
       03. CATEGORY CHIPS  (scroll-spy)
       ------------------------------------------------------------------
       Highlights the chip for whichever category is nearest the top of
       the viewport. Chips are plain anchor links, so smooth scrolling and
       the header offset are handled by CSS (scroll-behavior /
       scroll-padding-top in style.css).
    ==================================================================== */
    const initChips = () => {
        const chips = selectAll('.faqp-chip');
        if (!chips.length) return;

        // Map each category id → its chip (from the chip's href).
        const byId = new Map();
        chips.forEach((chip) => {
            const id = (chip.getAttribute('href') || '').replace('#', '');
            if (id) byId.set(id, chip);
        });

        const setActive = (id) => {
            chips.forEach((chip) => chip.classList.toggle('is-active', byId.get(id) === chip));
        };

        // Instant feedback on click; the observer reconciles after scrolling.
        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                const id = (chip.getAttribute('href') || '').replace('#', '');
                if (id) setActive(id);
            });
        });

        const sections = selectAll('.faqp-cat').filter((cat) => byId.has(cat.id));
        if (!sections.length || !HAS_IO) return;

        const visible = new Set();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) visible.add(entry.target.id);
                else visible.delete(entry.target.id);
            });

            // Topmost visible category (querySelectorAll keeps document order).
            const current = sections.find((cat) => visible.has(cat.id));
            if (current) setActive(current.id);
        }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });

        sections.forEach((cat) => observer.observe(cat));
    };


    /* ====================================================================
       04. BOOTSTRAP
    ==================================================================== */
    const init = () => {
        initAccordion();
        initChips();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
