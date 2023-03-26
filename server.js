const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const BingoLobby = require("./classes/bingo-lobby");
const SOCKET_URLS = require("./enums/socket-urls");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const messages = [];

const maxPlayers = 8;
const bingoLobby = new BingoLobby(io, "lobby1", maxPlayers);

io.on("connection", (socket) => {
  console.log(`Nuevo usuario conectado: ${socket.id}`);

  // Agregar jugador al lobby
  socket.on(SOCKET_URLS.joinLobby, (player) => bingoLobby.addPlayer(player, socket));

  // Maneja la desconexión del cliente
  socket.on("disconnect", () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
