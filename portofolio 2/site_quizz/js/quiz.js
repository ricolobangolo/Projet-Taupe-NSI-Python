class Quiz {
    constructor(category) {
        this.category = category;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 0;
        this.initQuiz();
    }

    async initQuiz() {
        await this.loadQuestions();
        this.displayQuestion();
        this.startTimer();
    }

    async loadQuestions() {
        // Charger les questions depuis le localStorage
        const allQuestions = JSON.parse(localStorage.getItem('quizDatabase')) || quizDatabase;
        this.questions = allQuestions[this.category] || [];
        this.questions = this.shuffleArray(this.questions);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        if (!question) return;

        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.innerHTML = `
            <div class="progress mb-3">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>Question ${this.currentQuestionIndex + 1}/${this.questions.length}</h4>
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
        `;

        // Ajouter les écouteurs d'événements pour les réponses
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
            if (timerDisplay) {
                timerDisplay.textContent = this.timeLeft;
                if (this.timeLeft <= 10) {
                    timerDisplay.classList.add('text-danger');
                }
            }
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleAnswer(-1); // Temps écoulé
            }
        }, 1000);
    }

    handleAnswer(selectedIndex) {
        clearInterval(this.timer);
        const question = this.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.answer-option');

        // Désactiver tous les boutons
        options.forEach(option => option.disabled = true);

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
        explanationDiv.innerHTML = `
            <strong>${selectedIndex === question.correct ? 'Correct !' : 'Incorrect.'}</strong><br>
            ${question.explanation}
        `;
        document.querySelector('.question-card').appendChild(explanationDiv);

        // Passer à la question suivante après un délai
        setTimeout(() => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.questions.length) {
                this.displayQuestion();
                this.startTimer();
            } else {
                this.showResults();
            }
        }, 2000);
    }

    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const quizContainer = document.querySelector('.quiz-container');
        
        quizContainer.innerHTML = `
            <div class="score-container text-center">
                <div class="score-circle mb-4">
                    ${percentage}%
                </div>
                <h2 class="mb-4">Quiz terminé !</h2>
                <p class="mb-4">Vous avez obtenu ${this.score} sur ${this.questions.length} questions.</p>
                
                <div class="result-message mb-4">
                    ${this.getResultMessage(percentage)}
                </div>
                
                <div class="buttons">
                    <button class="btn btn-primary me-2" onclick="location.reload()">
                        Recommencer
                    </button>
                    <button class="btn btn-secondary" onclick="window.location.href='quiz-site.html'">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        `;

        // Sauvegarder le score
        this.saveScore(percentage);
    }

    getResultMessage(percentage) {
        if (percentage >= 90) return 'Excellent ! Vous êtes un expert !';
        if (percentage >= 75) return 'Très bien ! Vous maîtrisez le sujet.';
        if (percentage >= 50) return 'Pas mal ! Continuez à pratiquer.';
        return 'Vous pouvez vous améliorer. Continuez vos efforts !';
    }

    saveScore(percentage) {
        const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
        scores.push({
            category: this.category,
            score: percentage,
            date: new Date().toISOString()
        });
        localStorage.setItem('quizScores', JSON.stringify(scores));
    }
}

// Initialiser le quiz quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        new Quiz(category);
    } else {
        window.location.href = 'quiz-site.html';
    }
});