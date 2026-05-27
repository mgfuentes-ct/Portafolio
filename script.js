const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const contactForm = document.getElementById('contactForm');
const navbar = document.querySelector('.navbar');
const hero = document.querySelector('.hero');
const heroVisual = document.querySelector('.floating-card');

const revealTargets = [
    '.hero-content',
    '.hero-image',
    '.about-content',
    '.skill-card',
    '.timeline-content',
    '.certification-card',
    '.project-card',
    '.contact-content',
    '.footer',
    '.about h2',
    '.skills h2',
    '.experience h2',
    '.certifications h2',
    '.projects h2',
    '.contact h2'
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMobileMenu() {
    if (hamburger) {
        hamburger.classList.remove('active');
    }
    if (navMenu) {
        navMenu.classList.remove('active');
    }
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-container')) {
        closeMobileMenu();
    }
});

function addRevealClass() {
    revealTargets.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
            element.classList.add('reveal');
        });
    });
}

function initRevealObserver() {
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

function initScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;

        if (navbar) {
            navbar.style.boxShadow = scrollTop > 24
                ? '0 14px 40px rgba(0, 0, 0, 0.38)'
                : '0 1px 0 rgba(255, 255, 255, 0.02)';
        }

        if (heroVisual) {
            const parallaxOffset = Math.min(scrollTop * 0.12, 40);
            heroVisual.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
        }
    }, { passive: true });

    window.addEventListener('mousemove', (event) => {
        if (!hero || reduceMotion) {
            return;
        }

        const x = (event.clientX / window.innerWidth - 0.5) * 12;
        const y = (event.clientY / window.innerHeight - 0.5) * 12;

        hero.style.setProperty('--mouse-x', `${x}px`);
        hero.style.setProperty('--mouse-y', `${y}px`);

        if (heroVisual) {
            heroVisual.style.transform = `translate3d(${x * 0.6}px, ${y * 0.6}px, 0)`;
        }
    });
}

function initStatsCounter() {
    const statsSection = document.querySelector('.about');
    if (!statsSection) {
        return;
    }

    const counters = document.querySelectorAll('.stat h3');
    let animated = false;

    const animateCounter = (element, targetValue, duration = 1400) => {
        const startTime = performance.now();
        const initialValue = 0;

        const frame = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.round(initialValue + (targetValue - initialValue) * progress);
            element.textContent = `${currentValue}${element.textContent.includes('+') ? '+' : ''}`;

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        };

        requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach((counter) => {
                    const text = counter.textContent;
                    const value = parseInt(text, 10);
                    if (!Number.isNaN(value)) {
                        animateCounter(counter, value);
                    }
                });
                observer.unobserve(statsSection);
            }
        });
    }, { threshold: 0.4 });

    observer.observe(statsSection);
}

function initContactForm() {
    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const recipient = 'maria.fuentesac2@gmail.com';

        const mailSubject = encodeURIComponent(subject);
        const mailBody = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${message}`);
        const mailtoUrl = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

        window.location.href = mailtoUrl;
    });
}

function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            const targetElement = targetId ? document.querySelector(targetId) : null;

            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            }
        });
    });
}

function init() {
    addRevealClass();
    initRevealObserver();
    initScrollEffects();
    initStatsCounter();
    initContactForm();
    initSmoothAnchors();
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});