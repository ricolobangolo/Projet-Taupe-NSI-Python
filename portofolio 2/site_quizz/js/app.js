// Base de données des questions (à remplacer par une vraie base de données)
const quizDatabase = {
    informatique: [
        {
            question: "Quel langage est principalement utilisé pour le style des pages web ?",
            options: ["HTML", "CSS", "JavaScript", "PHP"],
            correct: 1,
            explanation: "CSS (Cascading Style Sheets) est le langage utilisé pour définir le style des pages web."
        },
        {
            question: "Que signifie HTML ?",
            options: [
                "HyperText Markup Language",
                "High Tech Modern Language",
                "HyperText Modern Links",
                "High Tech Markup Language"
            ],
            correct: 0,
            explanation: "HTML signifie HyperText Markup Language, c'est le langage standard pour créer des pages web."
        }
    ],
    mathematiques: [
        {
            question: "Quelle est la racine carrée de 144 ?",
            options: ["10", "12", "14", "16"],
            correct: 1,
            explanation: "12 × 12 = 144, donc la racine carrée de 144 est 12."
        },
        {
            question: "Quel est le résultat de 8 + 4 × 2 ?",
            options: ["16", "24", "12", "20"],
            correct: 0,
            explanation: "La multiplication est prioritaire : 4 × 2 = 8, puis 8 + 8 = 16."
        }
    ],
    culture: [
        {
            question: "Quelle est la capitale de la France ?",
            options: ["Londres", "Berlin", "Paris", "Madrid"],
            correct: 2,
            explanation: "Paris est la capitale de la France."
        },
        {
            question: "Qui a peint la Joconde ?",
            options: ["Van Gogh", "Picasso", "Michel-Ange", "Léonard de Vinci"],
            correct: 3,
            explanation: "La Joconde a été peinte par Léonard de Vinci entre 1503 et 1519."
        }
    ]
};

class QuizApp {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 0;
        
        this.initializeApp();
    }

    initializeApp() {
        // Écouteurs d'événements pour les catégories
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.startQuiz(category);
            });
        });

        // Écouteur pour le formulaire de connexion
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Vérifier si l'utilisateur est admin
        this.checkAdminStatus();
    }

    startQuiz(category) {
        this.currentQuiz = quizDatabase[category];
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 30; // 30 secondes par question
        
        this.showQuestion();
        this.startTimer();
    }

    showQuestion() {
        const question = this.currentQuiz[this.currentQuestion];
        const mainContainer = document.querySelector('main');
        
        const progress = ((this.currentQuestion + 1) / this.currentQuiz.length) * 100;
        
        mainContainer.innerHTML = `
            <div class="quiz-container">
                <div class="progress">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4>Question ${this.currentQuestion + 1}/${this.currentQuiz.length}</h4>
                    <div class="timer">30</div>
                </div>
                <div class="question-card">
                    <h3 class="mb-4">${question.question}</h3>
                    <div class="options">
                        ${question.options.map((option, index) => `
                            <button class="answer-option" data-index="${index}">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Ajout des écouteurs pour les réponses
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleAnswer(parseInt(e.target.dataset.index)));
        });
    }

    startTimer() {
        clearInterval(this.timer);
        this.timeLeft = 30;
        
        const timerDisplay = document.querySelector('.timer');
        this.timer = setInterval(() => {
            this.timeLeft--;
            if (timerDisplay) timerDisplay.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleAnswer(-1); // Temps écoulé
            }
        }, 1000);
    }

    handleAnswer(selectedIndex) {
        clearInterval(this.timer);
        const question = this.currentQuiz[this.currentQuestion];
        const options = document.querySelectorAll('.answer-option');

        // Marquer la bonne réponse et la réponse sélectionnée
        options[question.correct].classList.add('correct');
        if (selectedIndex !== -1) {
            options[selectedIndex].classList.add(selectedIndex === question.correct ? 'correct' : 'incorrect');
        }

        // Mettre à jour le score
        if (selectedIndex === question.correct) {
            this.score++;
        }

        // Afficher l'explication
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'alert alert-info mt-3';
        explanationDiv.textContent = question.explanation;
        document.querySelector('.question-card').appendChild(explanationDiv);

        // Passer à la question suivante après un délai
        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.currentQuiz.length) {
                this.showQuestion();
                this.startTimer();
            } else {
                this.showResults();
            }
        }, 2000);
    }

    showResults() {
        const mainContainer = document.querySelector('main');
        const percentage = (this.score / this.currentQuiz.length) * 100;
        
        mainContainer.innerHTML = `
            <div class="score-container">
                <div class="score-circle">
                    ${percentage}%
                </div>
                <h2>Quiz terminé !</h2>
                <p>Vous avez obtenu ${this.score} sur ${this.currentQuiz.length} questions.</p>
                <button class="btn btn-primary" onclick="location.href='quiz-site.html'">
                    Retour à l'accueil
                </button>
            </div>
        `;

        // Sauvegarder le score
        this.saveScore(percentage);
    }

    saveScore(percentage) {
        const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
        scores.push({
            date: new Date().toISOString(),
            score: percentage,
            total: this.currentQuiz.length
        });
        localStorage.setItem('quizScores', JSON.stringify(scores));
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simuler une authentification (à remplacer par une vraie authentification)
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
            this.checkAdminStatus();
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        } else {
            alert('Identifiants incorrects');
        }
    }

    checkAdminStatus() {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const adminBtn = document.getElementById('adminBtn');
        
        if (isAdmin && adminBtn) {
            adminBtn.classList.remove('d-none');
            adminBtn.addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        }
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});