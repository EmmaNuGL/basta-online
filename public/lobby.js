document.addEventListener('DOMContentLoaded', () => {
    const numPlayersSelect = document.getElementById('num-players');
    const playerNamesContainer = document.getElementById('player-names');
    const categoriesSelect = document.getElementById('categories');
    const lobbyForm = document.getElementById('lobby-form');

    // Inicializar opciones de número de jugadores
    function initializePlayerOptions() {
        numPlayersSelect.innerHTML = ''; // Limpiar cualquier opción previa
        for (let i = 2; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i} jugadores`;
            numPlayersSelect.appendChild(option);
        }
    }

    // Inicializar categorías de juego
    function initializeCategories() {
        categoriesSelect.innerHTML = ''; // Limpiar cualquier opción previa
        const categories = [
            'Animales', 'Frutas', 'Países', 'Colores', 'Objetos', 
            'Comidas', 'Deportes', 'Profesiones', 'Películas', 'Series', 'Flores', 'Ciudades', 'Otra'
        ];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoriesSelect.appendChild(option);
        });
    }

    // Actualizar campos de nombres de jugadores
    numPlayersSelect.addEventListener('change', () => {
        const numPlayers = parseInt(numPlayersSelect.value, 10);
        playerNamesContainer.innerHTML = ''; // Limpiar contenedor

        for (let i = 1; i <= numPlayers; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Nombre del Jugador ${i}`;
            input.id = `player-${i}`;
            input.dataset.defaultName = `Jugador ${i}`;
            input.classList.add('player-name-input');
            playerNamesContainer.appendChild(input);
        }
    });

    // Manejar inicio del juego
    lobbyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const playerData = [];
        const numPlayers = parseInt(numPlayersSelect.value, 10);

        for (let i = 1; i <= numPlayers; i++) {
            const input = document.getElementById(`player-${i}`);
            const playerName = input.value.trim() || input.dataset.defaultName;
            playerData.push(playerName);
        }

        let selectedCategory = categoriesSelect.value;
        if (selectedCategory === 'Otra') {
            selectedCategory = prompt('Ingresa una nueva categoría:') || 'Categoría personalizada';
        }

        // Guardar nombres y categoría en localStorage
        localStorage.setItem('playerData', JSON.stringify(playerData));
        localStorage.setItem('selectedCategory', selectedCategory);

        // Redirigir al juego principal
        window.location.href = 'index.html';
    });

    // Inicializar el lobby
    initializePlayerOptions();
    initializeCategories();

    // Disparar evento de cambio para generar campos iniciales
    numPlayersSelect.dispatchEvent(new Event('change'));
});
