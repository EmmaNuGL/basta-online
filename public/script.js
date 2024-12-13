document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category');
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-answer');
    const scoreList = document.getElementById('score-list');
    const lettersContainer = document.getElementById('letters-container');
    const timeLeftDisplay = document.getElementById('time-left');
    const endGameMessage = document.getElementById('end-game-message');
    const restartButton = document.getElementById('restart-button');
    const stopButton = document.getElementById('stop-button');
    let timer = null;
    let timeLeft = 45;
    let letterSelected = null;
    let remainingLetters = [];
    let answeredLetters = [];
    let currentPlayerIndex = 0;
    let scores = [];
    let gameEnded = false;
    let playerData = JSON.parse(localStorage.getItem('playerData')) || [];
    
    // Cargar la categoría seleccionada
    const selectedCategory = localStorage.getItem('selectedCategory');
    const categoryDisplay = document.getElementById('category-display');
    if (selectedCategory) {
        categoryDisplay.textContent = `Categoría: ${selectedCategory}`;
    }
    
    // Función para generar botones de letras
    function generateLetterButtons() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        remainingLetters = alphabet.slice();

        lettersContainer.innerHTML = '';
        alphabet.forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.classList.add('letter-button');
            button.addEventListener('click', () => handleLetterClick(letter, button));

            if (answeredLetters.includes(letter)) {
                button.disabled = true;
            }

            lettersContainer.appendChild(button);
        });
    }

    // Función para manejar el clic en una letra
    function handleLetterClick(letter, button) {
        if (gameEnded) return; // Si el juego ya terminó, no permitir más interacciones.

        letterSelected = letter;
        button.disabled = true;
        answeredLetters.push(letter);

        document.getElementById('letter-display').textContent = `Letra seleccionada: ${letterSelected}`;
        answerInput.disabled = false;
        submitButton.disabled = false;

        // El tiempo NO se reinicia aquí, solo cuando se envíe la respuesta
    }

    // Función para iniciar el temporizador
    function startTimer() {
        if (gameEnded) return; // Si el juego terminó, no iniciar más temporizadores.

        timeLeft = 45;
        timeLeftDisplay.textContent = timeLeft;

        timer = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    }

    // Función para manejar envío de respuesta
    function handleSubmit() {
        const answer = answerInput.value.trim();

        if (answer && answer[0].toUpperCase() === letterSelected) {
            scores.push({ player: currentPlayerIndex, letter: letterSelected, answer });
            proceedToNextTurn();
        } else {
            alert('La respuesta no comienza con la letra seleccionada. Intenta nuevamente.');
        }
    }

    // Proceder al siguiente turno
    function proceedToNextTurn() {
        if (timer) clearInterval(timer);

        // Resetear inputs
        answerInput.value = '';
        answerInput.disabled = true;
        submitButton.disabled = true;

        // Verificar si quedan letras
        if (remainingLetters.length === answeredLetters.length) {
            endGame();
            return;
        }

        // Avanzar turno y reiniciar el temporizador
        currentPlayerIndex = (currentPlayerIndex + 1) % playerData.length;
        updateTurnDisplay(); // Actualizar el nombre del jugador en pantalla
        startTimer();
    }

    // Actualizar la pantalla para mostrar el turno del jugador actual
    function updateTurnDisplay() {
        const playerName = playerData[currentPlayerIndex] || `Jugador ${currentPlayerIndex + 1}`;
        document.getElementById('current-player').textContent = `Turno de: ${playerName}`;
    }

    // Función para terminar el juego
    function endGame() {
        gameEnded = true;
        if (timer) clearInterval(timer);

        // Mostrar el mensaje de fin de juego
        endGameMessage.style.display = 'block';
        timeLeftDisplay.textContent = '0';

        // Mostrar respuestas registradas
        displayResults();

        // Deshabilitar interacciones
        document.getElementById('letter-selection').style.display = 'none';
    }

    // Mostrar las respuestas
    function displayResults() {
        scoreList.innerHTML = '';
        scores.forEach(score => {
            const playerName = playerData[score.player] || `Jugador ${score.player + 1}`;
            const listItem = document.createElement('li');
            listItem.textContent = `${playerName} - Letra: ${score.letter} - Respuesta: ${score.answer}`;
            scoreList.appendChild(listItem);
        });
    }

    // Botón Stop: Redirige al lobby
    stopButton.addEventListener('click', () => {
        window.location.href = 'lobby.html';
    });

    // Al reiniciar el juego, borrar la selección de la letra
    function restartGame() {
        letterSelected = null;
        remainingLetters = [];
        answeredLetters = [];
        scores = [];
        currentPlayerIndex = 0;
        timeLeft = 45;
        gameEnded = false;

        // Resetear UI
        generateLetterButtons();
        endGameMessage.style.display = 'none';
        document.getElementById('letter-selection').style.display = 'block';
        document.getElementById('score-section').style.display = 'block';

        // Limpiar respuestas previas
        scoreList.innerHTML = '';
        document.getElementById('letter-display').textContent = 'Letra seleccionada: '; // Reiniciar selección de letra

        updateTurnDisplay(); // Mostrar al jugador inicial
        startTimer();
    }

    // Botón para reiniciar el juego
    restartButton.addEventListener('click', restartGame);

    // Inicializar el juego
    function startGame() {
        generateLetterButtons();
        updateTurnDisplay(); // Mostrar al jugador inicial
        startTimer(); // Iniciar el temporizador para el primer turno
    }

    submitButton.addEventListener('click', handleSubmit);
    startGame();
});
