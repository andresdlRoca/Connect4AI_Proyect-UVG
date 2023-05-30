'use strict';


function Algorithm() {
    var rows = 6;
    var columns = 7;

    var gameBoard = null;

    var maxLevel = 4;

    this.move = function (availableColumns, gameBoard) {
        /*
         * Inputs:
         * availableColumns: [0, 1, 2, 3, 4, 5, 6]
         *
         * gameBoard: [
         *  [0, 0, 0, 0, 0, 0], // 0
         *  [0, 0, 0, 0, 0, 0], // 1
         *  [0, 0, 0, 0, 0, 0], // 2
         *  [0, 0, 0, 0, 0, 0], // 3
         *  [0, 0, 0, 0, 0, 0], // 4
         *  [0, 0, 0, 0, 0, 0], // 5
         *  [0, 0, 0, 0, 0, 0], // 6
         * ]
         *

         */
        this.gameBoard = gameBoard;
        this.otherPlayer = this.getOtherPlayer(this.player);

        if( this.otherPlayer ) {
            //cons ole.log("entrando minmaxWithAlphaBetaPruning");
            var move = this.minmaxWithAlphaBetaPruning(this.getAvailableMoves(), true, maxLevel, 0, 0);
            return move.move;
        }
        else {
            return 3; // if we will start, just pick the column 3
        }
    };

    this.getAvailableMoves = function() {
        var moves = [];
        for(var c=0; c<columns; c++) {
            if( this.getPlace(c, 0)==0 ) {
                moves.push(c);
            }
        }
        return moves;
    };

    this.isPlayerAt = function(column, row, currentPlayer) {
        var place = this.getPlace(column, row);
        //cons ole.log('isPlayerAt:'+column.toString()+row.toString()+'='+place+this.player+currentPlayer+((place==this.player)==currentPlayer));
        return place!=0 && (place==this.player)==currentPlayer;
    };


    this.getPlace = function(column, row) {
        return this.gameBoard[column][row];
    };

    this.setPlace = function(column, row, player) {
        this.gameBoard[column][row] = player;
    };

    this.doMove = function(column, player) {
        for(var r=rows-1; r>=0; r--) {
            if( this.getPlace(column, r)==0 ) {
                this.setPlace(column, r, player);
                return
            }
        }
    };

    this.undoMove = function(column) {
        for(var r=0; r<rows; r++) {
            if( this.getPlace(column, r)!=0 ) {
                this.setPlace(column, r, 0);
                return
            }
        }
    };

    this.isVictory = function(currentPlayer) {
        var r, c;
        for( r=rows-1; r>=0; r-- ) {
            for( c=0; c<columns; c++ ) {
                //cons ole.log('checking '+c.toString()+r.toString()+ '='+ this.getPlace(c, r) + ': ' + (currentPlayer ? ' currentPlayer: ' : ' notCurrentPlayer: ')+(this.isPlayerAt(c, r, currentPlayer)) );

                if( this.isPlayerAt(c, r, currentPlayer) ) {
                    // vertical
                    var isWin = true;
                    var count;
                    for( count=0; count<4 && (r-count)>=0 && isWin; count++ ) {
                        //cons ole.log('wining '+c.toString()+r.toString()+'='+this.getPlace(c, r));
                        isWin = this.isPlayerAt(c, r-count, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                    // horizontal
                    isWin = true;
                    for( count=0; count<4 && (c+count)<columns && isWin; count++ ) {
                        isWin = this.isPlayerAt(c+count, r, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                    // diagonal direita
                    isWin = true;
                    for( count=0; count<4 && (r-count)>=0 && (c+count)<columns && isWin; count++ ) {
                        //cons ole.log('wining '+(c+count).toString()+(r-count).toString()+'='+this.getPlace(c+count, r-count));
                        isWin = this.isPlayerAt(c+count, r-count, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                    // diagonal esquerda
                    isWin = true;
                    for( count=0; count<4 && (r-count)<rows && (c-count)>=0 && isWin; count++ ) {
                        isWin = this.isPlayerAt(c-count, r-count, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                }
            }
        }
        return false;
    };


    this.getOtherPlayer = function(player) {
        for( var r=0; r<rows; r++ ) {
            for( var c=0; c<columns; c++) {
                var place = this.getPlace(c, r);
                if( place!=0 && place!=player ) {
                    return place;
                }
            }
        }
        return null;
    };


    this.logGame = function() {
        //cons ole.log( this.getGameBoardAsString() );
    };

    this.getGameBoardAsString = function(dontAddTitle) {
        var playerId = 'P';
        var opponentId = 'O';
        var rowsStrings = [];
        if( !dontAddTitle ) {
            rowsStrings.push('gameBoard')
        };
        for( var r=0; r<rows; r++ ) {
            var row = [];
            for(var c=0; c<columns; c++ ) {
                var place = this.getPlace(c, r);
                if( place==this.player ) {
                    row.push( playerId );
                }
                else if( place!=0 ) {
                    row.push( opponentId );
                }
                else row.push( ' ' );
            }
            rowsStrings.push( '|'+row.join('|')+'|' );
        }
        return rowsStrings.join('\n');
    };


    this.parseGameBoard = function(theRows) {
        var c, r;
        var gameBoard = [];
        for(c=0; c<columns; c++) {
            gameBoard.push([]);
            for(r=0; r<rows; r++) {
                gameBoard[c].push([]);
            }
        }
        for(c=0; c<columns; c++) {
            for(r=0; r<rows && r<theRows.length; r++) {
                var pos = theRows[r].replace(/\|/g, "").charAt(c);
                if( pos != ' ' ) {
                    gameBoard[c][r] = pos;
                }
                else {
                    gameBoard[c][r] = null;
                }
            }
        }
        return gameBoard;
    };

    /**
     * New GameBoard
     */
    this.getNewGameBoard = function() {
        var c, r;
        var gameBoard = [];
        for(c=0; c<columns; c++) {
            gameBoard.push([]);
            for(r=0; r<rows; r++) {
                gameBoard[c].push(0);
            }
        }
        return gameBoard;
    };



     /**
      * The minmax algorithm with alpha-beta pruning.
      *
      */
    this.minmaxWithAlphaBetaPruning = function(availableMoves, currentPlayer, level, min, max) {
        //this.logGame();

        if(availableMoves.length==0 || level<=0 || this.isVictory(currentPlayer) ) {
            var score = this.gameScore(currentPlayer, level);
            return {score:score, move:0};
        }
        var best = {score:Number.NEGATIVE_INFINITY, move:0};
        for( var i=0; i<availableMoves.length; i++ ) {
            var currentMove = availableMoves[i];

            if( best.score > min ) {
                min = best.score;
            }
            this.doMove( currentMove, currentPlayer? this.player : this.otherPlayer );

            var theMove = this.minmaxWithAlphaBetaPruning(this.getAvailableMoves(), !currentPlayer, level-1, -max, -min);
            theMove = {score:-theMove.score, move:theMove.move};

            this.undoMove( currentMove );

            if(theMove.score > best.score) {
                best.score = theMove.score;
                best.move = currentMove;
            }
            if(best.score > max) {
                //cons ole.log('break');
                break;
            }
        }
        //this.logGame();
        return best;
    };

    /**
     * The function that computes the gamescore for the current gameboard
     */
    this.gameScore = function(currentPlayer, level) {
        if( this.isVictory(currentPlayer) ) {
            if( currentPlayer ) {
                return 10000;
            }
            else {
                return 20000;
            }
        }
        else {
            return this.getGameScore(currentPlayer);
        }
    };

    this.evaluatePlaces = function(places, isCurrentPlayer) {
        if( places.length!=4 && places.length!=5 ) {
            return 0
        }
        var nullCount = 0;
        var playerCount = 0;
        var opponentCount = 0;
        for(var i=0; i<places.length; i++) {
            if( places[i]==0 ) {
                nullCount++;
            }
            else if( places[i]==this.player ) {
                if( isCurrentPlayer ) {
                    playerCount++;
                }
                else {
                    opponentCount++;
                }
            }
            else {
                if( isCurrentPlayer ) {
                    opponentCount++;
                }
                else {
                    playerCount++
                }
            }
        }
        // special cases
        if( places.length==5 && opponentCount!=0 ) {
            // | |P|P|P| |
            if( playerCount==3 && places[1]!=0 && places[2]!=0 && places[3]!=0 ) {
                return 40;
            }
            // |P|P| |P| |
            if( playerCount==3 && places[0]!=0 && places[1]!=0 && places[3]!=0 ) {
                return 30;
            }
            // | |P|P| |P|
            if( playerCount==3 && places[1]!=0 && places[2]!=0 && places[4]!=0 ) {
                return 30;
            }
            // |P| |P|P| |
            if( playerCount==3 && places[0]!=0 && places[2]!=0 && places[3]!=0 ) {
                return 30;
            }
            // | |P| |P|P|
            if( playerCount==3 && places[1]!=0 && places[3]!=0 && places[4]!=0 ) {
                return 30;
            }
            // | |P| |P| |
            if( playerCount==2 && places[1]!=0 && places[3]!=0 ) {
                return 30;
            }
        }

        if( opponentCount!=0 ) {
            return 0;
        }
        else {
            if( playerCount==1 ) {
                return 1;
            }
            if( playerCount==2 ) {
                return 4;
            }
            if( playerCount==3 ) {
                return 8;
            }
            return playerCount;
        }
    };

    this.getGameScore = function(isCurrentPlayer) {
        var score = 0;
        var r, c;
        for( r=rows-1; r>=0; r-- ) {
            for( c=0; c<columns; c++ ) {

                if( true ) {

                    // vertical
                    var count;
                    var places = [];
                    for( count=0; count<4 && (r-count)>=0; count++ ) {
                        places.push( this.getPlace(c, r-count) );
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);


                    // horizontal
                    var places = [];
                    for( count=0; count<5 && (c+count)<columns; count++ ) { // 5 de proposito!
                        places.push( this.getPlace(c+count, r) );
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);


                    // diagonal direita
                    for( count=0; count<4 && (r-count)>=0 && (c+count)<columns; count++ ) {
                        places.push( this.getPlace(c+count, r-count) );
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);


                    // diagonal esquerda
                    for( count=0; count<4 && (r-count)<rows && (c-count)>=0; count++ ) {
                        places.push( this.getPlace(c-count, r-count) );
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);
                }
            }
        }
        return score;
    };
}