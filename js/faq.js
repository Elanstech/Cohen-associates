/* ============================================================================
   COHEN & ASSOCIATES — faq.js  (FAQ page · help-center behaviour)
   ----------------------------------------------------------------------------
   Loads AFTER main.js. Wrapped in an IIFE so its locals never collide with
   main.js's top-level consts. main.js's initFaq() targets `.js-faq` (the
   homepage teaser) only, so the list below (`.js-fx`) is handled solely here.

   Modules
     01. Utilities
     02. FAQ experience  (accordion + topic tabs + live search + empty state)
     03. Bootstrap
============================================================================ */
(() => {
    'use strict';

    /* ====================================================================
       01. UTILITIES
    ==================================================================== */
    const select = (sel, ctx = document) => ctx.querySelector(sel);
    const selectAll = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


    /* ====================================================================
       02. FAQ EXPERIENCE
    ==================================================================== */
    const initFaq = () => {
        const list = select('.js-fx');
        if (!list) return;

        const items = selectAll('.fx-item', list);
        const tabs = selectAll('.js-fx-tabs .fx-tab');
        const input = select('#fxSearch');
        const clearBtn = select('.js-fx-clear');
        const empty = select('.js-fx-empty');
        const term = select('.js-fx-term');

        let activeCat = 'all';

        // --- Accordion: each item opens/closes independently ---
        items.forEach((item) => {
            const q = select('.fx-q', item);
            q?.addEventListener('click', () => {
                const open = item.classList.toggle('is-open');
                q.setAttribute('aria-expanded', String(open));
            });
        });

        const setActiveTab = (filter) => {
            activeCat = filter;
            tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.filter === filter));
        };

        // --- Combined filter: active topic + search text ---
        const apply = () => {
            const query = (input?.value || '').trim().toLowerCase();
            let shown = 0;

            items.forEach((item) => {
                const catOk = activeCat === 'all' || item.dataset.category === activeCat;
                const textOk = !query || item.textContent.toLowerCase().includes(query);
                const show = catOk && textOk;

                item.hidden = !show;
                if (show) {
                    shown += 1;
                } else if (item.classList.contains('is-open')) {
                    // Collapse anything that gets filtered out while open
                    item.classList.remove('is-open');
                    select('.fx-q', item)?.setAttribute('aria-expanded', 'false');
                }
            });

            if (empty) empty.hidden = shown !== 0;
            if (term) term.textContent = (input?.value || '').trim();
        };

        // --- Topic tabs ---
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                setActiveTab(tab.dataset.filter);
                apply();
            });
        });

        // --- Live search (searching spans all topics) ---
        if (input) {
            input.addEventListener('input', () => {
                const hasText = input.value.trim() !== '';
                clearBtn?.classList.toggle('is-visible', hasText);
                if (hasText) setActiveTab('all');
                apply();
            });
        }
        clearBtn?.addEventListener('click', () => {
            if (!input) return;
            input.value = '';
            clearBtn.classList.remove('is-visible');
            apply();
            input.focus();
        });

        apply();
    };


    /* ====================================================================
       03. BOOTSTRAP
    ==================================================================== */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFaq);
    } else {
        initFaq();
    }
})();
