const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));  // Para servir tu página web estática

io.on('connection', (socket) => {
    console.log('Nuevo jugador conectado');

    socket.on('unirse', (nombre) => {
        console.log(`${nombre} se unió al lobby`);
        io.emit('jugadores', obtenerJugadores());
    });

    socket.on('iniciar-juego', () => {
        console.log('Juego iniciado');
        io.emit('comenzar-juego');
    });

    socket.on('desconectar', () => {
        console.log('Jugador desconectado');
    });
});

function obtenerJugadores() {
    return [...jugadores];  // Aquí deberías gestionar una lista de jugadores
}

const jugadores = [];

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
