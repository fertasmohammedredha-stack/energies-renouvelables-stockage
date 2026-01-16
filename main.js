/* ============================================
   MAIN.JS - Script JavaScript principal
   Projet : Énergies Renouvelables & Stockage
   ============================================ */

// ====== INITIALISATION AU CHARGEMENT DE LA PAGE ======
document.addEventListener('DOMContentLoaded', function () {

    // Initialiser le menu mobile
    initMobileMenu();

    // Initialiser le slider de la page d'accueil
    if (document.getElementById('imageSlider')) {
        initSlider('imageSlider', 'sliderIndicators');
    }

    // Initialiser le slider de la page pollution
    if (document.getElementById('pollutionSlider')) {
        initSlider('pollutionSlider', 'pollutionSliderIndicators');
    }

    // Mettre à jour le lien actif dans la navigation
    updateActiveNavLink();

    // Animation au scroll pour les sections
    initScrollAnimations();

    // Smooth scroll pour les liens internes
    initSmoothScroll();
});


// ====== MENU MOBILE ======
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!mobileMenuToggle || !navMenu) return;

    // Toggle du menu mobile
    mobileMenuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });

    // Fermer le menu si on clique en dehors
    document.addEventListener('click', function (event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}


// ====== SLIDER UNIVERSEL (fonctionne pour tous les sliders) ======
function initSlider(sliderId, indicatorsId) {
    const slider = document.getElementById(sliderId);
    const slides = slider.querySelectorAll('.slide');
    const indicatorsContainer = document.getElementById(indicatorsId);

    let currentSlide = 0;
    const slideInterval = 4000; // 4 secondes
    let intervalId;

    // Créer les indicateurs
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');

        // Clic sur un indicateur pour changer de slide
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });

        indicatorsContainer.appendChild(indicator);
    });

    const indicators = indicatorsContainer.querySelectorAll('.indicator');

    // Fonction pour aller à une slide spécifique
    function goToSlide(slideIndex) {
        // Retirer la classe active de toutes les slides
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Ajouter la classe active à la slide et l'indicateur actuel
        slides[slideIndex].classList.add('active');
        indicators[slideIndex].classList.add('active');

        currentSlide = slideIndex;
    }

    // Fonction pour passer à la slide suivante
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }

    // Fonction pour réinitialiser l'intervalle
    function resetInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(nextSlide, slideInterval);
    }

    // Démarrer le slider automatique
    intervalId = setInterval(nextSlide, slideInterval);

    // Pause au survol du slider
    slider.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
    });

    slider.addEventListener('mouseleave', () => {
        resetInterval();
    });
}


// ====== MISE À JOUR DU LIEN ACTIF DANS LA NAVIGATION ======
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Retirer la classe active de tous les liens
        link.classList.remove('active');

        // Ajouter la classe active au lien correspondant à la page actuelle
        if (href === currentPage ||
            (currentPage === '' && href === 'index.html') ||
            (currentPage === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}


// ====== ANIMATIONS AU SCROLL ======
function initScrollAnimations() {
    // Observer pour détecter les éléments qui entrent dans le viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Sélectionner les éléments à animer
    const elementsToAnimate = document.querySelectorAll(
        '.content-section, .energy-section, .storage-section, .case-study-section, .comparison-table, .stat-card'
    );

    // Appliquer les styles initiaux et observer
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}


// ====== SMOOTH SCROLL POUR LES LIENS INTERNES ======
function initSmoothScroll() {
    // Sélectionner tous les liens qui pointent vers des ancres
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Si c'est juste "#", ne rien faire
            if (targetId === '#') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                // Calculer la position en tenant compte du header sticky
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                // Scroll smooth vers l'élément
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


// ====== FONCTION UTILITAIRE : DEBOUNCE ======
// Utilisée pour optimiser les événements qui se déclenchent fréquemment (scroll, resize)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


// ====== GESTION DU REDIMENSIONNEMENT DE LA FENÊTRE ======
window.addEventListener('resize', debounce(() => {
    // Fermer le menu mobile si on passe en mode desktop
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('navMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');

        if (navMenu && mobileMenuToggle) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }
}, 250));


// ====== AFFICHAGE D'UN MESSAGE DE CHARGEMENT (OPTIONNEL) ======
// Cette fonction peut être utilisée pour afficher un message pendant le chargement de contenu
function showLoadingMessage(element, message = 'Chargement en cours...') {
    if (!element) return;

    element.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
            <div style="margin-bottom: 1rem;">⏳</div>
            <p>${message}</p>
        </div>
    `;
}


// ====== GESTION DES ERREURS GLOBALES (OPTIONNEL) ======
// Pour un environnement de développement, afficher les erreurs dans la console
window.addEventListener('error', function (event) {
    console.error('Erreur détectée:', event.error);
});


// ====== AMÉLIORATION DE L'ACCESSIBILITÉ ======
// Ajouter des attributs ARIA dynamiquement si nécessaire
document.addEventListener('DOMContentLoaded', function () {
    // S'assurer que tous les boutons ont des labels appropriés
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
});


// ====== DÉTECTION DU MODE SOMBRE (PRÉPARATION FUTURE) ======
// Cette fonction peut être utilisée plus tard pour implémenter un mode sombre
function detectColorScheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}


// ====== FONCTION POUR ANIMER LES COMPTEURS (OPTIONNEL) ======
// Cette fonction peut être utilisée pour animer les statistiques numériques
function animateCounter(element, target, duration = 2000) {
    if (!element) return;

    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}


// ====== LOG DE DÉMARRAGE ======
console.log('Site Énergies Renouvelables & Stockage - Chargé avec succès ✓');
console.log('Tous les scripts JavaScript sont opérationnels.');