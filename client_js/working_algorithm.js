let moves = 0;
let mid_stop = false;
let won = false;
let previous_move = 0;
let grid = [[0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0]];
let past = [];

let my_player = 0;

function make_move(player, col) {
    if (!won) {
        if (moves === 0) { }
        const index = grid[col].findIndex(y => !y);
        if (index != -1) {
            const win = move_score(col, [...grid]);
            if (win[1][0] && player === 1) {
                won = true;
            } else if (win[1][1] && player === 2) {
                won = true;
            }
            grid[col][index] = player;
            past.push([player, index, col]);
            moves++;
            previous_move = col;
        }
    }
}

function update_grid(new_grid) {
    grid = new_grid;
}


function ai() {
    if (!(grid[3][5]) && (!grid[3][4]) && !(mid_stop)) {
      make_move(2, 3);
    } else {
      const move_scores = get_scores();
      for (let m = 0; m < move_scores.length; m++){
        if (move_scores[m] === true){
          make_move(2,m);
          //document.getElementById("move").innerHTML = move_scores.join(" ");
          //document.getElementById("col").innerHTML = m;
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
      // const sum = move_scores.reduce((x, y) => x + y);
      // if (!sum) { computer_random(); }
      // else { make_move(2, index); }
      make_move(2, index);
      //document.getElementById("move").innerHTML = move_scores.join(" ");
      //document.getElementById("col").innerHTML = index;
    }
}

function computer_random() {
    if (moves < 42) {
      const r = Math.floor(Math.random() * 7);
      const index = grid[r].findIndex(y => !y);
      index != -1 ? make_move(2, r) : computer_random();
    }
}

  
function get_scores() {
    let move_scores = [];
    for (let c = 0; c < 7; c++) {
      let curr_score = move_score(c, [...grid]);
      const i = (grid[c]).findIndex(y => !y);
      if (i === -1) { move_scores.push(0); continue; }
      let temp_grid = [];
      grid.forEach(v => {
        temp_grid.push([...v]);
      });
      temp_grid[c][i] = 2;
      const above = move_score(c, temp_grid);
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
  
function move_score(c, g) {
    let wins = [false, false];
    let score = 0;
    let cscore = [0, 0];
    const index = (g[c]).findIndex(y => !y);
    if (index === -1) { return [0, wins] };
    const dirs = [[0, 1, 0], [0, -1, 0], [1, 0, 1], [-1, 0, 1], [-1, -1, 2], [1, 1, 2], [-1, 1, 3], [1, -1, 3]];
    for (let d = 0; d < dirs.length; d++) {
      if (d > 0 && dirs[d][2] !== dirs[d - 1][2]) { score += score_formula(...cscore); cscore = [0, 0]; }
      if (out_bounds(c + dirs[d][0], 0) || out_bounds(index + dirs[d][1], 1)) { continue; }
      let coords = [c + dirs[d][0], index + dirs[d][1]];
      const p = g[coords[0]][coords[1]];
      let current = p;
      if (!p) { continue; }
      while (!(out_bounds(coords[0], 0)) && !(out_bounds(coords[1], 1))) {
        current = g[coords[0]][coords[1]];
        if (current !== p) { break; }
        cscore[p - 1]++;
        coords[0] += dirs[d][0];
        coords[1] += dirs[d][1];
      }
      if (cscore[0] >= (win_size - 1)) { wins[0] = true; }
      else if (cscore[1] >= (win_size - 1)) { wins[1] = true; }
    }
    score += score_formula(...cscore);
    return [score, wins];
  }
  
function score_formula(x,y){
    return Math.pow(x + y, 3);
  }
  
function out_bounds(n, di) {
    if (di === 0 && (n > 6 || n < 0)) return true;
    else if (di === 1 && (n > 5 || n < 0)) return true;
    return false;
  }


