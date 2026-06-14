/* ============================================================================
   COHEN & ASSOCIATES — contact.js  (Contact page · behaviour)
   ----------------------------------------------------------------------------
   Loads AFTER main.js. Wrapped in an IIFE so its locals never collide with
   main.js's top-level consts (select, selectAll, …).

   main.js already handles the loader, header, mobile nav, [data-reveal],
   counters, magnetic buttons, back-to-top, FAB and footer year. Its
   initContactForm() targets `.js-contact-form` (the homepage form) only, so
   the namespaced form below (`.js-cp-form`) is handled solely here.

   Modules
     01. Utilities
     02. Contact form   (validate → mailto handoff, inline errors)
     03. Map lazy-load  (set iframe src from data-src on approach)
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
       02. CONTACT FORM
       ------------------------------------------------------------------
       Inline validation, then a mailto handoff (consistent with the rest
       of the site — no backend required). The optional service <select>
       is folded into the subject + body when chosen.
    ==================================================================== */
    const initForm = () => {
        const form = select('.js-cp-form');
        if (!form) return;

        const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        const isPhone = (v) => /^\+?[\d\s().-]{10,}$/.test(v);

        const setError = (field, message) => {
            field.classList.add('is-error');
            let note = field.querySelector('.cp-field__error');
            if (!note) {
                note = document.createElement('span');
                note.className = 'cp-field__error';
                field.appendChild(note);
            }
            note.textContent = message;
        };

        const clearError = (field) => {
            field.classList.remove('is-error');
            field.querySelector('.cp-field__error')?.remove();
        };

        const validate = (input) => {
            const field = input.closest('.cp-field');
            if (!field) return true;
            const value = input.value.trim();
            clearError(field);

            if (input.hasAttribute('required') && !value) {
                setError(field, 'This field is required.');
                return false;
            }
            if (input.type === 'email' && value && !isEmail(value)) {
                setError(field, 'Enter a valid email address.');
                return false;
            }
            if (input.type === 'tel' && value && !isPhone(value)) {
                setError(field, 'Enter a valid phone number.');
                return false;
            }
            return true;
        };

        const showNote = (type, text) => {
            form.querySelector('.cp-form__note')?.remove();
            const note = document.createElement('div');
            note.className = `cp-form__note ${type}`;
            note.textContent = text;
            form.prepend(note);
            setTimeout(() => note.remove(), 6000);
        };

        // Validate text-based fields (the select is optional, no rule).
        const inputs = selectAll('input, textarea', form);
        inputs.forEach((input) => {
            input.addEventListener('blur', () => validate(input));
            input.addEventListener('input', () => {
                if (input.closest('.cp-field')?.classList.contains('is-error')) validate(input);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const valid = inputs.map(validate).every(Boolean);
            if (!valid) {
                showNote('error', 'Please fix the highlighted fields.');
                select('.cp-field.is-error input, .cp-field.is-error textarea', form)?.focus();
                return;
            }

            const val = (sel) => (form.querySelector(sel)?.value || '').trim();
            const data = {
                Name: val('#cpName'),
                Email: val('#cpEmail'),
                Phone: val('#cpPhone'),
                Service: val('#cpService'),
                Message: val('#cpMessage'),
            };

            const subject = `Website enquiry from ${data.Name}` + (data.Service ? ` — ${data.Service}` : '');
            const body = Object.entries(data)
                .filter(([, value]) => value)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');

            const action = form.getAttribute('action') || 'mailto:info@cohen-associates.com';
            const to = action.replace('mailto:', '').split('?')[0];

            showNote('success', 'Opening your email app…');
            window.location.href =
                `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            form.reset();
        });
    };


    /* ====================================================================
       03. MAP LAZY-LOAD
       ------------------------------------------------------------------
       The embed is heavy, so the src is held in data-src and swapped in
       only as the map nears the viewport. Falls back to loading at once.
    ==================================================================== */
    const initMap = () => {
        const frame = select('.js-map');
        if (!frame || !frame.dataset.src) return;

        const load = () => { frame.src = frame.dataset.src; };

        if (!HAS_IO) { load(); return; }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                load();
                obs.disconnect();
            });
        }, { rootMargin: '200px 0px' });

        observer.observe(frame);
    };


    /* ====================================================================
       04. BOOTSTRAP
    ==================================================================== */
    const init = () => {
        initForm();
        initMap();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
