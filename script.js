const THEME_COLORS = { dark: '#0e2a4a', light: '#f3f6fa' };

/* Theme */
const themeToggle = document.getElementById('themeToggle');

function applyThemeColor(theme) {
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
        meta.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.dark);
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    applyThemeColor(theme);
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
});

applyThemeColor(document.documentElement.getAttribute('data-theme'));

/* Language dropdown (options are plain links to / and /en/) */
const langDropdown = document.getElementById('langDropdown');
const langSelected = document.getElementById('langSelected');

function closeDropdown() {
    langDropdown.classList.remove('open');
    langSelected.setAttribute('aria-expanded', 'false');
}

langSelected.addEventListener('click', () => {
    const isOpen = langDropdown.classList.toggle('open');
    langSelected.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
    if (!langDropdown.contains(event.target)) closeDropdown();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDropdown();
});

/* Revision year */
const currentYear = String(new Date().getFullYear());
const revYear = document.getElementById('revYear');
const footerRev = document.getElementById('footerRev');
if (revYear) revYear.textContent = currentYear;
if (footerRev) footerRev.textContent = `javierescobar.net (rev. ${currentYear})`;

/* Scroll reveal */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = [...document.querySelectorAll('.reveal')];

if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealEls.forEach((el) => observer.observe(el));
}

/* Analytics consent (Google consent mode: default denied, set in <head>) */
const consentBanner = document.getElementById('consentBanner');
const consentChoice = localStorage.getItem('analytics-consent');

function grantAnalyticsConsent() {
    window.gtag && gtag('consent', 'update', { analytics_storage: 'granted' });
}

if (consentChoice === 'granted') {
    grantAnalyticsConsent();
} else if (!consentChoice && consentBanner) {
    consentBanner.hidden = false;

    document.getElementById('consentAccept').addEventListener('click', () => {
        localStorage.setItem('analytics-consent', 'granted');
        grantAnalyticsConsent();
        consentBanner.hidden = true;
    });

    document.getElementById('consentDecline').addEventListener('click', () => {
        localStorage.setItem('analytics-consent', 'denied');
        consentBanner.hidden = true;
    });
}
