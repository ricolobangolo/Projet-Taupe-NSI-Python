class Leaderboard {
    constructor() {
        this.scores = [];
        this.currentCategory = 'all';
        this.initializeEventListeners();
        this.loadScores();
    }

    initializeEventListeners() {
        // Gestion des onglets de catégorie
        document.getElementById('categoryTabs').addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.displayScores();
            }
        });

        // Vérification du statut admin
        if (localStorage.getItem('isAdmin') === 'true') {
            document.getElementById('adminBtn').classList.remove('d-none');
        }
    }

    loadScores() {
        // Charger les scores depuis le localStorage
        this.scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
        
        // Ajouter des scores de démonstration si aucun score n'existe
        if (this.scores.length === 0) {
            this.addDemoScores();
        }

        this.displayScores();
    }

    addDemoScores() {
        const demoScores = [
            { category: 'informatique', score: 90, date: '2025-04-15T10:30:00.000Z' },
            { category: 'mathematiques', score: 85, date: '2025-04-15T11:00:00.000Z' },
            { category: 'culture', score: 95, date: '2025-04-15T11:30:00.000Z' },
            { category: 'informatique', score: 80, date: '2025-04-15T12:00:00.000Z' },
            { category: 'mathematiques', score: 75, date: '2025-04-15T12:30:00.000Z' }
        ];

        this.scores = demoScores;
        localStorage.setItem('quizScores', JSON.stringify(this.scores));
    }

    displayScores() {
        const tbody = document.getElementById('leaderboardBody');
        tbody.innerHTML = '';

        // Filtrer les scores par catégorie si nécessaire
        let filteredScores = this.scores;
        if (this.currentCategory !== 'all') {
            filteredScores = this.scores.filter(score => score.category === this.currentCategory);
        }

        // Trier les scores par ordre décroissant
        filteredScores.sort((a, b) => b.score - a.score);

        // Afficher les scores
        filteredScores.forEach((score, index) => {
            const tr = document.createElement('tr');
            const date = new Date(score.date);
            
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <span class="badge ${this.getScoreBadgeClass(score.score)}">
                        ${score.score}%
                    </span>
                </td>
                <td>${this.formatCategory(score.category)}</td>
                <td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td>
            `;
            
            tbody.appendChild(tr);
        });

        // Afficher un message si aucun score
        if (filteredScores.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">
                        Aucun score disponible pour cette catégorie
                    </td>
                </tr>
            `;
        }
    }

    getScoreBadgeClass(score) {
        if (score >= 90) return 'bg-success';
        if (score >= 75) return 'bg-primary';
        if (score >= 50) return 'bg-warning';
        return 'bg-danger';
    }

    formatCategory(category) {
        const categories = {
            'informatique': 'Informatique',
            'mathematiques': 'Mathématiques',
            'culture': 'Culture Générale'
        };
        return categories[category] || category;
    }
}

// Initialiser le tableau de classement
document.addEventListener('DOMContentLoaded', () => {
    new Leaderboard();
});