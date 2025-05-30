// Animations avancées pour la page des projets
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'animation d'introduction soit terminée
    const initProjectAnimations = () => {
        // Animation des éléments au défilement
        const observeElements = () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            // Observer les cartes de projets
            document.querySelectorAll('.project-card').forEach(card => {
                observer.observe(card);
            });
            
            // Observer les titres et textes
            document.querySelectorAll('.projects h2, .section-intro').forEach(element => {
                observer.observe(element);
            });
        };
        
        // Effet de parallaxe léger sur les cartes au mouvement de la souris
        const addParallaxEffect = () => {
            const cards = document.querySelectorAll('.project-card');
            
            document.addEventListener('mousemove', (e) => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    
                    // Vérifier si la carte est visible à l'écran
                    if (
                        rect.top < window.innerHeight &&
                        rect.bottom > 0 &&
                        rect.left < window.innerWidth &&
                        rect.right > 0
                    ) {
                        const offsetX = (x - 0.5) * 10;
                        const offsetY = (y - 0.5) * 10;
                        
                        card.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px)`;
                    }
                });
            });
            
            // Réinitialiser la position lors de la sortie
            cards.forEach(card => {
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });
        };
        
        // Animation des badges de technologie
        const animateTechBadges = () => {
            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    const badges = card.querySelectorAll('.tech-stack span');
                    badges.forEach((badge, index) => {
                        setTimeout(() => {
                            badge.classList.add('badge-animated');
                        }, index * 100);
                    });
                });
                
                card.addEventListener('mouseleave', () => {
                    const badges = card.querySelectorAll('.tech-stack span');
                    badges.forEach(badge => {
                        badge.classList.remove('badge-animated');
                    });
                });
            });
        };
        
        // Effet de focus sur la recherche
        const enhanceSearchInteraction = () => {
            const searchBox = document.querySelector('.search-box');
            const searchInput = document.getElementById('projectSearch');
            
            if (searchBox && searchInput) {
                searchInput.addEventListener('focus', () => {
                    searchBox.classList.add('search-focused');
                });
                
                searchInput.addEventListener('blur', () => {
                    searchBox.classList.remove('search-focused');
                });
            }
        };
        
        // Initialiser toutes les animations
        observeElements();
        animateTechBadges();
        enhanceSearchInteraction();
        
        // Ajouter l'effet de parallaxe seulement sur les grands écrans
        if (window.innerWidth > 768) {
            addParallaxEffect();
        }
    };
    
    // Vérifier si l'animation d'intro est déjà jouée
    if (sessionStorage.getItem('introAnimationPlayed')) {
        // Si l'animation a déjà été jouée, initialiser directement
        initProjectAnimations();
    } else {
        // Sinon, attendre que l'animation d'intro soit terminée
        const checkIntroStatus = setInterval(() => {
            if (sessionStorage.getItem('introAnimationPlayed')) {
                clearInterval(checkIntroStatus);
                initProjectAnimations();
            }
        }, 500);
        
        // Fallback au cas où l'animation d'intro ne se termine pas
        setTimeout(() => {
            clearInterval(checkIntroStatus);
            initProjectAnimations();
        }, 5000);
    }
});