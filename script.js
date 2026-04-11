const questions = [
  {
    question: "O que é uma senha forte?",
    answers: [
      { text: "Uma senha curta e fácil de lembrar", correct: false },
      { text: "Uma combinação de letras, números e símbolos", correct: true },
      { text: "O nome do usuário com a data de nascimento", correct: false },
      { text: "A palavra '123456'", correct: false }
    ]
  },
  {
    question: "Qual destas práticas ajuda a proteger dados pessoais?",
    answers: [
      { text: "Compartilhar senhas com amigos de confiança", correct: false },
      { text: "Usar autenticação em dois fatores", correct: true },
      { text: "Salvar senhas em papéis visíveis", correct: false },
      { text: "Clicar em qualquer link recebido por e-mail", correct: false }
    ]
  },
  {
    question: "O que é phishing?",
    answers: [
      { text: "Um tipo de backup em nuvem", correct: false },
      { text: "Uma tentativa de enganar a pessoa para roubar dados", correct: true },
      { text: "Um antivírus avançado", correct: false },
      { text: "Um método de criptografia", correct: false }
    ]
  },
  {
    question: "Por que é importante manter sistemas atualizados?",
    answers: [
      { text: "Porque deixam o computador mais bonito", correct: false },
      { text: "Porque corrigem falhas e vulnerabilidades", correct: true },
      { text: "Porque ocupam mais espaço", correct: false },
      { text: "Porque removem arquivos pessoais", correct: false }
    ]
  },
  {
    question: "O que faz a criptografia?",
    answers: [
      { text: "Apaga todos os dados do sistema", correct: false },
      { text: "Transforma dados em formato protegido", correct: true },
      { text: "Aumenta a velocidade da internet", correct: false },
      { text: "Impede o uso de senhas", correct: false }
    ]
  },
  {
    question: "Qual destas opções representa um risco de segurança?",
    answers: [
      { text: "Usar antivírus atualizado", correct: false },
      { text: "Conectar-se a Wi-Fi público sem cuidado", correct: true },
      { text: "Criar senhas únicas", correct: false },
      { text: "Fazer backup regularmente", correct: false }
    ]
  },
  {
    question: "O que é backup?",
    answers: [
      { text: "Uma cópia de segurança dos dados", correct: true },
      { text: "Um tipo de vírus", correct: false },
      { text: "Um bloqueio de tela", correct: false },
      { text: "Uma senha secundária", correct: false }
    ]
  },
  {
    question: "Qual atitude é mais segura ao receber um e-mail suspeito?",
    answers: [
      { text: "Abrir os anexos imediatamente", correct: false },
      { text: "Responder passando seus dados", correct: false },
      { text: "Verificar o remetente e evitar clicar em links duvidosos", correct: true },
      { text: "Encaminhar para todos os contatos", correct: false }
    ]
  },
  {
    question: "O que significa autenticação em dois fatores?",
    answers: [
      { text: "Usar duas contas diferentes", correct: false },
      { text: "Confirmar a identidade com duas etapas", correct: true },
      { text: "Trocar de senha duas vezes por dia", correct: false },
      { text: "Usar dois antivírus ao mesmo tempo", correct: false }
    ]
  },
  {
    question: "Qual é a melhor forma de proteger informações sensíveis?",
    answers: [
      { text: "Compartilhar apenas com qualquer pessoa da empresa", correct: false },
      { text: "Deixar em arquivos públicos", correct: false },
      { text: "Controlar acesso e aplicar boas práticas de segurança", correct: true },
      { text: "Salvar sem senha no computador", correct: false }
    ]
  }
];

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-container");
const quizContainer = document.getElementById("quiz-container");
const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress-bar");
const questionCounter = document.getElementById("question-counter");
const timerElement = document.getElementById("timer");

const soundCorrect = document.getElementById("sound-correct");
const soundWrong = document.getElementById("sound-wrong");
const soundWarning = document.getElementById("sound-warning");

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timer;
let warningPlayed = false;

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {
    // evita erro caso o navegador bloqueie autoplay
  });
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  resultContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  nextButton.innerText = "Próxima";
  showQuestion();
}

function showQuestion() {
  resetState();
  updateProgress();
  startTimer();

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("answer-btn");

    if (answer.correct) {
      button.dataset.correct = "true";
    }

    button.addEventListener("click", selectAnswer);
    answersElement.appendChild(button);
  });
}

function resetState() {
  clearInterval(timer);
  timeLeft = 20;
  warningPlayed = false;
  timerElement.innerText = `Tempo: ${timeLeft}s`;
  timerElement.classList.remove("warning", "danger");
  nextButton.style.display = "none";
  answersElement.innerHTML = "";
}

function updateProgress() {
  const progress = (currentQuestionIndex / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  questionCounter.innerText = `Pergunta ${currentQuestionIndex + 1}/${questions.length}`;
}

function updateTimerStyle() {
  timerElement.classList.remove("warning", "danger");

  if (timeLeft <= 5) {
    timerElement.classList.add("danger");
  } else if (timeLeft <= 10) {
    timerElement.classList.add("warning");
  }
}

function startTimer() {
  updateTimerStyle();

  timer = setInterval(() => {
    timeLeft--;
    timerElement.innerText = `Tempo: ${timeLeft}s`;
    updateTimerStyle();

    if (timeLeft === 5 && !warningPlayed) {
      playSound(soundWarning);
      warningPlayed = true;
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      timerElement.innerText = "Tempo esgotado!";
      playSound(soundWrong);
      disableAnswers();
      showCorrectAnswer();
      nextButton.style.display = "block";
    }
  }, 1000);
}

function selectAnswer(e) {
  clearInterval(timer);

  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
    playSound(soundCorrect);
  } else {
    selectedBtn.classList.add("wrong");
    playSound(soundWrong);
  }

  showCorrectAnswer();
  disableAnswers();
  nextButton.style.display = "block";
}

function showCorrectAnswer() {
  Array.from(answersElement.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
  });
}

function disableAnswers() {
  Array.from(answersElement.children).forEach(button => {
    button.disabled = true;
  });
}

function showResult() {
  clearInterval(timer);
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  progressBar.style.width = "100%";
  questionCounter.innerText = `Pergunta ${questions.length}/${questions.length}`;
  timerElement.innerText = "Finalizado";
  timerElement.classList.remove("warning", "danger");

  scoreElement.innerText = `Você acertou ${score} de ${questions.length} perguntas.`;

  if (score === questions.length) {
    messageElement.innerText = "Excelente! Você manda bem em segurança de dados.";
  } else if (score >= 7) {
    messageElement.innerText = "Muito bom! Seu conhecimento está bem sólido.";
  } else if (score >= 5) {
    messageElement.innerText = "Bom resultado, mas ainda dá para melhorar.";
  } else {
    messageElement.innerText = "Vale revisar mais o tema. Segurança de dados é essencial.";
  }
}

function handleNextButton() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

nextButton.addEventListener("click", handleNextButton);
restartButton.addEventListener("click", startQuiz);

startQuiz();