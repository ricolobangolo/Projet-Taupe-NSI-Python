class AdminPanel {
    constructor() {
        this.checkAuth();
        this.initializeEventListeners();
        this.loadQuestions();
    }

    checkAuth() {
        if (localStorage.getItem('isAdmin') !== 'true') {
            window.location.href = 'quiz-site.html';
        }
    }

    initializeEventListeners() {
        // Gestion de la déconnexion
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logoutAdmin();
        });

        // Gestion du formulaire de question
        document.getElementById('questionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveQuestion();
        });

        // Gestion de l'ajout de catégorie
        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            this.addNewCategory();
        });
    }

    logoutAdmin() {
        localStorage.removeItem('isAdmin');
        window.location.href = 'quiz-site.html';
    }

    loadQuestions() {
        const questions = this.getAllQuestions();
        const tbody = document.getElementById('questionsList');
        tbody.innerHTML = '';

        Object.entries(questions).forEach(([category, categoryQuestions]) => {
            categoryQuestions.forEach((question, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${question.question}</td>
                    <td>${category}</td>
                    <td>
                        <button class="btn btn-sm btn-primary me-2" onclick="adminPanel.editQuestion('${category}', ${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteQuestion('${category}', ${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });

        this.updateStats();
    }

    getAllQuestions() {
        return JSON.parse(localStorage.getItem('quizDatabase')) || quizDatabase;
    }

    saveQuestion() {
        const category = document.getElementById('categorySelect').value;
        const questionText = document.getElementById('questionText').value;
        const options = Array.from(document.querySelectorAll('.option-group input')).map(input => input.value);
        const correct = parseInt(document.getElementById('correctAnswer').value);
        const explanation = document.getElementById('explanation').value;

        const questions = this.getAllQuestions();
        
        if (!questions[category]) {
            questions[category] = [];
        }

        const newQuestion = {
            question: questionText,
            options: options,
            correct: correct,
            explanation: explanation
        };

        const editIndex = document.getElementById('questionForm').dataset.editIndex;
        if (editIndex) {
            questions[category][parseInt(editIndex)] = newQuestion;
        } else {
            questions[category].push(newQuestion);
        }

        localStorage.setItem('quizDatabase', JSON.stringify(questions));
        
        document.getElementById('questionForm').reset();
        delete document.getElementById('questionForm').dataset.editIndex;
        
        this.loadQuestions();
        this.showAlert('Question enregistrée avec succès !', 'success');
    }

    editQuestion(category, index) {
        const questions = this.getAllQuestions();
        const question = questions[category][index];

        document.getElementById('categorySelect').value = category;
        document.getElementById('questionText').value = question.question;
        document.getElementById('correctAnswer').value = question.correct;
        document.getElementById('explanation').value = question.explanation;

        const optionInputs = document.querySelectorAll('.option-group input');
        question.options.forEach((option, i) => {
            optionInputs[i].value = option;
        });

        document.getElementById('questionForm').dataset.editIndex = index;
        document.querySelector('.quiz-editor').scrollIntoView({ behavior: 'smooth' });
    }

    deleteQuestion(category, index) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
            const questions = this.getAllQuestions();
            questions[category].splice(index, 1);
            localStorage.setItem('quizDatabase', JSON.stringify(questions));
            this.loadQuestions();
            this.showAlert('Question supprimée !', 'warning');
        }
    }

    addNewCategory() {
        const categoryName = prompt('Nom de la nouvelle catégorie :');
        if (categoryName) {
            const questions = this.getAllQuestions();
            if (!questions[categoryName]) {
                questions[categoryName] = [];
                localStorage.setItem('quizDatabase', JSON.stringify(questions));
                
                const option = document.createElement('option');
                option.value = categoryName;
                option.textContent = categoryName;
                document.getElementById('categorySelect').appendChild(option);
                
                this.showAlert('Nouvelle catégorie ajoutée !', 'success');
            } else {
                this.showAlert('Cette catégorie existe déjà !', 'danger');
            }
        }
    }

    updateStats() {
        const questions = this.getAllQuestions();
        const totalQuizzes = Object.keys(questions).length;
        const totalQuestions = Object.values(questions).reduce((acc, curr) => acc + curr.length, 0);

        document.getElementById('totalQuizzes').textContent = totalQuizzes;
        document.getElementById('totalQuestions').textContent = totalQuestions;
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.querySelector('.admin-dashboard').insertAdjacentElement('afterbegin', alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
}

// Initialiser le panneau d'administration
const adminPanel = new AdminPanel();