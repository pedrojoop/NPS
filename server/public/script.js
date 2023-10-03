document.addEventListener("DOMContentLoaded", function () {
    const surveyForm = document.getElementById("survey-form");
    const questions = document.querySelectorAll(".question");
    const nextButton = document.getElementById("next-button");
    const thankYouMessage = document.getElementById("thank-you-message");

    let currentQuestionIndex = 0;

    function showCurrentQuestion() {
        questions[currentQuestionIndex].style.display = "block";
    }

    function hideCurrentQuestion() {
        questions[currentQuestionIndex].style.display = "none";
    }

    function showThankYouMessage() {
        thankYouMessage.style.display = "block";

        // Agende o reinício do formulário após 5 segundos
        setTimeout(function () {
            restartSurvey();
        }, 5000); // 5000 milissegundos = 5 segundos
    }

    function showNextQuestion() {
        hideCurrentQuestion();
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showCurrentQuestion();
        } else {
            // Envie os dados para o servidor aqui
            sendDataToServer();
            
            showThankYouMessage();
            nextButton.style.display = "none";
        }
    }

    function restartSurvey() {
        currentQuestionIndex = 0;
        questions.forEach(function (question) {
            if (question.querySelector("input[type='radio']")) {
                // Se for uma pergunta de múltipla escolha, desmarque todas as opções
                const radioOptions = question.querySelectorAll("input[type='radio']");
                radioOptions.forEach(function (option) {
                    option.checked = false;
                });
            } else {
                // Se for uma pergunta de texto, limpe o campo de texto
                const textInput = question.querySelector("input[type='text']");
                textInput.value = "";
            }
            question.style.display = "none";
        });
        nextButton.style.display = "block";
        showCurrentQuestion();
        thankYouMessage.style.display = "none";
    }

    function sendDataToServer() {
        // Obtenha as respostas do formulário que você deseja enviar
        const resposta_pergunta1 = document.querySelector('input[name="q1"]:checked').value;
        
        // Obtenha a resposta da segunda pergunta
        const resposta_pergunta2 = document.querySelector('input[name="q2"]:checked').value;
        
        const resposta_pergunta3 = document.getElementById("q3").value;
        
        // Crie um objeto com os dados a serem enviados
        const data = {
            q1: resposta_pergunta1,
            q2: resposta_pergunta2,
            q3: resposta_pergunta3
        };
    
        // Envie os dados para o servidor usando uma solicitação AJAX ou Fetch
        fetch('/pesquisa-nps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // A resposta do servidor
        })
        .catch(error => {
            console.error('Erro ao enviar dados para o servidor:', error);
        });
    }

    showCurrentQuestion();

    // Ouvinte de evento para opções de múltipla escolha
    const radioOptions = document.querySelectorAll("input[type='radio']");
    radioOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            if (currentQuestionIndex === 1 && option.value === "Sim") {
                // Se a resposta for "Sim" na segunda pergunta, vá para a pergunta 3
                showNextQuestion();
            } else if (currentQuestionIndex === 1) {
                // Se a resposta for qualquer coisa além de "Sim" na segunda pergunta, vá para a página de agradecimento
                sendDataToServer();
                showThankYouMessage();
                nextButton.style.display = "none";
            } else {
                // Para outras perguntas de múltipla escolha, vá para a próxima pergunta
                showNextQuestion();
            }
        });
    });

    // Ouvinte de evento para o botão de próxima pergunta (caso você queira usá-lo)
    nextButton.addEventListener("click", function () {
        showNextQuestion();
    });
});
