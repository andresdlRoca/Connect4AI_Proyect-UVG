class AI_Algorithm {

  constructor() {
    this.moves = 0;
    this.mid_stop = false;
    this.win_size = 4;
    this.won = false;
    this.previous_move = 0;
    this.grid = [[0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]];
    this.past = [];

  }

  clean_grid() { // Clean the grid and reset variables
    this.moves = 0;
    this.mid_stop = false;
    this.win_size = 4;
    this.won = false;
    this.previous_move = 0;
    this.grid = [[0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]];
    this.past = [];
  }



  make_move(player, col) { // Make a move in the grid
      if (!this.won) {
          const index = this.grid[col].findIndex(y => !y);
          // console.log(index)
          if (index != -1) {
              const win = this.move_score(col, [...this.grid]);
              if (win[1][0] && player === 1) {
                  this.won = true;
              } else if (win[1][1] && player === 2) {
                  this.won = true;
              }
              this.grid[col][index] = player;
              this.past.push([player, index, col]);
              this.moves++;
              this.previous_move = col;
          }
      }
      // return col; //Returning played column
  }


  play(new_grid, player_turn_id) { // Update the grid with the board sent by the server
    this.mid_stop = true;
    this.grid = new_grid;
    this.ai(player_turn_id);
  }

  ai(player_turn_id) { // AI algorithm
      if (!(this.grid[3][5]) && (!this.grid[3][4]) && !(this.mid_stop)) {
        this.make_move(player_turn_id, 3);
      } else {
        const move_scores = this.get_scores();
        for (let m = 0; m < move_scores.length; m++){
          if (move_scores[m] === true){
            this.make_move(player_turn_id,m);
            return;
          }
        }
        let maxes = [];
        const max = Math.max(...move_scores);
        for (let m = 0; m < move_scores.length; m++) {
          if (move_scores[m] === max) { maxes.push(m); }
        }
        let index = 0;
        if (maxes.includes(3)) index = 3;
        else index = maxes[~~(Math.random() * maxes.length)];
        this.make_move(player_turn_id, index);
      }
  }

  // computer_random(player_turn_id) { // Computer plays random moves (for testing)
  //     if (this.moves < 42) {
  //       const r = Math.floor(Math.random() * 7);
  //       const index = this.grid[r].findIndex(y => !y);
  //       index != -1 ? make_move(player_turn_id, r) : computer_random();
  //     }
  // }

    
  get_scores() { // Get the scores of each move
      let move_scores = [];
      for (let c = 0; c < 7; c++) {
        let curr_score = this.move_score(c, [...this.grid]);
        const i = (this.grid[c]).findIndex(y => !y);
        if (i === -1) { move_scores.push(0); continue; }
        let temp_grid = [];
        this.grid.forEach(v => {
          temp_grid.push([...v]);
        });
        temp_grid[c][i] = 2;
        const above = this.move_score(c, temp_grid);
        if (((above[1][0] && !(curr_score[1][1])) || (above[1][1] && !(curr_score[1][0])))) { move_scores.push(0); }
        else {
          if (curr_score[1][1]) {
            move_scores.push(true);
          } else if (curr_score[1][0]) {
            move_scores.push(true);
          } else {
            move_scores.push(curr_score[0]);
          }
        }
      }
      return move_scores;
  }
    
  move_score(c, g) { // Get the score of a move
      let wins = [false, false];
      let score = 0;
      let cscore = [0, 0];
      const index = (g[c]).findIndex(y => !y);
      if (index === -1) { return [0, wins] };
      const dirs = [[0, 1, 0], [0, -1, 0], [1, 0, 1], [-1, 0, 1], [-1, -1, 2], [1, 1, 2], [-1, 1, 3], [1, -1, 3]];
      for (let d = 0; d < dirs.length; d++) {
        if (d > 0 && dirs[d][2] !== dirs[d - 1][2]) { score += this.score_formula(...cscore); cscore = [0, 0]; }
        if (this.out_bounds(c + dirs[d][0], 0) || this.out_bounds(index + dirs[d][1], 1)) { continue; }
        let coords = [c + dirs[d][0], index + dirs[d][1]];
        const p = g[coords[0]][coords[1]];
        let current = p;
        if (!p) { continue; }
        while (!(this.out_bounds(coords[0], 0)) && !(this.out_bounds(coords[1], 1))) {
          try{
            current = g[coords[0]][coords[1]];
          } catch(error){
            console.log("Catched out of bounds")
            current = 1;
          }
          
          if (current !== p) { break; }
          cscore[p - 1]++;
          coords[0] += dirs[d][0];
          coords[1] += dirs[d][1];
        }
        if (cscore[0] >= (this.win_size - 1)) { wins[0] = true; }
        else if (cscore[1] >= (this.win_size - 1)) { wins[1] = true; }
      }
      score += this.score_formula(...cscore);
      return [score, wins];
    }
    
  score_formula(x,y){
      return Math.pow(x + y, 3);
    }
    
  out_bounds(n, di) {
      if (di === 0 && (n > 6 || n < 0)) return true;
      else if (di === 1 && (n > 5 || n < 0)) return true;
      return false;
    }

  }

  module.exports = AI_Algorithm;