/**
 * ZAHRATO - Newsletter & Contact Form Handler
 * 
 * Handles newsletter signup and contact form submissions with success popups
 */

document.addEventListener('DOMContentLoaded', function () {
    initNewsletterForm();
    initContactForm();
    createNewsletterModal();
    createContactModal();
});

/**
 * Initialize newsletter form submission
 */
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get email value
            const emailInput = this.querySelector('.newsletter-input');
            const email = emailInput ? emailInput.value : '';

            // Here you would normally send the email to your backend/email service
            // For now, we'll just show the success modal
            console.log('Newsletter signup:', email);

            // Show success modal
            showNewsletterSuccessModal();

            // Reset form
            this.reset();
        });
    });
}

/**
 * Create newsletter success modal
 */
function createNewsletterModal() {
    // Check if modal already exists
    if (document.getElementById('newsletterModal')) return;

    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="newsletterModal">
            <div class="modal-container newsletter-modal">
                <div class="modal-header">
                    <h2 class="modal-title">Success!</h2>
                </div>
                <div class="modal-content">
                    <div class="newsletter-success-content">
                        <svg class="newsletter-success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <p>Thank you for subscribing to our newsletter!</p>
                        <p class="newsletter-success-subtitle">You'll receive exclusive offers and updates.</p>
                    </div>
                    <button class="btn btn-primary newsletter-close-btn" id="newsletterModalClose">OK</button>
                </div>
            </div>
        </div>
    `;

    // Insert modal into body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add close handler
    const closeBtn = document.getElementById('newsletterModalClose');
    const modal = document.getElementById('newsletterModal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeNewsletterModal);
    }

    // Close on outside click
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeNewsletterModal();
            }
        });
    }

    // Close on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeNewsletterModal();
        }
    });
}

/**
 * Show newsletter success modal
 */
function showNewsletterSuccessModal() {
    const modal = document.getElementById('newsletterModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add animation class to icon
        const icon = modal.querySelector('.newsletter-success-icon');
        if (icon) {
            icon.style.animation = 'none';
            setTimeout(() => {
                icon.style.animation = 'successIconAnimation 0.6s ease forwards';
            }, 10);
        }
    }
}

/**
 * Close newsletter modal
 */
function closeNewsletterModal() {
    const modal = document.getElementById('newsletterModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Add newsletter modal styles dynamically
if (!document.getElementById('newsletter-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'newsletter-modal-styles';
    style.textContent = `
        /* Newsletter Modal Specific Styles */
        .newsletter-modal {
            max-width: 500px;
            text-align: center;
        }

        .newsletter-success-content {
            padding: 2rem 1rem;
            text-align: center;
        }

        .newsletter-success-icon {
            width: 80px;
            height: 80px;
            stroke: var(--color-gold);
            margin: 0 auto 1.5rem;
            display: block;
        }

        .newsletter-success-content p {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 0.75rem;
            color: var(--color-white);
        }

        .newsletter-success-subtitle {
            font-size: 0.875rem;
            color: var(--color-gray-light) !important;
            margin-bottom: 0 !important;
        }

        .newsletter-close-btn {
            width: 100%;
            margin-top: 1rem;
        }

        /* Success Icon Animation */
        @keyframes successIconAnimation {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }

        /* Mobile optimization */
        @media (max-width: 768px) {
            .newsletter-modal {
                max-width: 90%;
                margin: 0 1rem;
            }

            .newsletter-success-icon {
                width: 60px;
                height: 60px;
            }

            .newsletter-success-content {
                padding: 1.5rem 0.5rem;
            }

            .newsletter-success-content p {
                font-size: 0.9rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// CONTACT FORM HANDLER
// ============================================

/**
 * Initialize contact form submission
 */
function initContactForm() {
    const contactForms = document.querySelectorAll('.contact-form');

    contactForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const nameInput = this.querySelector('#contactName');
            const emailInput = this.querySelector('#contactEmail');
            const messageInput = this.querySelector('#contactMessage');

            const formData = {
                name: nameInput ? nameInput.value : '',
                email: emailInput ? emailInput.value : '',
                message: messageInput ? messageInput.value : ''
            };

            // Here you would normally send the data to your backend
            console.log('Contact form submission:', formData);

            // Show success modal
            showContactSuccessModal();

            // Reset form
            this.reset();

            // Close contact modal if it's open
            const contactModal = document.getElementById('contactModal');
            if (contactModal) {
                contactModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

/**
 * Create contact success modal
 */
function createContactModal() {
    // Check if modal already exists
    if (document.getElementById('contactSuccessModal')) return;

    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="contactSuccessModal">
            <div class="modal-container contact-success-modal">
                <div class="modal-header">
                    <h2 class="modal-title">Message Sent!</h2>
                </div>
                <div class="modal-content">
                    <div class="contact-success-content">
                        <svg class="contact-success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <p>Thank you for reaching out!</p>
                        <p class="contact-success-subtitle">We'll get back to you as soon as possible.</p>
                    </div>
                    <button class="btn btn-primary contact-close-btn" id="contactSuccessModalClose">OK</button>
                </div>
            </div>
        </div>
    `;

    // Insert modal into body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add close handler
    const closeBtn = document.getElementById('contactSuccessModalClose');
    const modal = document.getElementById('contactSuccessModal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeContactSuccessModal);
    }

    // Close on outside click
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeContactSuccessModal();
            }
        });
    }

    // Close on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeContactSuccessModal();
        }
    });
}

/**
 * Show contact success modal
 */
function showContactSuccessModal() {
    const modal = document.getElementById('contactSuccessModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add animation class to icon
        const icon = modal.querySelector('.contact-success-icon');
        if (icon) {
            icon.style.animation = 'none';
            setTimeout(() => {
                icon.style.animation = 'successIconAnimation 0.6s ease forwards';
            }, 10);
        }
    }
}

/**
 * Close contact success modal
 */
function closeContactSuccessModal() {
    const modal = document.getElementById('contactSuccessModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Add contact modal styles (reuses newsletter styles)
if (!document.getElementById('contact-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'contact-modal-styles';
    style.textContent = `
        /* Contact Modal Specific Styles */
        .contact-success-modal {
            max-width: 500px;
            text-align: center;
        }

        .contact-success-content {
            padding: 2rem 1rem;
            text-align: center;
        }

        .contact-success-icon {
            width: 80px;
            height: 80px;
            stroke: var(--color-gold);
            margin: 0 auto 1.5rem;
            display: block;
        }

        .contact-success-content p {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 0.75rem;
            color: var(--color-white);
        }

        .contact-success-subtitle {
            font-size: 0.875rem;
            color: var(--color-gray-light) !important;
            margin-bottom: 0 !important;
        }

        .contact-close-btn {
            width: 100%;
            margin-top: 1rem;
        }

        /* Mobile optimization */
        @media (max-width: 768px) {
            .contact-success-modal {
                max-width: 90%;
                margin: 0 1rem;
            }

            .contact-success-icon {
                width: 60px;
                height: 60px;
            }

            .contact-success-content {
                padding: 1.5rem 0.5rem;
            }

            .contact-success-content p {
                font-size: 0.9rem;
            }
        }
    `;
    document.head.appendChild(style);
}
