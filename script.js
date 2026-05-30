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
    '.skills-sphere-wrap',
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

function initTechSphere() {
    const sphereWrap = document.getElementById('skillsSphereWrap');
    const sphere = document.getElementById('techSphere');
    if (!sphereWrap || !sphere) {
        return;
    }

    const nodes = Array.from(sphere.querySelectorAll('.tech-node'));
    if (!nodes.length) {
        return;
    }

    const state = {
        rotateX: -14,
        rotateY: 6,
        velocityX: 0,
        velocityY: 0.18,
        targetX: -14,
        targetY: 6,
        drag: false,
        lastX: 0,
        lastY: 0,
        radius: 180
    };

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    function updateRadius() {
        const size = Math.min(sphere.clientWidth, sphere.clientHeight);
        state.radius = clamp(size * 0.35, 100, 230);
    }

    function placeNodes() {
        const total = nodes.length;
        nodes.forEach((node, index) => {
            const ratio = (index + 0.5) / total;
            const phi = Math.acos(1 - 2 * ratio);
            const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);

            const x = state.radius * Math.cos(theta) * Math.sin(phi);
            const y = state.radius * Math.cos(phi);
            const z = state.radius * Math.sin(theta) * Math.sin(phi);

            node.dataset.x = x.toFixed(3);
            node.dataset.y = y.toFixed(3);
            node.dataset.z = z.toFixed(3);
        });
    }

    function renderNodes() {
        const rx = state.rotateX * (Math.PI / 180);
        const ry = state.rotateY * (Math.PI / 180);

        nodes.forEach((node) => {
            const x = Number(node.dataset.x);
            const y = Number(node.dataset.y);
            const z = Number(node.dataset.z);

            const x1 = x * Math.cos(ry) + z * Math.sin(ry);
            const z1 = -x * Math.sin(ry) + z * Math.cos(ry);

            const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
            const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);

            const depth = (z2 + state.radius) / (state.radius * 2);
            const scale = 0.58 + depth * 0.72;
            const alpha = 0.35 + depth * 0.72;

            node.style.transform = `translate3d(${x1.toFixed(2)}px, ${y2.toFixed(2)}px, ${z2.toFixed(2)}px) scale(${scale.toFixed(3)})`;
            node.style.opacity = alpha.toFixed(3);
            node.style.zIndex = String(Math.floor(depth * 1000));
        });
    }

    function animateSphere() {
        state.rotateX += (state.targetX - state.rotateX) * 0.08;
        state.rotateY += (state.targetY - state.rotateY) * 0.08;

        if (!state.drag) {
            state.velocityY *= 0.985;
            state.velocityX *= 0.985;

            if (Math.abs(state.velocityY) < 0.02) {
                state.velocityY = 0.05;
            }

            state.targetY += state.velocityY;
            state.targetX += state.velocityX;
            state.targetX = clamp(state.targetX, -55, 55);
        }

        renderNodes();
        requestAnimationFrame(animateSphere);
    }

    function pointerToTarget(clientX, clientY) {
        const rect = sphereWrap.getBoundingClientRect();
        const offsetX = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const offsetY = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        state.targetY += offsetX * 0.45;
        state.targetX -= offsetY * 0.28;
        state.targetX = clamp(state.targetX, -55, 55);
    }

    sphereWrap.addEventListener('pointerdown', (event) => {
        state.drag = true;
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        sphereWrap.setPointerCapture(event.pointerId);
    });

    sphereWrap.addEventListener('pointermove', (event) => {
        if (state.drag) {
            const deltaX = event.clientX - state.lastX;
            const deltaY = event.clientY - state.lastY;

            state.targetY += deltaX * 0.42;
            state.targetX -= deltaY * 0.34;
            state.targetX = clamp(state.targetX, -60, 60);

            state.velocityY = deltaX * 0.03;
            state.velocityX = -deltaY * 0.02;

            state.lastX = event.clientX;
            state.lastY = event.clientY;
            return;
        }

        pointerToTarget(event.clientX, event.clientY);
    });

    sphereWrap.addEventListener('pointerup', () => {
        state.drag = false;
    });

    sphereWrap.addEventListener('pointerleave', () => {
        state.drag = false;
    });

    window.addEventListener('resize', () => {
        updateRadius();
        placeNodes();
    });

    updateRadius();
    placeNodes();
    renderNodes();
    animateSphere();
}

function init() {
    addRevealClass();
    initRevealObserver();
    initScrollEffects();
    initTechSphere();
    initStatsCounter();
    initContactForm();
    initSmoothAnchors();
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});