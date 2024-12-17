// Team member bios data
const teamBios = {
    oksana: {
        name: "Oksana Inoyatova",
        role: "Founder & CEO",
        image: "oksanafront.jpeg",
        bio: `Oksana Inoyatova is the visionary founder and CEO of Cohen & Associates, bringing over two decades of expertise in financial services and taxation. 
        After earning her Master of Business Administration with a focus in Finance from New York University and her Bachelor's in Accounting from Queens College, CUNY, 
        Oksana established herself as a leading voice in international taxation and business consulting.

        As a Certified Public Accountant, Oksana founded Cohen & Associates in 2004 with a vision to provide comprehensive financial solutions tailored to each client's unique needs. 
        Her extensive background includes serving as a financial advisor for Fortune 500 companies, where she developed deep expertise in international tax planning and business strategy.

        Under her leadership, Cohen & Associates has grown from a small practice to serving over 1000 clients, specializing in complex tax structures and international business operations. 
        Oksana has been recognized as one of the Top 40 Under 40 by CPA Practice Advisor and is a frequent speaker at international tax conferences. Her commitment to excellence 
        and client service has established Cohen & Associates as a trusted name in financial services.

        Oksana maintains active memberships in the American Institute of CPAs (AICPA) and the New York State Society of CPAs (NYSSCPA), reflecting her dedication to maintaining 
        the highest professional standards in the industry.`,
        linkedin: "https://www.linkedin.com/in/oksana-inoyatova-72680515"
    },
    steve: {
        name: "Steve Inoyatov",
        role: "Co-Founder & CFO",
        image: "websteve.jpeg",
        bio: `Steve Inoyatov serves as the Co-Founder and Chief Financial Officer of Cohen & Associates, bringing a wealth of experience in international finance 
        and strategic planning. With a Master's in Taxation from New York University and a Bachelor's in Finance from Baruch College, Steve has established himself 
        as an integral part of the firm's leadership team.

        Throughout his career spanning over 15 years, Steve has specialized in developing innovative financial strategies and optimizing tax structures for both 
        domestic and international clients. His expertise in cross-border taxation and financial planning has been instrumental in expanding Cohen & Associates' 
        international presence.

        As CFO, Steve oversees the firm's financial operations while maintaining a hands-on approach with key clients. His deep understanding of both US and 
        international tax laws has helped numerous clients navigate complex financial landscapes successfully. Steve's commitment to continuous learning and 
        professional development ensures that Cohen & Associates stays at the forefront of evolving financial regulations and best practices.

        Beyond his role at Cohen & Associates, Steve is actively involved in professional development initiatives and regularly contributes to industry 
        publications on topics related to international taxation and financial strategy.`,
        linkedin: "https://www.linkedin.com/in/steve-inoyatov-ea-ab71a465"
    },
    eddie: {
        name: "Eddie Maks",
        role: "Manager",
        image: "eddy.jpeg",
        bio: `Eddie Maks brings a dynamic approach to his role as Manager at Cohen & Associates, where he leads operational excellence and team performance. 
        With a strong background in accounting and financial management, Eddie has been instrumental in streamlining processes and enhancing client service delivery.

        After completing his education in Business Administration with a focus on Accounting, Eddie joined Cohen & Associates where he quickly demonstrated his 
        ability to manage complex projects and lead teams effectively. His expertise spans various areas of accounting and tax preparation, with particular 
        strength in developing efficient workflows and maintaining high standards of accuracy.

        Eddie's client-focused approach and deep understanding of tax regulations have made him a valuable asset to the firm. He works closely with both individual 
        and business clients, providing comprehensive tax planning and compliance services. His attention to detail and commitment to excellence ensure that clients 
        receive the highest level of service.

        In his role as Manager, Eddie continues to develop and implement innovative solutions to meet clients' evolving needs while mentoring junior team members 
        and maintaining the firm's high standards of service delivery.`,
        linkedin: "#"
    },
    yulia: {
        name: "Yulia Konopka",
        role: "Executive Assistant",
        image: "yulia.jpeg",
        bio: `Yulia Konopka serves as the Executive Assistant at Cohen & Associates, where she plays a crucial role in ensuring seamless operations and 
        exceptional client support. With her background in business administration and extensive experience in office management, Yulia has become an 
        indispensable part of the firm's day-to-day operations.

        In her role, Yulia manages complex administrative tasks, coordinates team schedules, and serves as the primary point of contact for client 
        communications. Her exceptional organizational skills and attention to detail ensure that all office operations run smoothly and efficiently.

        Yulia's commitment to professional excellence is evident in her proactive approach to problem-solving and her dedication to maintaining the 
        highest standards of client service. She has implemented several innovative systems to improve office efficiency and enhance the client experience.

        Beyond her administrative duties, Yulia contributes significantly to team building and maintaining a positive work environment at Cohen & Associates. 
        Her multilingual capabilities and cultural awareness have been particularly valuable in serving the firm's diverse international client base.`,
        linkedin: "#"
    },
    marianell: {
        name: "Marianell Phillipen",
        role: "Senior Accountant",
        image: "mari.jpeg",
        bio: `Marianell Phillipen brings extensive expertise to her role as Senior Accountant at Cohen & Associates. With a strong educational background 
        in accounting and finance, Marianell has developed a reputation for excellence in financial analysis and reporting.

        Throughout her career, Marianell has demonstrated exceptional skill in handling complex accounting challenges and providing innovative solutions 
        for clients. Her expertise spans various areas of accounting, including tax preparation, financial statement analysis, and business advisory services.

        As a Senior Accountant, Marianell plays a key role in managing client relationships and ensuring the highest quality of service delivery. Her 
        attention to detail and thorough understanding of accounting principles have made her an invaluable resource for both clients and team members.

        Marianell's commitment to professional development and staying current with industry trends enables her to provide cutting-edge solutions and 
        advice to clients. Her dedication to excellence and client satisfaction exemplifies the core values of Cohen & Associates.`,
        linkedin: "#"
    }
};

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initMobileMenu();
    initStickyHeader();
    initTeamCards();
    initParallaxEffects();
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

// Team Cards Interaction
function initTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        // Add hover effect
        const image = card.querySelector('.member-image img');
        const overlay = card.querySelector('.image-overlay');
        const readMoreBtn = card.querySelector('.read-more-btn');
        
        card.addEventListener('mouseenter', () => {
            if (image) image.style.transform = 'scale(1.1)';
            if (overlay) overlay.style.opacity = '1';
            if (readMoreBtn) {
                readMoreBtn.style.opacity = '1';
                readMoreBtn.style.transform = 'translateY(0)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) image.style.transform = 'scale(1)';
            if (overlay) overlay.style.opacity = '0';
            if (readMoreBtn) {
                readMoreBtn.style.opacity = '0';
                readMoreBtn.style.transform = 'translateY(20px)';
            }
        });
        
        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const memberId = card.getAttribute('data-member-id');
                if (memberId) openBioModal(memberId);
            }
        });
    });
}

// Bio Modal Functions
function openBioModal(memberId) {
    const member = teamBios[memberId];
    const modal = document.querySelector('.bio-modal');
    const bioContent = modal.querySelector('.bio-content');
    
    // Insert bio content
    bioContent.innerHTML = `
        <div class="bio-header">
            <div class="bio-image">
                <img src="${member.image}" alt="${member.name}">
            </div>
            <div class="bio-info">
                <h3>${member.name}</h3>
                <span class="member-role">${member.role}</span>
            </div>
        </div>
        <div class="bio-text">
            ${member.bio.split('\n').map(paragraph => 
                `<p>${paragraph.trim()}</p>`
            ).join('')}
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
    closeBtn.focus();
}

function closeBioModal() {
    const modal = document.querySelector('.bio-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Handle escape key for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBioModal();
    }
});

// Parallax Effects
function initParallaxEffects() {
    const circles = document.querySelectorAll('.circle');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        circles.forEach((circle, index) => {
            const speed = 0.02 + (index * 0.01);
            const x = (mouseX - window.innerWidth / 2) * speed;
            const y = (mouseY - window.innerHeight / 2) * speed;
            
            circle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
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
