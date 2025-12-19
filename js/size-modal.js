// ============================================
// SIZE SELECTION REQUIRED MODAL
// ============================================

/**
 * Create size required modal
 */
function createSizeRequiredModal() {
    // Check if modal already exists
    if (document.getElementById('sizeRequiredModal')) return;

    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="sizeRequiredModal">
            <div class="modal-container size-required-modal">
                <div class="modal-header" >
                    <button class="modal-close" id="sizeRequiredModalClose">✕</button>
                    <h2 class="modal-title">Please Select a Size</h2>
                </div>
                <div class="modal-content">
                    <div class="size-required-content">
                        <p style="margin-bottom: 1.5rem; color: var(--color-white);">You need to select a version before adding this item to your cart.</p>
                        
                        <div style='display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1.5rem 0;'>
                            <div style='text-align:center;'>
                                <img src='img/top_mounted.jpeg' alt='Version 1 - Top Mounted'
                                    style='width:100%;max-width:min(320px, 45vw);border-radius:8px;margin:0 auto 0.5rem auto;display:block;'>
                                <h4 style='font-size:clamp(0.9rem, 3vw, 1.25rem);margin:0.5rem 0;'>Version 1</h4>
                                <p style='font-size:clamp(0.75rem, 2.5vw, 0.9rem);color:var(--color-gray-light);margin:0;padding:0 0.25rem;'>For cars with
                                    <strong>Top Mounted</strong> pedals.
                                </p>
                            </div>
                            <div style='text-align:center;'>
                                <img src='img/floor_mounted.jpeg' alt='Version 2 - Bottom Mounted'
                                    style='width:100%;max-width:min(320px, 45vw);border-radius:8px;margin:0 auto 0.5rem auto;display:block;'>
                                <h4 style='font-size:clamp(0.9rem, 3vw, 1.25rem);margin:0.5rem 0;'>Version 2</h4>
                                <p style='font-size:clamp(0.75rem, 2.5vw, 0.9rem);color:var(--color-gray-light);margin:0;padding:0 0.25rem;'>For cars with
                                    <strong>Floor Mounted</strong> pedals.
                                </p>
                            </div>
                        </div>
                        <p>Please check your vehicle's pedals before ordering to ensure the perfect fit.</p>
                    </div>
                    <button class="btn btn-primary size-required-close-btn" id="sizeRequiredOkBtn">OK</button>
                </div>
            </div>
        </div>
    `;

    // Insert modal into body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add close handlers
    const closeBtn = document.getElementById('sizeRequiredModalClose');
    const okBtn = document.getElementById('sizeRequiredOkBtn');
    const modal = document.getElementById('sizeRequiredModal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSizeRequiredModal);
    }

    if (okBtn) {
        okBtn.addEventListener('click', closeSizeRequiredModal);
    }

    // Close on outside click
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeSizeRequiredModal();
            }
        });
    }

    // Close on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeSizeRequiredModal();
        }
    });
}

/**
 * Show size required modal
 */
function showSizeRequiredModal() {
    // Create modal if it doesn't exist
    createSizeRequiredModal();

    const modal = document.getElementById('sizeRequiredModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close size required modal
 */
function closeSizeRequiredModal() {
    const modal = document.getElementById('sizeRequiredModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Make function globally available
window.showSizeRequiredModal = showSizeRequiredModal;

// Add size required modal styles
if (!document.getElementById('size-required-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'size-required-modal-styles';
    style.textContent = `
        /* Size Required Modal Specific Styles */
        .size-required-modal {
            max-width: 800px;
        }

        .size-required-content {
            padding: 0;
        }

        .size-required-content h3 {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            margin-bottom: 0.75rem;
            color: var(--color-white);
        }

        .size-required-content h4 {
            font-family: var(--font-heading);
            margin: 0.5rem 0;
            color: var(--color-white);
        }

        .size-required-content p {
            color: var(--color-gray-light);
            line-height: 1.6;
            margin-bottom: 0.75rem;
        }

        .size-required-close-btn {
            width: 100%;
            margin-top: 1.5rem;
        }

        /* Mobile optimization */
        @media (max-width: 768px) {
            .size-required-modal {
                max-width: 95%;
                margin: 0 0.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}
