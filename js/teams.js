/* ============================================================================
   COHEN & ASSOCIATES — teams.js  (Team page · bio modal)
   ----------------------------------------------------------------------------
   Loads AFTER main.js. Wrapped in an IIFE so its locals never collide with
   main.js's globals. Shared behaviour (loader, header, mobile nav, reveal,
   counters, magnetic buttons, FAB, back-to-top, footer year) runs from main.js.

   Modules
     01. Utilities
     02. Bio data
     03. Bio modal  (open / populate / focus-trap / close)
     04. Bootstrap
============================================================================ */
(() => {
    'use strict';

    /* ========================================================================
       01. UTILITIES
    ======================================================================== */
    const select = (sel, ctx = document) => ctx.querySelector(sel);
    const selectAll = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


    /* ========================================================================
       02. BIO DATA
       ----------------------------------------------------------------------
       Keys match the data-bio="…" attribute on each "View full bio" button.
       `bio` is an array of paragraphs. linkedin "#" (or empty) hides the link.
    ======================================================================== */
    const teamBios = {
        oksana: {
            name: 'Oksana Inoyatova',
            role: 'Founder & CEO',
            image: 'oksanafront.jpeg',
            linkedin: 'https://www.linkedin.com/in/oksana-inoyatova-72680515',
            bio: [
                'As Founder and CEO, Oksana has built Cohen & Associates into a boutique firm known for sophisticated tax strategy paired with genuinely personal service. A graduate of CUNY Queens College, she began her career at top-tier firms — including Deloitte — sharpening her expertise in tax preparation for high-net-worth individuals and international clients.',
                'Today she specializes in tax return preparation and planning for high-net-worth individuals and businesses of every size — from sole proprietorships and partnerships to C and S corporations. Her focus is the optimization of tax structures, helping closely held businesses navigate challenges like double taxation and the balance between distributions and salaries to maximize savings at every level.',
                'She also brings in-depth knowledge of FATCA compliance, international tax matters, and the U.S. tax obligations of foreign corporations. Above all, Oksana is a trusted advisor who believes in educating her clients — investing the time to keep them informed of the tax-law changes that affect them, and meeting as often as needed to keep the right strategies in place.'
            ]
        },
        steve: {
            name: 'Steve Inoyatov',
            role: 'Co-Founder & CFO',
            image: 'websteve.jpeg',
            linkedin: 'https://www.linkedin.com/in/steve-inoyatov-ea-ab71a465',
            bio: [
                'Steve co-founded Cohen & Associates and has led its practice for well over a decade. An honors graduate of Queens College — where he earned dual degrees in Accounting and Economics, graduating Cum Laude with a 3.73 GPA — he holds the prestigious IRS Enrolled Agent designation, granting him unlimited rights to represent taxpayers before the IRS in all 50 states.',
                'His career spans both Big 4 and mid-sized public accounting firms, in roles ranging from audit and tax associate to tax supervisor and financial controller. That breadth gives him a rare command of accounting and auditing, tax-audit representation, advanced bookkeeping systems, and the domestic and foreign taxation of both individuals and companies.',
                'Steve specializes in serving dental and medical providers, real estate professionals, international and domestic public figures, and high-net-worth individuals — designing tailored tax structures that maximize savings at the federal, state, and local levels. He is also well versed in real estate transactions and holds a New York real estate salesperson license.',
                "Fluent in Farsi and Hebrew, Steve brings both technical depth and a personal touch to the firm's diverse, global client base. Together, he and Oksana lead a team dedicated to guiding clients toward financial success — whether across the city or across the world."
            ]
        },
        eddie: {
            name: 'Eddie Maks',
            role: 'Manager',
            image: 'eddy.jpeg',
            linkedin: '#',
            bio: [
                'Eddie is an experienced accounting professional with a strong background in assisting high-net-worth individuals and business owners. He specializes in helping clients navigate the complexities of tax planning and financial management.',
                'His expertise includes managing tax compliance, structuring real estate transactions, and implementing tax-saving strategies. He works closely with business owners — particularly real estate developers, investors, and property owners — to optimize their financial outcomes while ensuring adherence to tax regulations.',
                'Eddie is also a co-founder of a non-profit organization that assists families and children with special needs.'
            ]
        },
        mariniel: {
            name: 'Mariniel Berkonti',
            role: 'Senior Accountant',
            image: 'mari.jpeg',
            linkedin: '#',
            bio: [
                'Mariniel Berkonti brings extensive expertise to her role as Senior Accountant at Cohen & Associates. With a strong educational background in accounting and finance, Mariniel has developed a reputation for excellence in financial analysis and reporting.',
                'Throughout her career, Mariniel has demonstrated exceptional skill in handling complex accounting challenges and providing innovative solutions for clients. Her expertise spans various areas of accounting, including tax preparation, financial statement analysis, and business advisory services.',
                'As a Senior Accountant, Mariniel plays a key role in managing client relationships and ensuring the highest quality of service delivery. Her attention to detail and thorough understanding of accounting principles have made her an invaluable resource for both clients and team members.',
                "Mariniel's commitment to professional development and staying current with industry trends enables her to provide cutting-edge solutions and advice to clients. Her dedication to excellence and client satisfaction exemplifies the core values of Cohen & Associates."
            ]
        }
    };


    /* ========================================================================
       03. BIO MODAL
    ======================================================================== */
    const initBioModal = () => {
        const modal = select('.js-bio-modal');
        const triggers = selectAll('[data-bio]');
        if (!modal || !triggers.length) return;

        const dialog = select('.tm-modal__dialog', modal);
        const bodyEl = select('.tm-modal__body', modal);
        const img = select('.js-bio-img', modal);
        const roleEl = select('.js-bio-role', modal);
        const nameEl = select('.js-bio-name', modal);
        const bioEl = select('.js-bio-text', modal);
        const linkEl = select('.js-bio-link', modal);
        const closeEls = selectAll('[data-bio-close]', modal);

        const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const getFocusable = () =>
            selectAll(FOCUSABLE, dialog).filter((el) => el.offsetParent !== null);

        let lastFocused = null;

        const populate = (data) => {
            img.src = data.image;
            img.alt = data.name;
            roleEl.textContent = data.role;
            nameEl.textContent = data.name;

            bioEl.innerHTML = '';
            data.bio.forEach((paragraph) => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                bioEl.appendChild(p);
            });

            if (data.linkedin && data.linkedin !== '#') {
                linkEl.href = data.linkedin;
                linkEl.style.display = '';
            } else {
                linkEl.style.display = 'none';
            }
        };

        const open = (key, trigger) => {
            const data = teamBios[key];
            if (!data) return;

            lastFocused = trigger || document.activeElement;
            populate(data);

            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('is-locked');
            if (bodyEl) bodyEl.scrollTop = 0;

            requestAnimationFrame(() => {
                const closeBtn = select('.js-bio-close', modal);
                if (closeBtn) closeBtn.focus({ preventScroll: true });
            });
        };

        const close = () => {
            if (!modal.classList.contains('is-open')) return;

            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('is-locked');

            if (lastFocused) {
                try { lastFocused.focus({ preventScroll: true }); } catch (e) { /* noop */ }
                lastFocused = null;
            }
        };

        triggers.forEach((btn) =>
            btn.addEventListener('click', () => open(btn.dataset.bio, btn))
        );
        closeEls.forEach((el) => el.addEventListener('click', close));

        // Esc to close + focus trap while open
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('is-open')) return;

            if (e.key === 'Escape') {
                close();
                return;
            }

            if (e.key === 'Tab') {
                const focusable = getFocusable();
                if (!focusable.length) { e.preventDefault(); return; }

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    };


    /* ========================================================================
       04. BOOTSTRAP
    ======================================================================== */
    const init = () => {
        initBioModal();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
