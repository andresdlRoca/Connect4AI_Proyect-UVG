canvas.height = window.innerHeight * 0.5;
canvas.width = (canvas.height/6) * 7;
canvas.addEventListener("mousedown", player_click);
const c = document.getElementById("canvas").getContext("2d");
let pixel_size = canvas.width / 7;
const win_size = 4;
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

function make_move(player, col) {
  if (!won) {
    if (moves === 0) { document.getElementById("button").remove(); }
    const index = grid[col].findIndex(y => !y);
    if (index != -1) {
      const win = move_score(col, [...grid]);
      if (win[1][0] && player === 1) {
        document.getElementById("win").innerHTML = "RED WINS";
        document.getElementById("win").setAttribute("style", "color:red;");
        won = true;
      } else if (win[1][1] && player === 2) {
        document.getElementById("win").innerHTML = "BLUE WINS";
        document.getElementById("win").setAttribute("style", "color:blue;");
        won = true;
      }
      grid[col][index] = player;
      past.push([player, index, col]);
      moves++;
      pixel(col, index, player);
      previous_move = col;
    }
  }
}

function undo() {
  if (past.length) {
    const last = past[past.length - 1];
    past.pop();
    grid[last[2]][last[1]] = 0;
    pixel(last[2], last[1], 0);
  }
}

function grid_grid() {
  c.fillStyle = "gray";
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      c.rect(i * pixel_size, j * pixel_size, pixel_size, pixel_size);
      c.stroke();
    }
  }
}

function player_click(e) {
  if (moves < 42) {
    mid_stop = true;
    const col = ((e.x - canvas.offsetLeft) / pixel_size) | 0;
    make_move(1, col);
    ai();
  }
}

function computer_random() {
  if (moves < 42) {
    const r = Math.floor(Math.random() * 7);
    const index = grid[r].findIndex(y => !y);
    index != -1 ? make_move(2, r) : computer_random();
  }
}

function pixel(x, y, p) {
  if (p == 1) { c.fillStyle = "#ff5a66"; }
  else if (p === 2) { c.fillStyle = "#5a66ff"; }
  else c.fillStyle = "white";
  c.fillRect(x * pixel_size + 2, (5 - y) * pixel_size + 2, pixel_size - 4, pixel_size - 4);
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

window.onresize = function(){
  canvas.height = window.innerHeight * 0.5;
  canvas.width = (canvas.height/6) * 7;
  pixel_size = canvas.width / 7;
  c.clearRect(0,0,canvas.width, canvas.height);
  grid_grid();
  for (let x = 0; x < grid.length; x++){
    for (let y = 0; y < grid[x].length; y++){
      if (grid[x][y] === 1){
        pixel(x,y,1);
      }else if (grid[x][y] === 2){
        pixel(x,y,2)
      }
    }
  }
}

grid_grid();