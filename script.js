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
            'Disponible para nuevos desafíos',
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

    // ---- MARQUEE PAUSE ON HOVER ----
    const marquee = document.querySelector('.marquee');
    if (marquee) {
        marquee.addEventListener('mouseenter', () => {
            marquee.querySelectorAll('.marquee__row').forEach(row => row.style.animationPlayState = 'paused');
        });
        marquee.addEventListener('mouseleave', () => {
            marquee.querySelectorAll('.marquee__row').forEach(row => row.style.animationPlayState = 'running');
        });
    }

    // ---- PROJECT GALLERY LIGHTBOX ----
    const galleryItems = Array.from(document.querySelectorAll('.gallery__item'));
    const lightbox = document.getElementById('lightbox');

    if (galleryItems.length && lightbox) {
        const stage = document.getElementById('lightbox-stage');
        const image = document.getElementById('lightbox-img');
        const counter = document.getElementById('lightbox-counter');
        const caption = document.getElementById('lightbox-caption');
        const zoomButton = document.getElementById('lightbox-zoom');
        const closeButton = document.getElementById('lightbox-close');
        const prevButton = document.getElementById('lightbox-prev');
        const nextButton = document.getElementById('lightbox-next');
        const focusables = [closeButton, zoomButton, prevButton, nextButton];

        const total = galleryItems.length;
        let currentIndex = 0;
        let lastFocused = null;

        const pad = value => String(value).padStart(2, '0');

        const setZoom = (zoomed) => {
            lightbox.classList.toggle('is-zoomed', zoomed);
            zoomButton.setAttribute('aria-pressed', String(zoomed));
            zoomButton.setAttribute('aria-label', zoomed ? 'Ajustar imagen a la pantalla' : 'Ver imagen en tamaño real');
            zoomButton.innerHTML = zoomed
                ? '<i class="fa-solid fa-magnifying-glass-minus" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i>';
            stage.scrollTop = 0;
            stage.scrollLeft = 0;
        };

        const preload = (index) => {
            const source = galleryItems[(index + total) % total].dataset.full;
            if (source) {
                const preloadImage = new Image();
                preloadImage.src = source;
            }
        };

        const render = () => {
            const item = galleryItems[currentIndex];
            const thumbnail = item.querySelector('img');
            const source = item.dataset.full;

            image.src = source;
            image.alt = thumbnail ? thumbnail.alt : '';
            counter.textContent = `${pad(currentIndex + 1)} / ${pad(total)}`;
            caption.textContent = item.dataset.caption || '';
            setZoom(false);
            preload(currentIndex + 1);
            preload(currentIndex - 1);
        };

        const openLightbox = (index) => {
            lastFocused = document.activeElement;
            currentIndex = index;
            render();
            lightbox.hidden = false;
            document.body.classList.add('lightbox-open');
            closeButton.focus();
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.classList.remove('lightbox-open');
            setZoom(false);
            if (lastFocused && document.contains(lastFocused)) {
                lastFocused.focus();
            }
            lastFocused = null;
        };

        const goTo = (step) => {
            currentIndex = (currentIndex + step + total) % total;
            render();
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        closeButton.addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', () => goTo(-1));
        nextButton.addEventListener('click', () => goTo(1));
        zoomButton.addEventListener('click', () => setZoom(!lightbox.classList.contains('is-zoomed')));
        image.addEventListener('click', () => setZoom(!lightbox.classList.contains('is-zoomed')));

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox || event.target === stage) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (lightbox.hidden) return;

            if (event.key === 'Escape') {
                closeLightbox();
                return;
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goTo(-1);
                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                goTo(1);
                return;
            }

            if (event.key === 'Tab') {
                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    }

    // ---- REDUCED MOTION ----
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        const rows = document.querySelectorAll('.marquee__row');
        rows.forEach(row => row.style.animation = 'none');
    }

})();
