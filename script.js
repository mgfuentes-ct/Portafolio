// Variables globales
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const contactForm = document.getElementById('contactForm');
const navbar = document.querySelector('.navbar');

// Toggle menú hamburguesa
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Cerrar menú cuando se hace clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Cerrar menú cuando se hace clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Animación de scroll suave para elementos (Intersection Observer)
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Aplicar animación a tarjetas
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.skill-card, .project-card, .stat, .timeline-content');
    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
});

// Animación de navbar al scroll
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    if (scrollTop > 20) {
        navbar.style.boxShadow = '0 1px 8px rgba(0, 0, 0, 0.12)';
    } else {
        navbar.style.boxShadow = '0 0 1px rgba(0, 0, 0, 0.1)';
    }
});

// Validación y envío del formulario
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !subject || !message) {
            alert('Por favor, completa todos los campos');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un email válido');
            return;
        }
        
        const submitButton = contactForm.querySelector('button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            alert('¡Gracias por tu mensaje! Me pondré en contacto pronto.');
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    });
}

// Contador de números animados para estadísticas
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animar contadores cuando se llega a la sección de estadísticas
const statsSection = document.querySelector('.about');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            const stats = document.querySelectorAll('.stat h3');
            stats.forEach(stat => {
                const targetText = stat.textContent;
                const targetNumber = parseInt(targetText);
                if (!isNaN(targetNumber)) {
                    animateCounter(stat, targetNumber);
                }
            });
            statsObserver.unobserve(statsSection);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Efecto parallax para la sección hero
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const floatingCard = document.querySelector('.floating-card');
    if (hero) {
        const scrollPosition = window.scrollY;
        floatingCard.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
});

// Función para copiar email al portapapeles
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        alert('Email copiado al portapapeles');
    });
}

// Evento de carga de página
window.addEventListener('load', () => {
    console.log('Portafolio cargado exitosamente');
    // Aquí puedes agregar más lógica de inicialización
});

// Prevenir envío de formulario en navegacion
contactForm.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        contactForm.dispatchEvent(new Event('submit'));
    }
});
