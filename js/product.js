/**
 * ZAHRATO - Product Page Functionality
 * 
 * Handles product page interactions including image gallery,
 * color/size selection, quantity controls, and add to cart.
 */

document.addEventListener('DOMContentLoaded', function () {
    initProductPage();
});

/**
 * Initialize product page functionality
 */
function initProductPage() {
    // Check if we're on a product page
    if (!document.querySelector('.product-page')) return;

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;

    // Initial load
    loadProductData(productId);

    // Re-render on language change
    window.addEventListener('languageChanged', () => {
        loadProductData(productId);
    });

    // Initialize UI interactions
    initColorSelector();
    initSizeSelector();
    initQuantityControls();
    initThumbnailGallery();
    initAddToCart(productId);
}

/**
 * Load product data and update page
 * @param {number} productId - Product ID
 */
function loadProductData(productId) {
    // Get product from Shopify config or use fallback
    let product = null;

    if (window.ShopifyConfig) {
        product = ShopifyConfig.getProduct(productId);
    }

    // Fallback product data (Mock data only, ideally should also be localized if used)
    if (!product) {
        // ... (keeping fallback as legacy/dev only is fine, or update if critical)
        const fallbackProducts = {
            1: {
                name: { en: 'Eternal Ring', de: 'Ewiger Ring' },
                price: 59.99,
                description: { en: 'Crafted with precision...', de: 'Gefertigt mit Präzision...' }
            },
            // ... simplified for brevity, assuming main path uses PRODUCTS_DATA
        };
        // For now, let's just use what we have, but if product is null, we might show error
        // But assuming PRODUCTS_DATA is loaded
    }

    if (!product) return;

    // Update page with product data
    const titleEl = document.getElementById('productTitle');
    const priceEl = document.getElementById('productPrice');
    const descEl = document.getElementById('productDescription');

    if (titleEl) titleEl.textContent = LanguageManager.getLocalized(product.name);
    if (priceEl) priceEl.textContent = '€' + product.price.toFixed(2);
    if (descEl) descEl.textContent = LanguageManager.getLocalized(product.description);

    // Update images
    if (product.images && product.images.length > 0) {
        const mainImage = document.getElementById('mainImage');
        const thumbnailContainer = document.getElementById('thumbnails');

        // Update main image - Render ALL images for slider/fade support
        if (mainImage) {
            mainImage.innerHTML = product.images.map((img, index) =>
                `<img src="${img}" class="${index === 0 ? 'active' : ''}" data-index="${index}" alt="${LanguageManager.getLocalized(product.name)}">`
            ).join('');
        }

        // Update thumbnails
        if (thumbnailContainer) {
            thumbnailContainer.innerHTML = product.images.map((img, index) => `
                <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <img src="${img}" alt="View ${index + 1}">
                </div>
            `).join('');

            // Re-init thumbnail interactions
            initThumbnailGallery();
        }
    }

    // Update page title
    document.title = LanguageManager.getLocalized(product.name) + ' - ZAHRATO';

    // Store product data for add to cart
    window.currentProduct = product;
}

/**
 * Initialize color selector
 */
function initColorSelector() {
    const colorOptions = document.querySelectorAll('.color-option');
    const colorNameEl = document.getElementById('selectedColorName');

    colorOptions.forEach(option => {
        option.addEventListener('click', function () {
            // Remove active from all
            colorOptions.forEach(opt => opt.classList.remove('active'));

            // Add active to clicked
            this.classList.add('active');

            // Update color name display
            if (colorNameEl) {
                colorNameEl.textContent = this.dataset.colorName;
            }

            // Store selected color
            window.selectedColor = this.dataset.color;
        });
    });

    // Set default
    window.selectedColor = 'gold';
}

/**
 * Initialize size selector
 */
function initSizeSelector() {
    const sizeSelect = document.getElementById('sizeSelect');

    if (sizeSelect) {
        sizeSelect.addEventListener('change', function () {
            window.selectedSize = this.value;
        });
    }

    // Set default
    window.selectedSize = '';
}

/**
 * Initialize quantity controls
 */
function initQuantityControls() {
    const quantityInput = document.getElementById('quantityInput');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');

    if (!quantityInput || !decreaseBtn || !increaseBtn) return;

    // Decrease quantity
    decreaseBtn.addEventListener('click', function () {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
            // Add button animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => this.style.transform = '', 100);
        }
    });

    // Increase quantity
    increaseBtn.addEventListener('click', function () {
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            quantityInput.value = value + 1;
            // Add button animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => this.style.transform = '', 100);
        }
    });
}

/**
 * Initialize thumbnail gallery
 */
function initThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImageContainer = document.getElementById('mainImage');

    if (!mainImageContainer) return;

    thumbnails.forEach((thumb) => {
        thumb.addEventListener('click', function () {
            // Remove active from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));

            // Add active to clicked thumbnail
            this.classList.add('active');

            // Get index
            const index = parseInt(this.dataset.index);

            // Desktop: Update active image class
            const images = mainImageContainer.querySelectorAll('img');
            images.forEach(img => img.classList.remove('active'));
            if (images[index]) {
                images[index].classList.add('active');
            }

            // Mobile: Scroll to image in slider
            if (images[index] && window.innerWidth <= 1024) {
                images[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
        });
    });

    // Mobile: Update active thumbnail on scroll
    if (window.innerWidth <= 1024) {
        const observerOptions = {
            root: mainImageContainer,
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.index);

                    // Update active thumbnail
                    thumbnails.forEach(t => t.classList.remove('active'));
                    if (thumbnails[index]) {
                        thumbnails[index].classList.add('active');
                    }
                }
            });
        }, observerOptions);

        // Observe all images
        const images = mainImageContainer.querySelectorAll('img');
        images.forEach(img => observer.observe(img));
    }
}

/**
 * Initialize add to cart button
 * @param {number} productId - Product ID
 */
function initAddToCart(productId) {
    const addToCartBtn = document.getElementById('addToCartBtn');

    if (!addToCartBtn) return;

    addToCartBtn.addEventListener('click', function () {
        // Validate size selection
        if (!window.selectedSize) {
            // Highlight size selector
            const sizeSelect = document.getElementById('sizeSelect');
            if (sizeSelect) {
                sizeSelect.style.borderColor = '#ff4444';
                sizeSelect.focus();
                setTimeout(() => {
                    sizeSelect.style.borderColor = '';
                }, 2000);
            }
            // Show custom size required modal instead of alert
            if (typeof showSizeRequiredModal === 'function') {
                showSizeRequiredModal();
            } else {
                alert('Please select a size');
            }
            return;
        }

        // Get product data
        const product = window.currentProduct || {
            id: productId,
            name: 'Product',
            price: 49.99
        };

        // Get quantity
        const quantityInput = document.getElementById('quantityInput');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

        // Add to cart
        Cart.addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            color: window.selectedColor || 'gold',
            size: window.selectedSize,
            quantity: quantity,
            image: (product.images && product.images.length > 0) ? product.images[0] : `img/product-${product.id}.jpg`
        });

        // Button feedback animation
        const originalText = addToCartBtn.textContent;
        addToCartBtn.textContent = 'Added!';
        addToCartBtn.style.backgroundColor = '#4CAF50';

        setTimeout(() => {
            addToCartBtn.textContent = originalText;
            addToCartBtn.style.backgroundColor = '';
        }, 1500);
    });
}
