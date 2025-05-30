// Animation d'introduction inspirée du site Astroshock
document.addEventListener('DOMContentLoaded', () => {
    // S'assurer que le contenu est visible dès le début
    document.body.style.visibility = 'visible';
    // Créer l'overlay d'animation
    const createAnimationOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'intro-animation-overlay';
        
        // Créer le conteneur du texte d'animation
        const textContainer = document.createElement('div');
        textContainer.className = 'intro-text-container';
        
        // Ajouter le texte principal
        const mainText = document.createElement('div');
        mainText.className = 'intro-main-text';
        mainText.innerHTML = '<span>Portfolio</span>';
        
        // Ajouter le sous-texte
        const subText = document.createElement('div');
        subText.className = 'intro-sub-text';
        subText.innerHTML = '<span>Adem HOUIDI</span>';
        
        // Assembler les éléments
        textContainer.appendChild(mainText);
        textContainer.appendChild(subText);
        overlay.appendChild(textContainer);
        document.body.appendChild(overlay);
        
        return { overlay, textContainer, mainText, subText };
    };
    
    // Exécuter l'animation
    const runIntroAnimation = () => {
        // Vérifier si l'animation a déjà été jouée dans cette session
        if (sessionStorage.getItem('introAnimationPlayed')) {
            // Si l'animation a déjà été jouée, animer directement les éléments de la page
            animatePageElements();
            return;
        }
        
        // Créer l'overlay et les éléments d'animation
        const { overlay, textContainer, mainText, subText } = createAnimationOverlay();
        
        // Désactiver le défilement pendant l'animation
        document.body.style.overflow = 'hidden';
        
        // Séquence d'animation
        setTimeout(() => {
            // Afficher le texte principal avec un effet de fondu
            mainText.classList.add('animate-in');
            
            setTimeout(() => {
                // Afficher le sous-texte avec un effet de fondu
                subText.classList.add('animate-in');
                
                setTimeout(() => {
                    // Transition de sortie
                    textContainer.classList.add('animate-out');
                    
                    setTimeout(() => {
                        // Faire disparaître l'overlay
                        overlay.classList.add('fade-out');
                        
                        setTimeout(() => {
                            // Supprimer l'overlay et réactiver le défilement
                            overlay.remove();
                            document.body.style.overflow = '';
                            
                            // Marquer l'animation comme jouée dans cette session
                            sessionStorage.setItem('introAnimationPlayed', 'true');
                            
                            // Animer les éléments de la page après l'intro
                            animatePageElements();
                        }, 800);
                    }, 600);
                }, 1200);
            }, 800);
        }, 400);
    };
    
    // Animer les éléments de la page après l'animation d'intro
    const animatePageElements = () => {
        // Sélectionner tous les éléments avec des classes d'animation existantes
        const animatedElements = document.querySelectorAll(
            '.animate-fade-in, .animate-slide-up, .animate-slide-up-delay, ' +
            '.animate-fade-in-delay, .animate-fade-in-up, .animate-cards, ' +
            '.hero-content'
        );
        
        // Ajouter la classe 'animated' pour déclencher les animations
        animatedElements.forEach(element => {
            element.classList.add('animated');
        });
        
        // S'assurer que le contenu est visible
        document.body.style.visibility = 'visible';
    };
    
    // Lancer l'animation d'introduction
    runIntroAnimation();
});