// ==========================================================
// Giovanny Garzón — Terminal Personal Portfolio
// ==========================================================

(function () {
    'use strict';

    // ---- MOBILE NAV ----
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close nav on link click
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // ---- HEADER SCROLL STATE ----
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });

    // ---- ACTIVE NAV LINK ----
    const sections = document.querySelectorAll('.hero, .section');
    const navLinks = document.querySelectorAll('.nav__link');

    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // ---- SCROLL REVEAL (IntersectionObserver) ----
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: show everything
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ---- TYPING EFFECT ----
    const typingEl = document.getElementById('typing');
    if (typingEl) {
        const phrases = [
            'Fullstack Developer',
            'Vue.js / Laravel',
            'TypeScript',
            'Construyo soluciones digitales'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeout;

        const type = () => {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentPhrase.length) {
                speed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                speed = 400; // Pause before next phrase
            }

            timeout = setTimeout(type, speed);
        };

        // Start typing after a short delay
        setTimeout(type, 800);
    }

})();
