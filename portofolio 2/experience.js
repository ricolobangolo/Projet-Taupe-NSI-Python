// Script JavaScript pour les animations et le tri de la page d'expérience

document.addEventListener('DOMContentLoaded', function() {
    // Référence au sélecteur de tri
    const sortSelect = document.getElementById('sort-experiences');
    
    // Fonction pour trier les expériences
    function sortExperiences(order) {
        // Sélectionner toutes les sections d'expérience
        const sections = document.querySelectorAll('.experience-section');
        
        // Ajouter une classe pour l'animation de transition
        document.querySelector('main').classList.add('sorting');
        
        // Petit délai pour permettre l'animation de démarrer
        setTimeout(() => {
            sections.forEach(section => {
                // Sélectionner toutes les cartes d'expérience dans cette section
                const cards = Array.from(section.querySelectorAll('.experience-card, .experience-item'));
                
                // Vérifier si les cartes ont des éléments de date
                if (cards.length > 0) {
                    // Trier les cartes en fonction de la date
                    cards.sort((a, b) => {
                        const dateElementA = a.querySelector('.date');
                        const dateElementB = b.querySelector('.date');
                        
                        // Vérifier si les éléments de date existent
                        if (!dateElementA || !dateElementB) {
                            console.error('Élément de date manquant dans une carte d\'expérience');
                            return 0;
                        }
                        
                        const dateA = dateElementA.textContent;
                        const dateB = dateElementB.textContent;
                        
                        // Extraire les années des dates
                        const yearA = extractYear(dateA);
                        const yearB = extractYear(dateB);
                        
                        // Trier selon l'ordre sélectionné
                        if (order === 'newest') {
                            return yearB - yearA;
                        } else {
                            return yearA - yearB;
                        }
                    });
                    
                    // Supprimer toutes les cartes actuelles
                    cards.forEach(card => card.remove());
                    
                    // Réinsérer les cartes dans l'ordre trié
                    cards.forEach(card => {
                        section.appendChild(card);
                    });
                }
            });
            
            // Retirer la classe d'animation après un court délai
            setTimeout(() => {
                document.querySelector('main').classList.remove('sorting');
            }, 300);
            
            console.log('Expériences triées par: ' + order);
        }, 100);
    }
    
    // Fonction pour extraire l'année d'une chaîne de date
    function extractYear(dateString) {
        // Si la date contient un intervalle (ex: "2021-2022"), prendre l'année la plus récente
        const rangeMatch = dateString.match(/(\d{4})-(\d{4})/);
        if (rangeMatch) {
            return Math.max(parseInt(rangeMatch[1]), parseInt(rangeMatch[2]));
        }
        
        // Rechercher une année simple au format "YYYY"
        const yearMatch = dateString.match(/(\d{4})/);
        if (yearMatch) {
            return parseInt(yearMatch[1]);
        }
        
        // Si "Aujourd'hui" est présent, utiliser l'année actuelle
        if (dateString.includes('Aujourd\'hui')) {
            return new Date().getFullYear();
        }
        
        return 0; // Valeur par défaut
    }
    
    // Écouter les changements sur le sélecteur de tri
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortExperiences(this.value);
        });
        
        // Tri initial (plus récent au plus ancien par défaut)
        sortSelect.value = 'newest'; // S'assurer que l'option est sélectionnée dans le menu déroulant
        sortExperiences('newest');
    }
    
    // Fonction pour vérifier si un élément est visible dans la fenêtre
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Fonction pour animer les éléments lorsqu'ils deviennent visibles
    function animateOnScroll() {
        const cards = document.querySelectorAll('.experience-card');
        
        cards.forEach(card => {
            if (isElementInViewport(card) && !card.classList.contains('animated')) {
                card.classList.add('animated');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }

    // Ajouter des effets interactifs aux cartes d'expérience
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
        // Réinitialiser l'animation pour permettre l'animation au défilement
        card.style.animationName = 'none';
        
        // Ajouter des effets de survol avancés
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 20px rgba(0, 123, 255, 0.2)';
            
            // Animation spéciale pour les cartes de bénévolat
            if (this.classList.contains('volunteer')) {
                this.style.boxShadow = '0 8px 20px rgba(40, 167, 69, 0.2)';
            }
            
            // Animer les éléments à l'intérieur de la carte
            const title = this.querySelector('h3');
            if (title) title.style.transform = 'translateX(5px)';
            
            const listItems = this.querySelectorAll('li');
            listItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateX(5px)';
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            
            // Réinitialiser les animations internes
            const title = this.querySelector('h3');
            if (title) title.style.transform = '';
            
            const listItems = this.querySelectorAll('li');
            listItems.forEach(item => {
                item.style.transform = '';
            });
        });
    });
    
    // Exécuter l'animation au chargement initial
    animateOnScroll();
    
    // Exécuter l'animation lors du défilement
    window.addEventListener('scroll', animateOnScroll);
});