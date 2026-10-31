/* Footer year */
const footerRev = document.getElementById('footerRev');
if (footerRev) footerRev.textContent = `javierescobar.net · ${new Date().getFullYear()}`;

/* Scroll reveal: cada sección entra una sola vez, cuando su título ya se ve.
   Se observa el título y no la sección: el relleno vacío de arriba no cuenta. */
const revealEls = [...document.querySelectorAll('.reveal')];

if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.closest('.reveal').classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -18% 0px', threshold: 0.5 });
    revealEls.forEach((el) => observer.observe(el.querySelector('h2') || el));
}

/* Analytics consent (Google consent mode: default denied, set in <head>) */
const consentBanner = document.getElementById('consentBanner');

// El almacenamiento puede estar bloqueado (modo privado, ajustes del navegador).
function readChoice() {
    try { return localStorage.getItem('analytics-consent'); } catch (e) { return null; }
}

function saveChoice(value) {
    try { localStorage.setItem('analytics-consent', value); } catch (e) { }
}

function grantAnalyticsConsent() {
    window.gtag && gtag('consent', 'update', { analytics_storage: 'granted' });
}

const consentChoice = readChoice();

if (consentChoice === 'granted') {
    grantAnalyticsConsent();
} else if (!consentChoice && consentBanner) {
    consentBanner.hidden = false;

    document.getElementById('consentAccept').addEventListener('click', () => {
        saveChoice('granted');
        grantAnalyticsConsent();
        consentBanner.hidden = true;
    });

    document.getElementById('consentDecline').addEventListener('click', () => {
        saveChoice('denied');
        consentBanner.hidden = true;
    });
}
