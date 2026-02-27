// Financial Literacy Challenge Game
class FinancialLiteracyGame {
    constructor() {
        this.score = 0;
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.correctAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.selectedAnswer = null;
        this.gameCompleted = false;
        
        this.questions = [
            {
                title: "Budgeting Basics",
                text: "Your monthly income is $3,000. Rent is $1,200, groceries cost $400, utilities are $150, transportation is $200, and entertainment is $300. What percentage of income are you saving?",
                options: [
                    { text: "15% ($450)", correct: false, explanation: "That's less than actual savings." },
                    { text: "18.3% ($550)", correct: false, explanation: "Close but not exact calculation." },
                    { text: "25% ($750)", correct: true, explanation: "Correct! $3,000 - ($1,200+$400+$150+$200+$300) = $750 = 25%." },
                    { text: "10% ($300)", correct: false, explanation: "This underestimates your savings." }
                ],
                hint: "Calculate total expenses first, then subtract from income.",
                category: "Budgeting",
                difficulty: "medium"
            },
            {
                title: "Emergency Fund Priority",
                text: "How much should you ideally have in an emergency savings fund?",
                options: [
                    { text: "1 month of expenses", correct: false, explanation: "This is a minimum starting point." },
                    { text: "3-6 months of expenses", correct: true, explanation: "Correct! This covers most emergencies." },
                    { text: "1 year of expenses", correct: false, explanation: "This might be excessive for most people." },
                    { text: "Whatever is left at month end", correct: false, explanation: "Emergency funds should be intentional." }
                ],
                hint: "Financial experts recommend several months of expenses.",
                category: "Saving",
                difficulty: "easy"
            },
            {
                title: "Credit Card Strategy",
                text: "You have two credit cards: Card A has $2,000 at 18% interest, Card B has $1,000 at 22% interest. You can pay $500 this month. What's the best strategy?",
                options: [
                    { text: "Pay $250 to each", correct: false, explanation: "This doesn't minimize interest costs." },
                    { text: "Pay $500 to Card B (22%)", correct: true, explanation: "Correct! Pay highest interest first saves money." },
                    { text: "Pay $500 to Card A (larger balance)", correct: false, explanation: "This 'snowball method' costs more interest." },
                    { text: "Save the $500", correct: false, explanation: "High-interest debt should be prioritized." }
                ],
                hint: "Consider which strategy saves the most on interest.",
                category: "Debt",
                difficulty: "hard"
            },
            {
                title: "Smart Grocery Shopping",
                text: "Which strategy saves the most money on groceries over time?",
                options: [
                    { text: "Always buy cheapest items", correct: false, explanation: "Cheapest isn't always best value." },
                    { text: "Buy in bulk for regular items", correct: true, explanation: "Correct! Bulk buying offers best value per use." },
                    { text: "Shop when hungry", correct: false, explanation: "This leads to impulse buys." },
                    { text: "Always buy name brands", correct: false, explanation: "Store brands offer similar quality for less." }
                ],
                hint: "Think about cost per meal, not just price.",
                category: "Shopping",
                difficulty: "easy"
            },
            {
                title: "Retirement Planning",
                text: "When should you start saving for retirement?",
                options: [
                    { text: "In your 40s", correct: false, explanation: "Starting late misses compound growth." },
                    { text: "As early as possible", correct: true, explanation: "Correct! Time is your biggest advantage." },
                    { text: "After paying all debt", correct: false, explanation: "You can save while managing debt." },
                    { text: "When you get a promotion", correct: false, explanation: "Don't delay - start with what you can." }
                ],
                hint: "The earlier you start, the more time your money grows.",
                category: "Future",
                difficulty: "easy"
            },
            {
                title: "Bank Account Fees",
                text: "Your bank charges $10 monthly fee unless you maintain $1,000 minimum balance. You usually keep $800. What should you do?",
                options: [
                    { text: "Pay the $10 fee", correct: false, explanation: "That's $120/year in fees." },
                    { text: "Switch to a no-fee bank", correct: true, explanation: "Correct! Many banks offer free accounts." },
                    { text: "Borrow $200 to reach minimum", correct: false, explanation: "Borrowing creates other costs." },
                    { text: "Keep cash at home", correct: false, explanation: "Keeping cash at home is risky." }
                ],
                hint: "Bank fees add up quickly. There are better options.",
                category: "Banking",
                difficulty: "medium"
            },
            {
                title: "Windfall Management",
                text: "You receive a $1,000 tax refund. What's the most financially responsible approach?",
                options: [
                    { text: "Spend it all", correct: false, explanation: "This doesn't improve financial health." },
                    { text: "Split: 50% save, 30% debt, 20% fun", correct: true, explanation: "Correct! Balanced approach addresses multiple needs." },
                    { text: "Invest all in risky stocks", correct: false, explanation: "Risky without emergency fund is dangerous." },
                    { text: "Save all for vacation", correct: false, explanation: "Prioritize emergencies and debt first." }
                ],
                hint: "A balanced approach often works best.",
                category: "Saving",
                difficulty: "medium"
            },
            {
                title: "Loan Decision",
                text: "You need $5,000. Option A: 3-year loan at 8% interest. Option B: 5-year loan at 6% interest. Which is better?",
                options: [
                    { text: "Option A - less total interest", correct: true, explanation: "Correct! Shorter term often saves interest." },
                    { text: "Option B - lower rate", correct: false, explanation: "Longer term means more interest paid." },
                    { text: "They're the same", correct: false, explanation: "There's significant difference." },
                    { text: "Depends on monthly payment", correct: true, explanation: "Also correct! Affordability matters too." }
                ],
                hint: "Calculate total repayment for each option.",
                category: "Debt",
                difficulty: "hard"
            },
            {
                title: "Sale Temptation",
                text: "Store has 'Buy 2, Get 1 Free' on $40 shirts. You need one shirt. What should you do?",
                options: [
                    { text: "Buy 3 to get 'free' one", correct: false, explanation: "You'd spend $80 but only needed one." },
                    { text: "Buy just one at $40", correct: true, explanation: "Correct! Spending $40 for what you need is better." },
                    { text: "Buy 3 and return 2", correct: false, explanation: "Stores refund proportional price in bundles." },
                    { text: "Wait for single item sale", correct: true, explanation: "Also good if not in immediate need." }
                ],
                hint: "A 'deal' isn't saving if you buy things you don't need.",
                category: "Shopping",
                difficulty: "medium"
            },
            {
                title: "Insurance Priority",
                text: "A 25-year-old with no dependents and $50,000 student loans. What insurance is most important?",
                options: [
                    { text: "Life insurance", correct: false, explanation: "Less critical with no dependents." },
                    { text: "Disability insurance", correct: true, explanation: "Correct! Protecting income is crucial." },
                    { text: "Long-term care insurance", correct: false, explanation: "Typically important later in life." },
                    { text: "Pet insurance", correct: false, explanation: "Not the most critical financial protection." }
                ],
                hint: "Consider what risks would be most devastating.",
                category: "Future",
                difficulty: "hard"
            }
        ];
        
        // Shuffle questions
        this.shuffleArray(this.questions);
        this.questions = this.questions.slice(0, this.totalQuestions);
        
        this.initializeGame();
    }
    
    initializeGame() {
        // DOM Elements
        this.scoreEl = document.getElementById('score');
        this.questionCountEl = document.getElementById('question-count');
        this.streakEl = document.getElementById('streak');
        this.questionNumberEl = document.getElementById('question-number');
        this.questionTitleEl = document.getElementById('question-title');
        this.questionTextEl = document.getElementById('question-text');
        this.optionsContainerEl = document.getElementById('options-container');
        this.hintBoxEl = document.getElementById('hint-box');
        this.hintTextEl = document.getElementById('hint-text');
        this.feedbackEl = document.getElementById('feedback');
        this.progressFillEl = document.getElementById('progress-fill');
        this.hintBtn = document.getElementById('hint-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.gameScreenEl = document.getElementById('game-screen');
        this.resultScreenEl = document.getElementById('result-screen');
        this.finalScoreEl = document.getElementById('final-score');
        this.resultMessageEl = document.getElementById('result-message');
        this.accuracyEl = document.getElementById('accuracy');
        this.totalQuestionsEl = document.getElementById('total-questions');
        this.maxStreakEl = document.getElementById('max-streak');
        this.topicsCoveredEl = document.getElementById('topics-covered');
        this.reviewBtn = document.getElementById('review-btn');
        this.playAgainBtn = document.getElementById('play-again-btn');
        
        // Event Listeners
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.submitBtn.addEventListener('click', () => this.submitAnswer());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.reviewBtn.addEventListener('click', () => this.reviewAnswers());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        
        // Start game
        this.loadQuestion();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    loadQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        
        // Update UI
        this.questionNumberEl.textContent = this.currentQuestion + 1;
        this.questionTitleEl.textContent = question.title;
        this.questionTextEl.textContent = question.text;
        this.questionCountEl.textContent = `${this.currentQuestion + 1}/${this.totalQuestions}`;
        
        // Update progress
        const progress = ((this.currentQuestion) / this.totalQuestions) * 100;
        this.progressFillEl.style.width = `${progress}%`;
        
        // Clear previous options
        this.optionsContainerEl.innerHTML = '';
        
        // Create option cards
        const letters = ['A', 'B', 'C', 'D'];
        question.options.forEach((option, index) => {
            const optionCard = document.createElement('div');
            optionCard.className = 'option-card';
            optionCard.dataset.index = index;
            
            optionCard.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <div class="option-letter">${letters[index]}</div>
                    <div style="font-size: 1.1rem; line-height: 1.4;">${option.text}</div>
                </div>
            `;
            
            optionCard.addEventListener('click', () => this.selectAnswer(index));
            this.optionsContainerEl.appendChild(optionCard);
        });
        
        // Set hint
        this.hintTextEl.textContent = question.hint;
        this.hintBoxEl.classList.remove('show');
        
        // Reset UI state
        this.feedbackEl.className = 'feedback';
        this.feedbackEl.style.display = 'none';
        this.nextBtn.style.display = 'none';
        this.submitBtn.style.display = 'flex';
        this.submitBtn.disabled = true;
        
        // Clear selected answer
        this.selectedAnswer = null;
    }
    
    selectAnswer(index) {
        // Remove selection from all options
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked option
        const selectedCard = document.querySelector(`.option-card[data-index="${index}"]`);
        selectedCard.classList.add('selected');
        
        // Enable submit button
        this.submitBtn.disabled = false;
        
        // Store selected answer
        this.selectedAnswer = index;
    }
    
    showHint() {
        this.hintBoxEl.classList.add('show');
    }
    
    submitAnswer() {
        if (this.selectedAnswer === null) {
            this.showNotification("Please select an answer", "error");
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        const selectedOption = question.options[this.selectedAnswer];
        const isCorrect = selectedOption.correct;
        
        // Show correct/incorrect on options
        document.querySelectorAll('.option-card').forEach((card, index) => {
            card.classList.remove('correct', 'incorrect');
            
            if (question.options[index].correct) {
                card.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                card.classList.add('incorrect');
            }
        });
        
        // Show explanation for selected option
        const selectedCard = document.querySelector(`.option-card[data-index="${this.selectedAnswer}"]`);
        const explanationEl = document.createElement('div');
        explanationEl.className = 'option-explanation';
        explanationEl.innerHTML = `
            <div style="margin-top: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; border-left: 3px solid ${isCorrect ? '#6bcf7f' : '#ff6b6b'};">
                <strong><i class="fas fa-${isCorrect ? 'check' : 'times'}"></i> ${isCorrect ? 'Correct!' : 'Not quite'}</strong>
                <div style="margin-top: 8px; font-size: 0.95rem; color: rgba(255, 255, 255, 0.8);">
                    ${selectedOption.explanation}
                </div>
            </div>
        `;
        selectedCard.appendChild(explanationEl);
        
        // Update game state
        if (isCorrect) {
            this.correctAnswers++;
            this.streak++;
            
            // Calculate points
            let points = 0;
            if (question.difficulty === 'easy') points = 50;
            else if (question.difficulty === 'medium') points = 100;
            else points = 150;
            
            // Bonus for streak
            if (this.streak >= 3) points = Math.round(points * 1.5);
            
            this.score += points;
            
            // Update max streak
            if (this.streak > this.maxStreak) {
                this.maxStreak = this.streak;
            }
            
            // Show feedback
            this.feedbackEl.textContent = `✅ Correct! +${points} points. ${this.streak > 1 ? `🔥 Streak: ${this.streak}!` : ''}`;
            this.feedbackEl.className = 'feedback correct';
        } else {
            this.streak = 0;
            this.feedbackEl.textContent = '❌ Not quite right. Review the explanation to learn.';
            this.feedbackEl.className = 'feedback incorrect';
        }
        
        this.feedbackEl.style.display = 'block';
        
        // Update UI
        this.scoreEl.textContent = this.score;
        this.streakEl.textContent = this.streak;
        
        // Show next button, hide submit button
        this.submitBtn.style.display = 'none';
        this.nextBtn.style.display = 'flex';
    }
    
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.loadQuestion();
        } else {
            this.endGame();
        }
    }
    
    endGame() {
        this.gameCompleted = true;
        this.gameScreenEl.style.display = 'none';
        this.resultScreenEl.style.display = 'block';
        
        const accuracy = (this.correctAnswers / this.totalQuestions) * 100;
        
        // Update result screen
        this.finalScoreEl.textContent = this.score;
        this.accuracyEl.textContent = `${accuracy.toFixed(1)}%`;
        this.totalQuestionsEl.textContent = this.totalQuestions;
        this.maxStreakEl.textContent = this.maxStreak;
        
        // Set result message
        let message = '';
        if (accuracy >= 90) {
            message = "🎯 Financial Wizard! Your money management knowledge is exceptional.";
        } else if (accuracy >= 70) {
            message = "💪 Strong Performance! You have solid financial knowledge with room to grow.";
        } else if (accuracy >= 50) {
            message = "📚 Good Foundation! You understand basics but need more practice.";
        } else {
            message = "🌱 Learning Journey! Keep studying - financial literacy is a valuable skill.";
        }
        
        this.resultMessageEl.textContent = message;
        
        // Show topics covered
        const categories = [...new Set(this.questions.map(q => q.category))];
        this.topicsCoveredEl.innerHTML = categories.map(cat => 
            `<span class="category-tag">${cat}</span>`
        ).join('');
    }
    
    reviewAnswers() {
        this.showNotification("Review feature would show each question with your answer", "info");
        // In a full implementation, this would show each question with the user's answer
    }
    
    playAgain() {
        // Reset game state
        this.score = 0;
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.selectedAnswer = null;
        this.gameCompleted = false;
        
        // Shuffle questions again
        this.shuffleArray(this.questions);
        this.questions = this.questions.slice(0, this.totalQuestions);
        
        // Switch back to game screen
        this.resultScreenEl.style.display = 'none';
        this.gameScreenEl.style.display = 'block';
        
        // Load first question
        this.loadQuestion();
        
        this.showNotification("🔄 New game started! Good luck!", "info");
    }
    
    showNotification(message, type = "info") {
        const notification = document.createElement('div');
        notification.className = `game-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    const game = new FinancialLiteracyGame();
});