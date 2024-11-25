let start1 = document.querySelector(".e"); // Легкий рівень
let start2 = document.querySelector(".m"); // Середній рівень
let start3 = document.querySelector(".h"); // Важкий рівень
let container = document.querySelector(".container");
let container2 = document.querySelector(".container2");
let timerDisplay = document.querySelector(".timer"); // Елемент для відображення таймера
let answer_buttons = document.querySelectorAll(".answear");
let question_field = document.querySelector(".question");
let correct_answer = 0;
let total_answer = 0;
let current_question;
let difficulty = "easy"; // За замовчуванням легкий рівень
let timer; // Таймер для відліку часу
let timeLeft = 10; // Загальний час гри у секундах

// Функція старту гри
function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty; // Задаємо вибраний рівень
    start1.style.display = "none";
    start2.style.display = "none";
    start3.style.display = "none";
    container.style.display = "block";
    correct_answer = 0;
    total_answer = 0;
    timeLeft = 10;


    // Початкове питання
    current_question = new Question(difficulty);
    current_question.display();
}

// Обробники для кнопок вибору рівня
start1.addEventListener("click", () => startGame("easy"));    // Легкий рівень
start2.addEventListener("click", () => startGame("medium"));  // Середній рівень
start3.addEventListener("click", () => startGame("hard"));    // Важкий рівень

class Question {
    constructor(difficulty) {
        // Визначаємо діапазони значень залежно від рівня складності
        let min, max;
        switch (difficulty) {
            case "easy":
                min = 1;
                max = 10;
                break;
            case "medium":
                min = 1;
                max = 30;
                break;
            case "hard":
                min = 10;
                max = 100;
                break;
        }

        let a = randint(min, max);
        let b = randint(1, max); // Уникаємо ділення на 0
        let sign = getRandomSign();
        if (sign === "/") {
            a = a * b; // Забезпечуємо цілісний результат
        }
        this.question = `${a} ${sign} ${b}`;

        // Визначення правильної відповіді
        if (sign === "+") {
            this.correct = a + b;
        } else if (sign === "-") {
            this.correct = a - b;
        } else if (sign === "*") {
            this.correct = a * b;
        } else if (sign === "/") {
            this.correct = Math.round(a / b); // Округлення до цілого
        }

        // Масив відповідей
        this.answers = [
            randint(min, max),
            randint(min, max * 2),
            this.correct,
            randint(min, max),
            randint(min,max)
        ];
        shuffle(this.answers);
    }

    display() {
        question_field.innerHTML = this.question;
        for (let i = 0; i < answer_buttons.length; i++) {
            answer_buttons[i].innerHTML = this.answers[i];
            answer_buttons[i].style.background = ""; // Скидання стилю
            answer_buttons[i].disabled = false; // Активуємо кнопки
        }
    }
}

// Функція генерації випадкового числа в заданому діапазоні
function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

// Масив можливих знаків
let sign = ["+", "-", "/", "*"];

// Функція для випадкового вибору знака
function getRandomSign() {
    return sign[Math.floor(Math.random() * sign.length)];
}

// Обробка натискань на кнопки відповідей
for (let i = 0; i < answer_buttons.length; i++) {
    answer_buttons[i].addEventListener("click", function () {
        let selected_answer = parseInt(answer_buttons[i].innerHTML);
        if (selected_answer === current_question.correct) {
            correct_answer += 1;
            answer_buttons[i].style.background = "#6be809";
        } else {
            answer_buttons[i].style.background = "#ef0009";
        }
        total_answer += 1;

        // Блокування кнопок до наступного питання
        for (let j = 0; j < answer_buttons.length; j++) {
            answer_buttons[j].disabled = true;
        }

        // Генеруємо нове питання через 0.5 секунди
        setTimeout(() => {
            current_question = new Question(difficulty);
            current_question.display();
        }, 500);
    });
}

// Функція для перемішування масиву відповідей
function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
}
// Відображення результатів через 10 секунд
setTimeout(function () {
    container2.style.display="block"
    container2.innerHTML = `Ви дали ${correct_answer} правильних відповідей із ${total_answer}.
    Точність - ${total_answer > 0 ? Math.round((correct_answer * 100) / total_answer) : 0}%.`;
}, 25000);

// Функція відображення результатів
function showResults() {
    container.style.display = "none";
    container2.style.display = "block";
    container2.innerHTML = `Ви дали ${correct_answer} правильних відповідей із ${total_answer}.
    Точність - ${total_answer > 0 ? Math.round((correct_answer * 100) / total_answer) : 0}%.`;
}
