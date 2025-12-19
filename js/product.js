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

    // Load product data
    loadProductData(productId);

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

    // Fallback product data
    if (!product) {
        const fallbackProducts = {
            1: {
                name: 'Eternal Ring',
                price: 59.99,
                description: 'Crafted with precision and elegance, the Eternal Ring represents timeless beauty. Made with premium materials and finished with exquisite detail, this piece will become a treasured addition to your jewelry collection.'
            },
            2: {
                name: 'Celestial Necklace',
                price: 89.99,
                description: 'A stunning necklace that captures the beauty of the night sky. Each pendant is carefully designed to reflect starlight and elegance.'
            },
            3: {
                name: 'Luna Bracelet',
                price: 49.99,
                description: 'Elegant bracelet inspired by the gentle glow of the moon. A perfect accessory for any occasion.'
            },
            4: {
                name: 'Aurora Earrings',
                price: 39.99,
                description: 'Delicate earrings that shimmer like the northern lights. Lightweight and comfortable for all-day wear.'
            },
            5: {
                name: 'Starlight Pendant',
                price: 69.99,
                description: 'A dazzling pendant that captures starlight in elegant gold. Perfect for special occasions.'
            },
            6: {
                name: 'Infinity Band',
                price: 79.99,
                description: 'A symbol of eternal love, crafted with precision and care. The perfect gift for someone special.'
            }
        };

        product = fallbackProducts[productId] || fallbackProducts[1];
        product.id = productId;
    }

    // Update page with product data
    const titleEl = document.getElementById('productTitle');
    const priceEl = document.getElementById('productPrice');
    const descEl = document.getElementById('productDescription');

    if (titleEl) titleEl.textContent = product.name;
    if (priceEl) priceEl.textContent = '$' + product.price.toFixed(2);
    if (descEl) descEl.textContent = product.description;

    // Update page title
    document.title = product.name + ' - ZAHRATO';

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
    const mainImage = document.getElementById('mainImage');

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', function () {
            // Remove active from all
            thumbnails.forEach(t => t.classList.remove('active'));

            // Add active to clicked
            this.classList.add('active');

            // Update main image (in real implementation, swap images)
            if (mainImage) {
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    // Here you would swap the actual image
                    mainImage.style.opacity = '1';
                }, 200);
            }
        });
    });
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
            image: product.image || `img/product-${product.id}.jpg`
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
