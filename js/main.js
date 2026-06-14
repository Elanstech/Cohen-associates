/* ============================================================================
   COHEN & ASSOCIATES — main.js  (Homepage · rebuild)
   ----------------------------------------------------------------------------
   ES6 behaviour modules, each guarded so missing elements never throw.
     01. Utilities
     02. Page loader
     03. Sticky header
     04. Mobile navigation
     05. Reveal on scroll
     06. Animated counters
     07. Magnetic buttons
     08. Video (play / pause on visibility)
     09. FAQ accordion
     10. Contact form (validate + mailto)
     11. Back to top
     12. Contact FAB
     13. Services 2026 (entrance reveal + 3D tilt + cursor spotlight)
     14. Footer year
     15. Bootstrap
============================================================================ */
'use strict';

/* ============================================================================
   01. UTILITIES
============================================================================ */
const select = (sel, ctx = document) => ctx.querySelector(sel);
const selectAll = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const HAS_IO = 'IntersectionObserver' in window;

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


/* ============================================================================
   02. PAGE LOADER
============================================================================ */
const initLoader = () => {
    const loader = select('.js-loader');
    if (!loader) return;

    const dismiss = () => loader.classList.add('is-done');

    if (document.readyState === 'complete') dismiss();
    else window.addEventListener('load', dismiss, { once: true });

    setTimeout(dismiss, 4000); // safety net
};


/* ============================================================================
   03. STICKY HEADER  → .is-scrolled / .is-hidden
============================================================================ */
const initHeader = () => {
    const header = select('.js-header');
    if (!header) return;

    let lastY = window.scrollY;

    const onScroll = () => {
        const y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 40);
        header.classList.toggle('is-hidden', y > lastY && y > 400);
        lastY = y;
    };

    window.addEventListener('scroll', rafThrottle(onScroll), { passive: true });
    onScroll();
};


/* ============================================================================
   04. MOBILE NAVIGATION  → .is-open + body.is-locked
============================================================================ */
const initMobileNav = () => {
    const toggle = select('.js-nav-toggle');
    const nav = select('.js-mobile-nav');
    const backdrop = select('.js-nav-backdrop');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
        toggle.classList.toggle('is-open', open);
        nav.classList.toggle('is-open', open);
        backdrop?.classList.toggle('is-open', open);
        document.body.classList.toggle('is-locked', open);
        toggle.setAttribute('aria-expanded', String(open));
        nav.setAttribute('aria-hidden', String(!open));
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    backdrop?.addEventListener('click', () => setOpen(false));
    selectAll('a', nav).forEach((link) => link.addEventListener('click', () => setOpen(false)));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', rafThrottle(() => {
        if (window.innerWidth > 992) setOpen(false);
    }), { passive: true });
};


/* ============================================================================
   05. REVEAL ON SCROLL  → .is-visible + --reveal-delay
============================================================================ */
const initReveal = () => {
    const items = selectAll('[data-reveal]');
    if (!items.length) return;

    if (REDUCED_MOTION || !HAS_IO) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.revealDelay) {
                el.style.setProperty('--reveal-delay', `${el.dataset.revealDelay}ms`);
            }
            el.classList.add('is-visible');
            obs.unobserve(el);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    items.forEach((el) => observer.observe(el));
};


/* ============================================================================
   06. ANIMATED COUNTERS  → [data-count] (+ data-suffix)
============================================================================ */
const initCounters = () => {
    const counters = selectAll('[data-count]');
    if (!counters.length) return;

    const run = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const suffix = el.dataset.suffix || '';

        if (REDUCED_MOTION) {
            el.textContent = target.toLocaleString() + suffix;
            return;
        }

        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            el.textContent = Math.round(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    if (!HAS_IO) {
        counters.forEach(run);
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            run(entry.target);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.6 });

    counters.forEach((el) => observer.observe(el));
};


/* ============================================================================
   07. MAGNETIC BUTTONS  (buttons only — preserves transforms elsewhere)
============================================================================ */
const initMagnetic = () => {
    if (!FINE_POINTER || REDUCED_MOTION) return;

    const STRENGTH = 0.3;
    selectAll('.btn.js-magnetic').forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * STRENGTH;
            const y = (e.clientY - rect.top - rect.height / 2) * STRENGTH;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
};


/* ============================================================================
   08. VIDEO  → mute toggle + play only while on screen (performance)
============================================================================ */
const initVideo = () => {
    // Sound on / off for the hero background video
    selectAll('.js-mute-toggle').forEach((btn) => {
        const video = document.getElementById(btn.dataset.target);
        if (!video) return;
        const icon = btn.querySelector('i');

        btn.addEventListener('click', () => {
            const nowMuted = !video.muted;
            video.muted = nowMuted;
            btn.setAttribute('aria-pressed', String(!nowMuted));

            if (icon) {
                icon.classList.toggle('fa-volume-xmark', nowMuted);
                icon.classList.toggle('fa-volume-high', !nowMuted);
            }
            if (!nowMuted) video.play?.().catch(() => {});
        });
    });

    // Decode/play videos only while they're on screen
    const videos = selectAll('video');
    if (!videos.length || !HAS_IO) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) target.play?.().catch(() => {});
            else target.pause?.();
        });
    }, { threshold: 0.2 });

    videos.forEach((v) => observer.observe(v));
};


/* ============================================================================
   09. FAQ ACCORDION  → single-open, .is-open + aria-expanded
============================================================================ */
const initFaq = () => {
    const faq = select('.js-faq');
    if (!faq) return;

    const items = selectAll('.faq__item', faq);

    items.forEach((item) => {
        const question = select('.faq__q', item);
        if (!question) return;

        question.addEventListener('click', () => {
            const willOpen = !item.classList.contains('is-open');

            items.forEach((other) => {
                other.classList.remove('is-open');
                select('.faq__q', other)?.setAttribute('aria-expanded', 'false');
            });

            if (willOpen) {
                item.classList.add('is-open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
};


/* ============================================================================
   10. CONTACT FORM  → inline validation + mailto handoff
============================================================================ */
const initContactForm = () => {
    const form = select('.js-contact-form');
    if (!form) return;

    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const isPhone = (v) => /^\+?[\d\s().-]{10,}$/.test(v);

    const setError = (field, message) => {
        field.classList.add('error');
        let note = field.querySelector('.error-message');
        if (!note) {
            note = document.createElement('div');
            note.className = 'error-message';
            field.appendChild(note);
        }
        note.textContent = message;
    };

    const clearError = (field) => {
        field.classList.remove('error');
        field.querySelector('.error-message')?.remove();
    };

    const validate = (input) => {
        const field = input.closest('.field');
        if (!field) return true;
        const value = input.value.trim();
        clearError(field);

        if (input.hasAttribute('required') && !value) {
            setError(field, 'This field is required.');
            return false;
        }
        if (input.type === 'email' && value && !isEmail(value)) {
            setError(field, 'Please enter a valid email address.');
            return false;
        }
        if (input.type === 'tel' && value && !isPhone(value)) {
            setError(field, 'Please enter a valid phone number.');
            return false;
        }
        return true;
    };

    const showMessage = (type, text) => {
        form.querySelector('.form-message')?.remove();
        const msg = document.createElement('div');
        msg.className = `form-message ${type}`;
        msg.textContent = text;
        form.prepend(msg);
        setTimeout(() => msg.remove(), 6000);
    };

    const inputs = selectAll('input, textarea', form);
    inputs.forEach((input) => {
        input.addEventListener('blur', () => validate(input));
        input.addEventListener('input', () => {
            if (input.closest('.field')?.classList.contains('error')) validate(input);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const valid = inputs.map(validate).every(Boolean);
        if (!valid) return;

        const data = {
            Name: form.querySelector('#name')?.value || '',
            Email: form.querySelector('#email')?.value || '',
            Phone: form.querySelector('#phone')?.value || '',
            Message: form.querySelector('#message')?.value || '',
        };

        const subject = `Website enquiry from ${data.Name}`;
        const body = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

        const action = form.getAttribute('action') || 'mailto:info@cohen-associates.com';
        const to = action.replace('mailto:', '').split('?')[0];

        showMessage('success', 'Opening your email client…');
        window.location.href =
            `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        form.reset();
    });
};


/* ============================================================================
   11. BACK TO TOP  → .is-visible past threshold
============================================================================ */
const initBackToTop = () => {
    const btn = select('.js-to-top');
    if (!btn) return;

    const toggle = () => btn.classList.toggle('is-visible', window.scrollY > 600);

    window.addEventListener('scroll', rafThrottle(toggle), { passive: true });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
    });
    toggle();
};


/* ============================================================================
   12. CONTACT FAB  → .is-open (toggle + outside-click + Escape)
============================================================================ */
const initFab = () => {
    const fab = select('.js-fab');
    const toggle = select('.js-fab-toggle');
    if (!fab || !toggle) return;

    const setOpen = (open) => {
        fab.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(!fab.classList.contains('is-open'));
    });

    document.addEventListener('click', (e) => {
        if (fab.classList.contains('is-open') && !fab.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });
    selectAll('.fab__action', fab).forEach((action) =>
        action.addEventListener('click', () => setOpen(false))
    );
};


/* ============================================================================
   13. SERVICES 2026  → entrance reveal + 3D tilt + cursor spotlight
   ----------------------------------------------------------------------------
   • Cards (.svc-card / [data-svc]) get a staggered .is-in entrance.
   • On fine pointers, each card tilts toward the cursor and a copper
     spotlight follows it (--rx / --ry / --mx / --my consumed by the CSS).
   • Broken images are hidden so the navy gradient fallback shows.
   Note: the section header still uses the shared [data-reveal] (module 05).
============================================================================ */
const initServices = () => {
    const section = select('.services-2026');
    if (!section) return;

    const cards = selectAll('[data-svc]', section);
    if (!cards.length) return;

    // Graceful image fallback (broken image → navy gradient shows through)
    selectAll('.svc-card__img', section).forEach((img) => {
        img.addEventListener('error', () => { img.style.opacity = '0'; });
    });

    // Staggered entrance reveal
    if (HAS_IO && !REDUCED_MOTION) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.style.setProperty('--d', `${cards.indexOf(el) * 90}ms`);
                el.classList.add('is-in');
                obs.unobserve(el);
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

        cards.forEach((el) => observer.observe(el));
    } else {
        cards.forEach((el) => el.classList.add('is-in'));
    }

    // 3D tilt + spotlight (desktop pointers only)
    if (!FINE_POINTER || REDUCED_MOTION) return;

    const TILT = 5; // max degrees

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
                card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
                card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
            });
        });

        card.addEventListener('mouseleave', () => {
            if (frame) cancelAnimationFrame(frame);
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        });
    });
};


/* ============================================================================
   14. FOOTER YEAR
============================================================================ */
const initYear = () => {
    selectAll('.js-year').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });
};


/* ============================================================================
   15. BOOTSTRAP
============================================================================ */
const init = () => {
    initLoader();
    initHeader();
    initMobileNav();
    initReveal();
    initCounters();
    initMagnetic();
    initVideo();
    initFaq();
    initContactForm();
    initBackToTop();
    initFab();
    initServices();
    initYear();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
