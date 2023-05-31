// board = [[0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 1, 0, 0, 0],
// [0, 0, 0, 2, 0, 0, 0],
// [0, 0, 0, 1, 0, 0, 0]];


// let formattedboard = board.map(row => row.slice().reverse());
// formattedboard.unshift(Array(board[0].length).fill(0));

// console.table(formattedboard)

// var board = [[0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0],
//     [1, 2, 1, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0]];

// var AI_Algorithm = require('./working_algorithm.js'); 
// var AI_Instance = new AI_Algorithm();

// AI_Instance.play(board, 2);


// console.table(AI_Instance.grid);
// console.log(AI_Instance.previous_move);


var board = [
    [0, 1, 0, 1, 0, 0, 0],
    [0, 2, 0, 2, 0, 0, 0],
    [0, 2, 0, 2, 0, 0, 0],
    [0, 2, 0, 1, 0, 0, 0],
    [0, 1, 0, 2, 0, 0, 0],
    [0, 1, 0, 1, 5, 5, 0]
  ];
  
  // Get the number of rows and columns
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
  
  console.table(transposedBoard);
