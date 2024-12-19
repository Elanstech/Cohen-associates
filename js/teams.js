// Team member bios data
const teamBios = {
    oksana: {
        name: "Oksana Inoyatova",
        role: "Founder & CEO",
        image: "oksanafront.jpeg",
        bio: `Oksana graduated with honors from Queens College, City University of New York, in 2005, earning dual degrees in Accounting and Economics. She gained extensive experience working for top-tier firms like Deloitte, where she developed expertise in tax preparation for high-net-worth individuals and international clients. Oksana is a trusted advisor for clients navigating complex financial landscapes, with in-depth knowledge of FATCA compliance and international tax matters.`,
        linkedin: "https://www.linkedin.com/in/oksana-inoyatova-72680515"
    },
    steve: {
        name: "Steve Inoyatov",
        role: "Co-Founder & CFO",
        image: "websteve.jpeg",
        bio: `Steve, an honors graduate from Queens College, earned his dual degrees in Accounting and Economics. With experience at both Big 4 and small to mid-sized public accounting firms, Steve specializes in serving dental and medical providers, international and domestic celebrities, real estate professionals, and high-net-worth individuals. He focuses on providing tailored tax structures to maximize savings at the federal, state, and local levels. Steve holds the prestigious IRS Enrolled Agent status, granting him unlimited rights to represent taxpayers before the IRS in all 50 states. Together, Oksana and Steve lead a firm dedicated to guiding clients toward financial success, whether locally or globally.`,
        linkedin: "https://www.linkedin.com/in/steve-inoyatov-ea-ab71a465"
    },
    eddie: {
        name: "Eddie Maks",
        role: "Manager",
        image: "eddy.jpeg",
        bio: `Eddie is an experienced accounting professional with a strong background in assisting high net worth individuals and business owners. He specializes in helping clients navigate the complexities of tax planning and financial management. His expertise includes managing tax compliance, structuring real estate transactions, and implementing tax-saving strategies. He works closely with business owners, particularly real estate developers, investors, and property owners to optimize their financial outcomes while ensuring adherence to tax regulations. Eddie is also a co-founder of non-profit organization that assists families and children with special needs.`,
        linkedin: "#"
    },
    yulia: {
        name: "Yulia Konopka",
        role: "Executive Assistant",
        image: "yulia.jpeg",
        bio: `Yulia Konopka serves as the Executive Assistant at Cohen & Associates, where she plays a crucial role in ensuring seamless operations and exceptional client support. With her background in business administration and extensive experience in office management, Yulia has become an indispensable part of the firm's day-to-day operations.

        In her role, Yulia manages complex administrative tasks, coordinates team schedules, and serves as the primary point of contact for client communications. Her exceptional organizational skills and attention to detail ensure that all office operations run smoothly and efficiently.

        Yulia's commitment to professional excellence is evident in her proactive approach to problem-solving and her dedication to maintaining the highest standards of client service. She has implemented several innovative systems to improve office efficiency and enhance the client experience.

        Beyond her administrative duties, Yulia contributes significantly to team building and maintaining a positive work environment at Cohen & Associates. Her multilingual capabilities and cultural awareness have been particularly valuable in serving the firm's diverse international client base.`,
        linkedin: "#"
    },
    marianell: {
        name: "Mariniel Berkonti",
        role: "Senior Accountant",
        image: "mari.jpeg",
        bio: `Marianell Phillipen brings extensive expertise to her role as Senior Accountant at Cohen & Associates. With a strong educational background in accounting and finance, Marianell has developed a reputation for excellence in financial analysis and reporting.

        Throughout her career, Marianell has demonstrated exceptional skill in handling complex accounting challenges and providing innovative solutions for clients. Her expertise spans various areas of accounting, including tax preparation, financial statement analysis, and business advisory services.

        As a Senior Accountant, Marianell plays a key role in managing client relationships and ensuring the highest quality of service delivery. Her attention to detail and thorough understanding of accounting principles have made her an invaluable resource for both clients and team members.

        Marianell's commitment to professional development and staying current with industry trends enables her to provide cutting-edge solutions and advice to clients. Her dedication to excellence and client satisfaction exemplifies the core values of Cohen & Associates.`,
        linkedin: "#"
    }
};

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initCounters();
    initTeamCards();
});

// Initialize Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.add('page-loaded');
        }, 500);
    });
}

// Initialize AOS
function initAOS() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    let isMenuOpen = false;
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', toggleMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                toggleMenu();
            }
        });
        
        // Close menu when pressing escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMenu();
            }
        });
    }
    
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScroll = currentScroll;
    });
}

// Initialize Stats Counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const step = (target / duration) * 16; // 60 FPS
    
    function update() {
        current += step;
        if (current < target) {
            element.textContent = Math.round(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// Team Cards Interaction
function initTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const readMoreBtn = card.querySelector('.read-more-btn');
                if (readMoreBtn) {
                    readMoreBtn.click();
                }
            }
        });
    });
}

// Bio Modal Functions
function openBioModal(memberId) {
    const member = teamBios[memberId];
    const modal = document.querySelector('.bio-modal');
    const bioContent = modal.querySelector('.bio-content');
    
    // Format bio text with paragraphs
    const formattedBio = member.bio.split('\n\n')
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph.length > 0)
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
    
    // Insert bio content
    bioContent.innerHTML = `
        <div class="bio-header">
            <div class="bio-image">
                <img src="${member.image}" alt="${member.name}" />
            </div>
            <div class="bio-info">
                <h3>${member.name}</h3>
                <span class="member-role">${member.role}</span>
            </div>
        </div>
        <div class="bio-text">
            ${formattedBio}
        </div>
        ${member.linkedin !== "#" ? `
            <div class="bio-social">
                <a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" 
                   class="linkedin-link">
                    <i class="fab fa-linkedin"></i> View LinkedIn Profile
                </a>
            </div>
        ` : ''}
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const closeBtn = modal.querySelector('.close-modal');
    setTimeout(() => closeBtn.focus(), 100);

    // Add event listeners for modal
    closeBtn.addEventListener('click', closeBioModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeBioModal();
    });
    document.addEventListener('keydown', handleModalKeyboard);
}

function closeBioModal() {
    const modal = document.querySelector('.bio-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove modal event listeners
    document.removeEventListener('keydown', handleModalKeyboard);
}

function handleModalKeyboard(e) {
    if (e.key === 'Escape') {
        closeBioModal();
    }
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 992) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}, 250));

// Utility function: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
