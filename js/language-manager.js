// ============================================
// LANGUAGE MANAGER
// ============================================

const LanguageManager = {
    currentLanguage: 'en', // Default

    init() {
        // 1. Detect Browser Language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('de')) {
            this.currentLanguage = 'de';
        } else {
            this.currentLanguage = 'en';
        }

        // 2. Apply Language
        this.setLanguage(this.currentLanguage);

        // 3. Expose global helper
        window.t = this.t.bind(this);
        window.currentLanguage = this.currentLanguage;
    },

    setLanguage(lang) {
        if (lang !== 'en' && lang !== 'de') return;

        this.currentLanguage = lang;
        window.currentLanguage = lang;
        document.documentElement.lang = lang;

        // Update all static text with data-i18n attribute
        this.updateStaticContent();

        // Dispatch event for other components (like product renderer)
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    },

    // Update elements with data-i18n="key.subkey"
    updateStaticContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    // For inputs, we might want to translate placeholder
                    // But usually we use data-i18n-placeholder for that
                } else {
                    el.innerHTML = translation; // Use innerHTML to allow tags like <strong>
                }
            }
        });

        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) {
                el.placeholder = translation;
            }
        });
    },

    // Helper: Get translation by dot-notation key (e.g. "hero.title")
    t(key) {
        if (!window.TRANSLATIONS) return key;

        const keys = key.split('.');
        let value = window.TRANSLATIONS[this.currentLanguage];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                console.warn(`Translation missing for key: ${key} (${this.currentLanguage})`);
                return key;
            }
        }
        return value;
    },

    // Helper: Get localized property from a product object (e.g. product.name)
    // Supports both object format {en: "...", de: "..."} and direct string fallback
    getLocalized(obj) {
        if (typeof obj === 'object' && obj !== null) {
            return obj[this.currentLanguage] || obj['en'] || "";
        }
        return obj;
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.init();
});

// Expose globally
window.LanguageManager = LanguageManager;
