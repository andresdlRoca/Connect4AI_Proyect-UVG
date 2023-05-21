/*
A class storing a connect 4 position
*/


class Position {
    width = 7;
    height = 6;

    board = [];

    // Indicates if column is playable
    // returns true if playable, false otherwise
    canPlay(column){}

    // Plays given a valid column

    play(column){}

    //Indicates if the current player wins by playing in the given column
    //returns true if the current player wins, false otherwise
    isWinningMove(column){}

    //Number of moves played from the beginning of the game
    numMovesPlayed(){}



}

/*
Recursively solve a connect 4 position using the negamax variant of min-max algorithm
return: the score of the position

- 0 if the position is a draw
- positive if the player who has the turn to play has a winning strategy
- negative if the player who has the turn to play has a losing strategy
*/

function negamax(position){
    if (position.numMovesPlayed() == position.width * position.height){ //Draw
        return 0;
    }

    // Check if the current player wins on the next move
    for (var column = 0; column < position.width; column++){
        if (position.canPlay(column) && position.isWinningMove(column)){
            return Infinity;
        }
    }    

    var bestScore = -Infinity; // -Infinity because we want to maximize the score
    for (var column = 0; column < position.width; column++){ //For each playable column
        if (position.canPlay(column)){ //If the column is playable
            position.play(column);
            var score = -negamax(position);
            position.unplay(column);
            bestScore = Math.max(score, bestScore); 
        }
    }
    return bestScore; 
}
