// Contact Page Specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initFloatingLabels();
    initMapLoading();
});

// Initialize Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm(form)) {
            // Prepare email content
            const formData = new FormData(form);
            const mailtoLink = constructMailtoLink(formData);
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showSuccessMessage(form);
            
            // Reset form
            form.reset();
            resetFloatingLabels();
        }
    });
}

// Validate Form
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    // Remove existing error messages
    removeErrors();

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });

    return isValid;
}

// Construct mailto link
function constructMailtoLink(formData) {
    const email = 'info@cohen-associates.com';
    const subject = encodeURIComponent(formData.get('subject') || 'Contact Form Submission');
    
    const body = encodeURIComponent(
        `Name: ${formData.get('name')}\n` +
        `Email: ${formData.get('email')}\n` +
        `Phone: ${formData.get('phone') || 'Not provided'}\n` +
        `Subject: ${formData.get('subject')}\n\n` +
        `Message:\n${formData.get('message')}`
    );

    return `mailto:${email}?subject=${subject}&body=${body}`;
}

// Show/Hide Error Messages
function showError(field, message) {
    const formGroup = field.closest('.form-group');
    const error = document.createElement('div');
    error.classList.add('form-error');
    error.textContent = message;
    formGroup.appendChild(error);
}

function removeErrors() {
    document.querySelectorAll('.form-error').forEach(error => error.remove());
}

// Show Success Message
function showSuccessMessage(form) {
    const success = document.createElement('div');
    success.classList.add('form-success');
    success.textContent = 'Thank you for your message. We\'ll be in touch soon!';
    
    form.parentNode.insertBefore(success, form.nextSibling);
    
    setTimeout(() => {
        success.remove();
    }, 5000);
}

// Floating Labels
function initFloatingLabels() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (!input) return;
        
        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            group.classList.remove('focused');
            if (input.value.trim()) {
                group.classList.add('has-value');
            } else {
                group.classList.remove('has-value');
            }
        });
        
        // Set initial state
        if (input.value.trim()) {
            group.classList.add('has-value');
        }
    });
}

function resetFloatingLabels() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('focused', 'has-value');
    });
}

// Email Validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Map Loading
function initMapLoading() {
    const map = document.querySelector('.map-wrapper iframe');
    if (!map) return;

    map.addEventListener('load', () => {
        map.style.opacity = '1';
    });
}
