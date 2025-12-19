/**
 * ZAHRATO - Shopify Integration
 * 
 * Loads product data from JSON and handles checkout URL generation.
 */

const ShopifyConfig = {
    // ============================================
    // STORE CONFIGURATION
    // ============================================
    // Replace with your Shopify store URL (without https://)
    storeName: 'your-store-name.myshopify.com',

    // Products loaded from JSON
    products: {},

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Load products from JSON file
     */
    async loadProducts() {
        try {
            // Use global PRODUCTS_DATA instead of fetch
            if (!window.PRODUCTS_DATA) {
                console.error('PRODUCTS_DATA not found. Make sure products.js is loaded.');
                return null;
            }

            const data = window.PRODUCTS_DATA;

            // Store name from config
            if (data.shopify && data.shopify.storeName) {
                this.storeName = data.shopify.storeName;
            }

            // Convert array to object with ID as key
            if (data.products) {
                data.products.forEach(product => {
                    this.products[product.id] = product;
                });
            }

            return data;
        } catch (error) {
            console.error('Error loading products:', error);
            return null;
        }
    },

    // ============================================
    // HELPER METHODS
    // ============================================

    /**
     * Get product by ID
     * @param {number} productId - Product ID
     * @returns {Object|null} Product object or null if not found
     */
    getProduct: function (productId) {
        return this.products[productId] || null;
    },

    /**
     * Get Shopify variant ID for a product with specific color and size
     * @param {number} productId - Product ID
     * @param {string} color - Color (e.g., 'gold', 'silver')
     * @param {string} size - Size (e.g., 'Universal', 'Small', 'Medium', etc.)
     * @returns {string|null} Variant ID or null if not found
     */
    getVariantId: function (productId, color, size) {
        const product = this.getProduct(productId);
        if (!product || !product.variants) return null;

        const variantKey = `${color.toLowerCase()}-${size}`;
        return product.variants[variantKey] || null;
    },

    /**
     * Generate Shopify checkout URL from cart items
     * Format: https://store.myshopify.com/cart/variant_id:quantity,variant_id:quantity
     * 
     * @param {Array} cartItems - Array of cart items
     * @returns {string} Shopify checkout URL
     */
    generateCheckoutUrl: function (cartItems) {
        if (!cartItems || cartItems.length === 0) {
            return `https://${this.storeName}/cart`;
        }

        const cartParams = cartItems.map(item => {
            const variantId = this.getVariantId(item.productId, item.color, item.size);
            if (variantId) {
                return `${variantId}:${item.quantity}`;
            }
            return null;
        }).filter(Boolean);

        if (cartParams.length === 0) {
            return `https://${this.storeName}/cart`;
        }

        return `https://${this.storeName}/cart/${cartParams.join(',')}`;
    },

    /**
     * Redirect to Shopify checkout
     * @param {Array} cartItems - Array of cart items  
     */
    redirectToCheckout: function (cartItems) {
        const checkoutUrl = this.generateCheckoutUrl(cartItems);
        console.log('Redirecting to Shopify checkout:', checkoutUrl);
        window.location.href = checkoutUrl;
    }
};

// Make ShopifyConfig globally available
window.ShopifyConfig = ShopifyConfig;

// Auto-load products on page load
document.addEventListener('DOMContentLoaded', function () {
    ShopifyConfig.loadProducts();
});
