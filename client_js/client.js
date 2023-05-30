// var socket = require('socket.io-client')('http://192.168.1.134:4000');
// var tournamentID = 142857; //10 es el de prueba

var socket = require('socket.io-client')('http://localhost:4000');
var tournament_id = 10;

console.log('Starting');

socket.on('connect', function(){
    socket.emit('signin', {
      user_name: "AndresDLR",
      tournament_id: tournamentID,
      user_role: 'player'
    });
  });


socket.on('ok_signin', function(){
    console.log("Successfully signed in!");
});

socket.on('ready', function(data){
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var board = data.board;

    // playing logic here
    console.log('Board');
    console.log(board);
    console.log('\n');

    //Make random integer choice between 1 and 7
    var choice = Math.floor(Math.random() * 7) + 1;

    socket.emit('play', {
        tournament_id: tournamentID,
        player_turn_id: playerTurnID,
        game_id: gameID,
        movement: choice // Prueba
    });
    console.log('Turn finished')
});

socket.on('finish', function(data){
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var winnerTurnID = data.winner_turn_id;
    var board = data.board;
    
    // TODO: Your cleaning board logic here
    
    socket.emit('player_ready', {
      tournament_id: tournamentID,
      player_turn_id: playerTurnID,
      game_id: gameID
    });
  });


