const SOCKET_URLS = require("../enums/socket-urls");

const defaultPlayer = {
  id: "",
  name: "",
  table: [],
  bingo: false,
  score: 0,
};

class BingoLobby {
  constructor(io, lobbyId, maxPlayers) {
    this.io = io;
    this.lobbyId = lobbyId;
    this.maxPlayers = maxPlayers;
    this.players = new Map(); // mapa para almacenar los jugadores conectados
    this.table = []; // matriz para almacenar las tablas de los jugadores
    this.mode = "NORMAL"; // modo de juego (NORMAL o FULL)
    this.isStarted = false; // indica si el juego ya comenzó o no
  }

  // Método para agregar un jugador al lobby
  addPlayer(player, socket) {
    if (this.players.size >= this.maxPlayers) {
      // Si ya se alcanzó el máximo de jugadores, no se permite agregar más
      return false;
    }

    // Se agrega el jugador al mapa de jugadores
    this.players.set(player.id, player);
    console.log(`Se agregó al jugador ${player.name} al lobby ${this.lobbyId}`);

    // Se une al socket al lobby
    socket.join(this.lobbyId);
    // Se envía el mensaje de que un jugador se conectó al resto de los jugadores
    this.io.to(this.lobbyId).emit(SOCKET_URLS.joinLobby, { player });

    // Si se llegó al máximo de jugadores, se cierra el lobby y se comienza el juego automáticamente
    if (this.players.size === this.maxPlayers) {
      this.mode = "FULL";
      this.startGame();
    }

    return true;
  }

  // Método para remover un jugador del lobby
  removePlayer(playerId) {
    const player = this.players.get(playerId);
    if (!player) {
      return;
    }

    // Se elimina al jugador del mapa de jugadores
    this.players.delete(playerId);
    console.log(
      `Se eliminó al jugador ${player.name} del lobby ${this.lobbyId}`
    );

    // Se envía el mensaje de que un jugador se desconectó al resto de los jugadores
    this.io.to(this.lobbyId).emit("player-disconnected", { player });
  }

  startGame() {
    console.log(`Se inició el juego del lobby ${this.lobbyId}`);
    this.isStarted = true;
  }

  // Método para comenzar el juego
  /*  startGame() {
      this.isStarted = true;
  
      // Se genera una tabla para cada jugador
      this.players.forEach((player) => {
        player.table = this.generateTable();
        this.table.push(player.table);
      });
  
      // Se envía la tabla a cada jugador y se espera su respuesta
      this.players.forEach((player) => {
        this.io.to(player.id).emit("table-assigned", { table: player.table });
      });
  
      // Se espera la respuesta de cada jugador
      let allAccepted = true;
      const promises = [];
      this.players.forEach((player) => {
        const promise = new Promise((resolve) => {
          this.io.to(player.id).once("answer-table", ({ accept }) => {
            if (!accept) {
              allAccepted = false;
            }
            resolve();
          });
        });
        promises.push(promise);
      });
  
      // Cuando todos los jugadores hayan respondido, se procede con el juego
      Promise.all(promises).then(() => {
        if (allAccepted) {
          this.io.to(this.lobbyId).emit("game-has-started");
          this.startRound();
        } else {
          this.table = []; // Se eliminan las tablas generadas
          this.players.clear(); // Se eliminan los jugadores conectados
          this.isStarted = false; // Se reinicia el juego
          console.log(`Se canceló el juego del lobby ${this.lobby */
}

module.exports = BingoLobby;
