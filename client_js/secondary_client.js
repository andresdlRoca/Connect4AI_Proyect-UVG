var socket = require('socket.io-client')('http://localhost:4000');

console.log('Starting');

socket.on('connect', function(){
    socket.emit('signin', {
      user_name: "player2",
      tournament_id: 10,
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
    console.log('Game_id: ', gameID);
    console.log('playerTurnID: ', playerTurnID);
    console.log('Board: ', board);
});


