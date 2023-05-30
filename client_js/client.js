// Connection to the server and playing logic
var socket = require('socket.io-client')('http://192.168.1.134:4000');
var tournamentID = 142857; //Server's tournament ID


// AI Algorithm
var AI_Algorithm = require('./working_algorithm.js'); 
var AI_Instance = new AI_Algorithm();

console.log('Starting');

console.log(AI_Instance.get_grid());

socket.on('connect', function(){ //Connect to the server
    socket.emit('signin', { //Sign in with the tournament id and the user id
      user_name: "AndresDLR",
      tournament_id: tournamentID,
      user_role: 'player'
    });
  });


socket.on('ok_signin', function(){ //Check if it's connected
    console.log("Successfully signed in!");
});

socket.on('ready', function(data){
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var board = data.board;

    // playing logic here
    AI_Instance.update_grid(board); // Update grid with the board sent by the server
    AI_Instance.ai(playerTurnID); // AI plays parameter is the player int that identifies it
    var choice = AI_Instance.previous_move; // Get the column where the AI played

    // Random choice for testing
    // var choice = Math.floor(Math.random() * 7) + 1;

    socket.emit('play', {
        tournament_id: tournamentID,
        player_turn_id: playerTurnID,
        game_id: gameID,
        movement: choice // Prueba
    });
    console.log('Turn finished')
});

socket.on('finish', function(data){ //Game over
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var winnerTurnID = data.winner_turn_id;
    var board = data.board;
    
    // TODO: Your cleaning board logic here
    AI_Instance.clean_grid();
    
    socket.emit('player_ready', {
      tournament_id: tournamentID,
      player_turn_id: playerTurnID,
      game_id: gameID
    });
  });


