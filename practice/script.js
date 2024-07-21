const questions = [
    {
        question: "What type of kuruwa service are you looking for?",
        answers: [
            { text: "Child care" },
            { text: "Aged care" },
            { text: "Personal care" }
        ]
    },
    {
        question: "How often do you need the kuruwa service?",
        answers: [
            { text: "Daily" },
            { text: "Weekly" },
            { text: "Monthly" },
            { text: "Occasionally" }
        ]
    },
    {
        question: "What is your preferred time for the Kuruwa service?",
        answers: [
            { text: "Morning" },
            { text: "Afternoon" },
            { text: "Evening" },
            { text: "Overnight" }
        ]
    },
    {
        question: "How many hours per day do you need the Kuruwa service?",
        answers: [
            { text: "1-3 hours" },
            { text: "4-6 hours" },
            { text: "7-9 hours" },
            { text: "10+ hours" }
        ]
    },
    {
        question: "Do you need the caregiver to have specific qualifications or certifications?",
        answers: [
            { text: "Yes" },
            { text: "No" },
            { text: "Not Sure" }
        ]
    },
    {
        question: "What is your budget for the kuruwa service per hour?",
        answers: [
            { text: "Less than Rs.100" },
            { text: "Rs.100-Rs.300" },
            { text: "Rs.300-Rs.500" },
            { text: "More than Rs.500" }
        ]
    }
];

const question1Element = document.getElementById("question1");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const backButton = document.getElementById("back-btn");

let currentQuestionIndex = 0;
let selectedAnswers = new Set();

function startAsPatient() {
    currentQuestionIndex = 0;
    nextButton.innerHTML = "Next";
    nextButton.disabled = true;
    backButton.disabled = true;
    showQuestion();
}

function showQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    question1Element.innerHTML = questionNo + ". " + currentQuestion.question;
    
    // Clear previous answers
    answerButtons.innerHTML = '';
    
    // Display new answers
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        button.addEventListener("click", () => handleAnswerClick(button));
        answerButtons.appendChild(button);
    });
}

function handleAnswerClick(button) {
    // Clear previously selected answer
    document.querySelectorAll(".btn.selected").forEach(btn => {
        if (btn !== button) {
            btn.classList.remove("selected");
        }
    });
    
    button.classList.toggle("selected");
    
    if (button.classList.contains("selected")) {
        selectedAnswers.add(button.innerHTML);
    } else {
        selectedAnswers.delete(button.innerHTML);
    }
    
    validateNextButton();
}

function validateNextButton() {
    const isSelected = selectedAnswers.size > 0;
    nextButton.disabled = !isSelected;
}

function handleSubmit() {
    window.location.href = 'login.html';
}

function handleNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        selectedAnswers.clear();  // Clear selection for the next question
        currentQuestionIndex++;
        showQuestion();
        nextButton.innerHTML = "Next";  // Reset button text to "Next"
        validateNextButton();
        backButton.disabled = false; // Enable back button
    } else {
        nextButton.innerHTML = "Submit";
        nextButton.removeEventListener('click', handleNextQuestion);
        nextButton.addEventListener('click', handleSubmit);
        validateNextButton();
    }
}

function handlePreviousQuestion() {
    if (currentQuestionIndex > 0) {
        selectedAnswers.clear();  // Clear selection for the previous question
        currentQuestionIndex--;
        showQuestion();
        nextButton.innerHTML = "Next";  // Reset button text to "Next"
        validateNextButton();
        nextButton.addEventListener('click', handleNextQuestion);
        nextButton.removeEventListener('click', handleSubmit);
        if (currentQuestionIndex === 0) {
            backButton.disabled = true; // Disable back button if on first question
        }
    }
}

nextButton.addEventListener('click', handleNextQuestion);
backButton.addEventListener('click', handlePreviousQuestion);

startAsPatient();
