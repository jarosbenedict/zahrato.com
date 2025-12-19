/**
 * ZAHRATO - Animations
 * 
 * Scroll animations and interaction effects
 */

document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimations();
    initHeaderScroll();
    initHoverEffects();
});

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length === 0) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    });

    // Observe all animated elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize header background change on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll direction (optional)
        // if (currentScroll > lastScroll && currentScroll > 200) {
        //     header.style.transform = 'translateY(-100%)';
        // } else {
        //     header.style.transform = 'translateY(0)';
        // }

        lastScroll = currentScroll;
    });

    // Add scrolled class styles dynamically
    if (!document.getElementById('header-scroll-styles')) {
        const style = document.createElement('style');
        style.id = 'header-scroll-styles';
        style.textContent = `
            .header {
                transition: background-color 0.3s ease, transform 0.3s ease;
            }
            .header.scrolled {
                background-color: rgba(0, 0, 0, 0.98);
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initialize hover effects and micro-interactions
 */
function initHoverEffects() {
    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Create ripple element
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation keyframes
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Smooth scroll to anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Parallax effect for hero section (optional, subtle)
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');

    if (!hero || !heroBg) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Initialize parallax if hero exists
if (document.querySelector('.hero')) {
    initParallax();
}

/**
 * Lazy loading for images (optional enhancement)
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

/**
 * Image zoom effect on hover (for product images)
 */
function initImageZoom() {
    const zoomContainers = document.querySelectorAll('.product-main-image');

    zoomContainers.forEach(container => {
        const img = container.querySelector('img');
        if (!img) return;

        container.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width * 100;
            const y = (e.clientY - rect.top) / rect.height * 100;

            img.style.transformOrigin = `${x}% ${y}%`;
            img.style.transform = 'scale(1.5)';
        });

        container.addEventListener('mouseleave', function () {
            img.style.transform = '';
        });
    });
}

// Initialize image zoom
initImageZoom();
