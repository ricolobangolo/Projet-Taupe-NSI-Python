// Global state
let currentLang = getCookie('language') || 'fr';

// Cookie management functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Language switcher functionality
function initLanguageSwitcher() {
    const switcher = document.querySelector('.lang-switcher-btn');
    const options = document.querySelector('.lang-options');

    if (!switcher || !options) return;

    // Toggle language options
    switcher.addEventListener('click', () => {
        options.classList.toggle('active');
    });

    // Close options when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-switcher')) {
            options.classList.remove('active');
        }
    });

    // Handle language selection
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            switchLanguage(lang);
            options.classList.remove('active');
            updateSwitcherButton(lang);
        });
    });

    // Initial language setup
    updateSwitcherButton(currentLang);
    switchLanguage(currentLang);
}

function switchLanguage(lang) {
    currentLang = lang;
    setCookie('language', lang, 365); // Sauvegarde la langue pour 1 an
    document.documentElement.setAttribute('lang', lang);

    // Ensure translations object exists
    if (typeof translations === 'undefined') {
        console.error('Translations not loaded');
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Handle placeholder translations
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.dataset.i18nPlaceholder;
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
}

function updateSwitcherButton(lang) {
    const btn = document.querySelector('.lang-switcher-btn');
    if (btn) {
        btn.innerHTML = `<i class="fas fa-globe"></i> ${lang.toUpperCase()}`;
    }
}

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
let currentThemeIndex = 0;
const themes = ['light', 'dark', 'astigmatism'];

function cycleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    setTheme(themes[currentThemeIndex]);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    setCookie('theme', theme, 365);
    
    const icon = themeToggle.querySelector('i');
    switch(theme) {
        case 'dark':
            icon.className = 'fas fa-sun';
            break;
        case 'astigmatism':
            icon.className = 'fas fa-eye';
            break;
        default:
            icon.className = 'fas fa-moon';
    }
}

function initTheme() {
    const savedTheme = getCookie('theme');
    if (savedTheme) {
        currentThemeIndex = themes.indexOf(savedTheme);
        if (currentThemeIndex === -1) currentThemeIndex = 0;
        setTheme(themes[currentThemeIndex]);
    } else {
        setTheme('light');
    }
}

themeToggle.addEventListener('click', cycleTheme);

// Mobile menu functionality
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const nav = document.querySelector('nav');

mobileMenuButton.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

// Set active navigation link
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav ul li a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Scroll effect for navigation
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setActiveLink();
    initLanguageSwitcher();
    initTheme();
});