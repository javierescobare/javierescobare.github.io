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

/* Avatar: la expresión depende de la sección que ves y de lo que tocas.
   Prioridad: lo que haces (hover, foco, tap, código secreto) sobre la sección. */
const root = document.documentElement;
const buddy = document.getElementById('buddy');
let sectionMood = 'base';
let eventMood = null;
let eventTimer;

function renderMood() {
    root.dataset.mood = eventMood || sectionMood;
}

function holdMood(mood, ms) {
    eventMood = mood;
    renderMood();
    clearTimeout(eventTimer);
    eventTimer = setTimeout(() => { eventMood = null; renderMood(); }, ms);
}

renderMood();

if ('IntersectionObserver' in window) {
    // La sección que cruza la línea central de la pantalla manda.
    const moodObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            sectionMood = entry.target.dataset.mood || 'base';
            if (entry.target.hasAttribute('data-hero')) root.removeAttribute('data-buddy');
            else root.setAttribute('data-buddy', '');
            renderMood();
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    // Solo dentro de <body>: <html> también lleva data-mood (la expresión actual).
    document.body.querySelectorAll('[data-mood]').forEach((el) => moodObserver.observe(el));
}

// Ceja levantada cuando estás a punto de escribirme.
document.querySelectorAll('.btn-primary').forEach((btn) => {
    const raise = () => { eventMood = 'brow'; renderMood(); };
    const calm = () => { eventMood = null; renderMood(); };
    btn.addEventListener('pointerenter', raise);
    btn.addEventListener('pointerleave', calm);
    btn.addEventListener('focus', raise);
    btn.addEventListener('blur', calm);
});

// Risa al pasar el cursor o al tocar al compañero.
if (buddy) {
    buddy.addEventListener('pointerenter', () => holdMood('laugh', 1200));
    buddy.addEventListener('click', () => {
        holdMood('laugh', 1600);
        buddy.classList.remove('bump');
        void buddy.offsetWidth;
        buddy.classList.add('bump');
    });
}

/* Detalles para quien abre la consola o prueba el teclado */
const isEs = document.documentElement.lang === 'es';
console.log(
    isEs
        ? 'Hola, dev. Ya que abriste la consola: el código está en https://github.com/javierescobare/javierescobare.github.io\nPista: el avatar tiene sentido del humor. Prueba el código Konami.'
        : 'Hi, dev. Since you opened the console: the code is at https://github.com/javierescobare/javierescobare.github.io\nHint: the avatar has a sense of humor. Try the Konami code.'
);

const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiAt = 0;
let typed = '';

document.addEventListener('keydown', (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    konamiAt = key === konami[konamiAt] ? konamiAt + 1 : (key === konami[0] ? 1 : 0);
    if (konamiAt === konami.length) {
        konamiAt = 0;
        holdMood('laugh', 4000);
        console.log(isEs ? 'Código Konami aceptado. No sé qué esperabas.' : 'Konami code accepted. Not sure what you expected.');
    }

    if (event.key.length === 1) {
        typed = (typed + key).slice(-4);
        if (typed === 'sudo') {
            holdMood('laugh', 3000);
            console.log(isEs ? 'javier no está en el archivo sudoers. Este incidente será reportado.' : 'javier is not in the sudoers file. This incident will be reported.');
        }
    }
});

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
