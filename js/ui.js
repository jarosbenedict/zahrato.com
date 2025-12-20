/**
 * ZAHRATO - Shared UI Functionality
 * Handles Policy Modal and Contact Modal
 */

(function () {
    // Initialize everything on load
    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initPolicyModal();
        initContactModal();
        initQnA();
    });

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mainNav = document.getElementById('mainNav');
        if (!menuToggle || !mainNav) return;

        // Toggle menu
        menuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when a link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    /**
     * QnA Accordion Logic
     */
    function initQnA() {
        const container = document.getElementById('qnaContainer');
        if (!container) return;

        // Add click handlers
        container.querySelectorAll('.qna-question').forEach(btn => {
            btn.addEventListener('click', function () {
                const item = this.closest('.qna-item');
                const wasActive = item.classList.contains('active');

                // Close all
                container.querySelectorAll('.qna-item').forEach(i => i.classList.remove('active'));

                // Toggle clicked
                if (!wasActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    /**
     * Policy Modal Logic
     */
    function initPolicyModal() {
        const modal = document.getElementById('policyModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        const modalClose = document.getElementById('modalClose');

        if (!modal) return;

        // Event Delegation for policy links
        document.body.addEventListener('click', function (e) {
            if (e.target.classList.contains('policy-link')) {
                e.preventDefault();
                const policyKey = e.target.dataset.policy;
                openPolicyModal(policyKey);
            }
        });

        function openPolicyModal(policyKey) {
            // Use LanguageManager if available to get localized content
            // window.policies is set in products.js, but acts as a fallback or data source
            // We should use translations if possible, but the structure in translations.js is flattened?
            // Wait, I migrated policies to translations.js under 'policies' key?
            // No, strictly 'policies.modalTitle'.
            // The content (shipping, returns) is in window.policies (from products.js) which I updated to use en/de.

            // Actually, in step 118, I updated translations.js, but I didn't see 'policies' content there?
            // I updated 'products.js' with en/de content for policies! (Step 133 view of products.js shows it).
            // So window.policies[policyKey] returns {title: {en:..., de:...}, content: {en:..., de:...}}.

            // So we need LanguageManager.getLocalized() for title and content.

            if (!window.policies || !window.policies[policyKey]) {
                console.error('Policy not found:', policyKey);
                return;
            }

            const policy = window.policies[policyKey];

            if (modalTitle && window.LanguageManager) {
                modalTitle.textContent = LanguageManager.getLocalized(policy.title);
            } else if (modalTitle) {
                modalTitle.textContent = policy.title.en || policy.title;
            }

            if (modalContent && window.LanguageManager) {
                modalContent.innerHTML = LanguageManager.getLocalized(policy.content);
            } else if (modalContent) {
                modalContent.innerHTML = policy.content.en || policy.content;
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /**
     * Contact Modal Logic
     */
    function initContactModal() {
        const contactModal = document.getElementById('contactModal');
        const contactModalClose = document.getElementById('contactModalClose');
        const contactTriggers = document.querySelectorAll('.contact-trigger');

        if (!contactModal) return;

        contactTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                contactModal.classList.add('active');
            });
        });

        if (contactModalClose) {
            contactModalClose.addEventListener('click', () => {
                contactModal.classList.remove('active');
            });
        }

        // Close when click outside
        window.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('active');
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactModal.classList.contains('active')) {
                contactModal.classList.remove('active');
            }
        });

        // Copy Email Logic
        const copyBtn = document.getElementById('copyEmailBtn');
        const emailEl = document.getElementById('contactEmail');

        if (copyBtn && emailEl) {
            copyBtn.addEventListener('click', () => {
                const email = emailEl.textContent;
                navigator.clipboard.writeText(email).then(() => {
                    // Show Feedback
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy info: ', err);
                });
            });
        }
    }
})();
