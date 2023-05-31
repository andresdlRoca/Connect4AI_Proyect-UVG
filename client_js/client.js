// Connection to the server and playing logic
var socket = require('socket.io-client')('http://192.168.1.131:4000');
var tournamentID = 142857; //Server's tournament ID


// AI Algorithm
var AI_Algorithm = require('./working_algorithm.js'); 
var AI_Instance = new AI_Algorithm();

console.log('Starting');

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

    console.log("MyPlayerID:")
    console.log(playerTurnID)
    console.log("Turn start:\n");
    console.table(board);
    console.log("\n");

    // playing logic here
    var rows = board.length;
    var columns = board[0].length;

    // Create a new transposed board
    var transposedBoard = [];
    for (var i = 0; i < columns; i++) {
      transposedBoard[i] = [];
      for (var j = 0; j < rows; j++) {
        transposedBoard[i][j] = board[rows - j - 1][i];
      }
    }
    board = transposedBoard;
    AI_Instance.play(board, playerTurnID); // Play the AI
    var choice = AI_Instance.previous_move; // Get the column where the AI played


    console.log("\nAfter making move:")
    console.table(board)
    console.log('\n');
    // Random choice for testing
    // var choice = Math.floor(Math.random() * 7) + 1;

    socket.emit('play', {
        tournament_id: tournamentID,
        player_turn_id: playerTurnID,
        game_id: gameID,
        movement: choice 
    });
    console.log('Turn finished\n')
});

socket.on('finish', function(data){ //Game over
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var winnerTurnID = data.winner_turn_id;
    var board = data.board;
    
    console.log('finishing board\n')
    console.table(board)
    // TODO: Your cleaning board logic here
    console.log("\nCleaning board...")
    AI_Instance.clean_grid();
    console.log("Game finished")
    
    socket.emit('player_ready', {
      tournament_id: tournamentID,
      player_turn_id: playerTurnID,
      game_id: gameID
    });
  });


