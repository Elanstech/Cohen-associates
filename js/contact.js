// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeAll();
});

function initializeAll() {
    setupFlatpickr();
    setupContactForm();
    setupBookingForm();
    setupMobileMenu();
    setupHeaderScroll();
    initializeAOS();
    setupFormValidation();
}

// AOS Animation Setup
function initializeAOS() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
}

// Mobile Menu Setup
function setupMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu a');

    if (menuButton && mobileMenu) {
        // Toggle menu
        menuButton.addEventListener('click', () => {
            menuButton.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu on link click
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuButton.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                menuButton.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
}

// Header Scroll Effect
function setupHeaderScroll() {
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

        // Add/remove hidden class
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });
}

// Flatpickr Date Picker Setup
function setupFlatpickr() {
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        flatpickr(dateInput, {
            enableTime: true,
            dateFormat: "F j, Y at h:i K",
            minDate: "today",
            maxDate: new Date().fp_incr(30),
            minTime: "09:00",
            maxTime: "17:00",
            disable: [
                function(date) {
                    return (date.getDay() === 0 || date.getDay() === 6);
                }
            ],
            locale: {
                firstDayOfWeek: 1
            },
            onChange: (selectedDates, dateStr) => {
                validateField(dateInput);
            }
        });
    }
}

// Contact Form Setup
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                await handleContactSubmission(form);
            }
        });
    }
}

// Booking Form Setup
function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                await handleBookingSubmission(form);
            }
        });
    }
}

// Form Validation Setup
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.closest('.form-group').classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    });
}

// Contact Form Submission Handler
async function handleContactSubmission(form) {
    const submitButton = form.querySelector('[type="submit"]');
    toggleLoadingState(submitButton, true);

    try {
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            phone: form.querySelector('#phone').value,
            message: form.querySelector('#message').value
        };

        // Create mailto link
        const mailtoLink = createMailtoLink(formData, 'Contact Form Submission');
        window.location.href = mailtoLink;

        showMessage(form, 'success', 'Message sent successfully! We\'ll get back to you soon.');
        form.reset();
    } catch (error) {
        showMessage(form, 'error', 'Failed to send message. Please try again.');
        console.error('Contact form error:', error);
    } finally {
        toggleLoadingState(submitButton, false);
    }
}

// Booking Form Submission Handler
async function handleBookingSubmission(form) {
    const submitButton = form.querySelector('[type="submit"]');
    toggleLoadingState(submitButton, true);

    try {
        const formData = {
            name: form.querySelector('#bookingName').value,
            email: form.querySelector('#bookingEmail').value,
            phone: form.querySelector('#bookingPhone').value,
            service: form.querySelector('#serviceType').value,
            date: form.querySelector('#bookingDate').value,
            notes: form.querySelector('#bookingNotes').value
        };

        // Create mailto link
        const mailtoLink = createMailtoLink(formData, 'Booking Request');
        window.location.href = mailtoLink;

        showMessage(form, 'success', 'Booking request sent! We\'ll confirm your appointment soon.');
        form.reset();
    } catch (error) {
        showMessage(form, 'error', 'Failed to submit booking. Please try again.');
        console.error('Booking form error:', error);
    } finally {
        toggleLoadingState(submitButton, false);
    }
}

// Form Validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// Field Validation
function validateField(field) {
    const formGroup = field.closest('.form-group');
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear existing errors
    clearFieldError(formGroup);

    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        // Type-specific validation
        switch (field.type) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'tel':
                if (value && !isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
        }
    }

    if (!isValid) {
        showFieldError(formGroup, errorMessage);
    }

    return isValid;
}

// Utility Functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\+?[\d\s-]{10,}$/.test(phone);
}

function showFieldError(formGroup, message) {
    formGroup.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

function clearFieldError(formGroup) {
    formGroup.classList.remove('error');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showMessage(form, type, message) {
    // Remove existing messages
    const existingMessages = form.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>${message}`;
    form.insertBefore(messageDiv, form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => messageDiv.remove(), 5000);
}

function toggleLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.setAttribute('data-original-text', button.innerHTML);
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text');
    }
}

function createMailtoLink(data, subject) {
    const body = Object.entries(data)
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
        .join('\n');

    return `mailto:info@cohen-associates.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Responsive handler
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 992) {
        document.querySelector('.mobile-menu')?.classList.remove('active');
        document.querySelector('.mobile-menu-btn')?.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}, 250));

// Utility: Debounce function
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
