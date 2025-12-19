/**
 * ZAHRATO - Cart Management
 * 
 * Handles all cart operations including add, remove, update quantities,
 * price calculations, and localStorage persistence.
 */

const Cart = {
    // Cart items stored in memory
    items: [],

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Initialize cart from localStorage
     */
    init: function () {
        this.loadFromStorage();
        this.updateCartCount();
    },

    // ============================================
    // STORAGE OPERATIONS
    // ============================================

    /**
     * Load cart from localStorage
     */
    loadFromStorage: function () {
        try {
            const storedCart = localStorage.getItem('zahrato_cart');
            if (storedCart) {
                this.items = JSON.parse(storedCart);
            }
        } catch (e) {
            console.error('Error loading cart from storage:', e);
            this.items = [];
        }
    },

    /**
     * Save cart to localStorage
     */
    saveToStorage: function () {
        try {
            localStorage.setItem('zahrato_cart', JSON.stringify(this.items));
        } catch (e) {
            console.error('Error saving cart to storage:', e);
        }
    },

    // ============================================
    // CART OPERATIONS
    // ============================================

    /**
     * Add item to cart
     * @param {Object} item - Item to add { productId, name, price, color, size, quantity, image }
     */
    addItem: function (item) {
        // Check if item already exists with same product, color, and size
        const existingIndex = this.items.findIndex(
            i => i.productId === item.productId &&
                i.color === item.color &&
                i.size === item.size
        );

        if (existingIndex !== -1) {
            // Update quantity of existing item
            this.items[existingIndex].quantity += item.quantity;
        } else {
            // Add new item with unique cart ID
            item.cartId = Date.now() + Math.random().toString(36).substr(2, 9);
            this.items.push(item);
        }

        this.saveToStorage();
        this.updateCartCount();
        this.showAddedNotification(item.name);
    },

    /**
     * Remove item from cart
     * @param {string} cartId - Unique cart item ID
     */
    removeItem: function (cartId) {
        this.items = this.items.filter(item => item.cartId !== cartId);
        this.saveToStorage();
        this.updateCartCount();
    },

    /**
     * Update item quantity
     * @param {string} cartId - Unique cart item ID
     * @param {number} quantity - New quantity
     */
    updateQuantity: function (cartId, quantity) {
        const item = this.items.find(i => i.cartId === cartId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(cartId);
            } else {
                item.quantity = Math.min(quantity, 99); // Max 99 items
                this.saveToStorage();
            }
        }
    },

    /**
     * Clear entire cart
     */
    clearCart: function () {
        this.items = [];
        this.saveToStorage();
        this.updateCartCount();
    },

    /**
     * Get all cart items
     * @returns {Array} Cart items
     */
    getItems: function () {
        return this.items;
    },

    /**
     * Get total number of items in cart
     * @returns {number} Total item count
     */
    getItemCount: function () {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    },

    // ============================================
    // PRICE CALCULATIONS
    // ============================================

    /**
     * Calculate subtotal (sum of all item prices * quantities)
     * @returns {number} Subtotal amount
     */
    calculateSubtotal: function () {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },

    /**
     * Calculate shipping cost
     * @returns {number} Shipping cost (0 for free shipping)
     */
    calculateShipping: function () {
        // Free shipping for orders over $50
        const subtotal = this.calculateSubtotal();
        return subtotal >= 50 ? 0 : 9.99;
    },

    /**
     * Calculate total (subtotal + shipping)
     * @returns {number} Total amount
     */
    calculateTotal: function () {
        return this.calculateSubtotal() + this.calculateShipping();
    },

    /**
     * Format price as currency string
     * @param {number} amount - Amount to format
     * @returns {string} Formatted price string
     */
    formatPrice: function (amount) {
        return '$' + amount.toFixed(2);
    },

    // ============================================
    // UI UPDATES
    // ============================================

    /**
     * Update cart count badge in header
     */
    updateCartCount: function () {
        const countElement = document.getElementById('cartCount');
        if (countElement) {
            const count = this.getItemCount();
            countElement.textContent = count;
            countElement.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    /**
     * Show notification when item is added
     * @param {string} itemName - Name of added item
     */
    showAddedNotification: function (itemName) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${itemName} added to cart</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: #C5A47E;
            color: #000;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.875rem;
            font-weight: 500;
            z-index: 10000;
            animation: slideInNotification 0.3s ease forwards;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        // Add animation keyframes if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInNotification {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideOutNotification {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutNotification 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
};

// ============================================
// CART PAGE RENDERING
// ============================================

/**
 * Render cart page with all items
 */
function renderCartPage() {
    Cart.init();

    const cartContent = document.getElementById('cartContent');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItemsContainer = document.getElementById('cartItems');

    if (!cartContent || !cartEmpty || !cartItemsContainer) return;

    const items = Cart.getItems();

    if (items.length === 0) {
        cartContent.style.display = 'none';
        cartEmpty.style.display = 'block';
        return;
    }

    cartContent.style.display = 'grid';
    cartEmpty.style.display = 'none';

    // Render cart items
    cartItemsContainer.innerHTML = items.map(item => `
        <div class="cart-item" data-cart-id="${item.cartId}">
            <div class="cart-item-image" style="cursor: pointer;" onclick="window.location.href='product.html?id=${item.productId}'">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div class="cart-item-details" style="cursor: pointer;" onclick="window.location.href='product.html?id=${item.productId}'">
                <h3>${item.name}</h3>
                <p class="cart-item-variant">${(item.color && item.color !== 'N/A') ? capitalizeFirst(item.color) + ' / ' : ''}${item.size}</p>
            </div>
        <div class="cart-item-quantity">
                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="updateCartItemQuantity('${item.cartId}', ${item.quantity - 1})">−</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn" onclick="updateCartItemQuantity('${item.cartId}', ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-item" onclick="removeCartItem('${item.cartId}')" aria-label="Remove item">✕</button>
                <span class="cart-item-price">${Cart.formatPrice(item.price * item.quantity)}</span>
            </div>
        </div>
    `).join('');

    // Update summary
    updateCartSummary();
}

/**
 * Update cart summary totals
 */
function updateCartSummary() {
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const totalEl = document.getElementById('cartTotal');

    if (subtotalEl) subtotalEl.textContent = Cart.formatPrice(Cart.calculateSubtotal());
    if (shippingEl) {
        const shipping = Cart.calculateShipping();
        shippingEl.textContent = shipping === 0 ? 'Free' : Cart.formatPrice(shipping);
    }
    if (totalEl) totalEl.textContent = Cart.formatPrice(Cart.calculateTotal());
}

/**
 * Update quantity of cart item
 * @param {string} cartId - Cart item ID
 * @param {number} quantity - New quantity
 */
function updateCartItemQuantity(cartId, quantity) {
    Cart.updateQuantity(cartId, quantity);
    renderCartPage();
}

/**
 * Remove item from cart
 * @param {string} cartId - Cart item ID
 */
function removeCartItem(cartId) {
    Cart.removeItem(cartId);
    renderCartPage();
}

/**
 * Capitalize first letter of string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Quick add product to cart (from product grid)
 * @param {number} productId - Product ID
 */
function quickAdd(productId) {
    // Get product from Shopify config
    const product = window.ShopifyConfig ? ShopifyConfig.getProduct(productId) : null;

    // Fallback: try to find in raw PRODUCTS_DATA if ShopifyConfig fails
    const productData = product || (window.PRODUCTS_DATA ? window.PRODUCTS_DATA.products.find(p => p.id === productId) : null);

    if (productData) {
        Cart.addItem({
            productId: productData.id,
            name: productData.name,
            price: productData.price,
            color: 'N/A',
            size: productData.sizes ? productData.sizes[0] : 'Type 1',
            quantity: 1,
            image: productData.images ? productData.images[0] : `img/product-${productData.id}.png`
        });
    } else {
        console.error('Product not found for quick add:', productId);
        // Alert user
        alert('Could not add product to cart. Please try again.');
    }
}

// ============================================
// CHECKOUT HANDLER
// ============================================

/**
 * Handle checkout button click
 */
function handleCheckout() {
    const items = Cart.getItems();

    if (items.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    if (window.ShopifyConfig) {
        ShopifyConfig.redirectToCheckout(items);
    } else {
        console.error('Shopify configuration not loaded');
        alert('Checkout is currently unavailable. Please try again later.');
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    Cart.init();

    // Add checkout button handler
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
});
