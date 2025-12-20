(function () {
    function initReviews() {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('img01');
        const closeBtn = document.querySelector('.image-modal-close');

        // Use event delegation for better performance and reliability
        document.body.addEventListener('click', function (e) {
            if (e.target.classList.contains('review-img')) {
                if (modal && modalImg) {
                    modal.classList.add('active');
                    modalImg.src = e.target.src;
                    document.body.style.overflow = 'hidden';
                }
            }
        });

        // Close Modal Function
        function closeModal() {
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // Close listeners
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReviews);
    } else {
        initReviews();
    }
})();
