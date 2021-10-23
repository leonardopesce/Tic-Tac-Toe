let board = [
    1,2,3,
    4,5,6,
    7,8,9
];

let pl = "x";
let bt = "o";
let WIN = 1000;
let LOSS = -1000;
let DRAW = 0;

let sides = [
    0,1,2,
    3,5,
    6,7,8
];

let corners = [0,2,6,8];

let edges = [1,3,5,7];

let lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let placed = 0;

let p1Counter = 1;
let p2Counter = 1;

class Player {
    constructor() {
        this.isTurn = false;
        this.win = false;
    }
}

class Node{
    constructor(board, placed, player) {
        this.board = board;
        this.placed = placed;
        this.player = player;
    }

    isEmpty(x){
        if(this.board[x] !== pl && this.board[x] !== bt){
            return true;
        }
        return false;
    }

    notPlayer(){
        return notPlayer(this.player);
    }
}


class Space {
    constructor(id) {
        this.played = false;
        this.id = id;
    }

    addSymbolX(space) {
        $(space).append("<div class='x'>X</div>");
    }

    addSymbolO(space) {
        $(space).append("<div class='o'>O</div>");
    }
}

//create players
const player1 = new Player();
const player2 = new Player();

//create spaces
let spaces = [new Space('one'), new Space('two'), new Space('three'),
            new Space('four'), new Space('five'), new Space('six'),
            new Space('seven'), new Space('eight'), new Space('nine')];

//switch turns
function switchTurns(one, two) {
    one.isTurn = true;
    two.isTurn = false;
}

//gameplay
player1.isTurn = true;

$('.grid').on('click', (e) => {

    if(player1.win !== true && player2.win !== true && player1.isTurn && !player2.isTurn) {
        for(let i = 0; i < 9; i++){
            if(e.target.id === spaces[i].id && spaces[i].played === false) {
                if(player1.isTurn) {
                    spaces[i].addSymbolX(e.target);
                    board[i] = 'x';
                    switchTurns(player2, player1);
                    spaces[i].played = true;
                    placed++;
                }
            }
        }


        //check if playerX wins
        if(doesPlayerWins(pl, board)) {
            $('.header').text('Player Wins!');
            $('.header').css('color', 'tomato');
            $('.p1').text ('Player: '+ p1Counter);
            p1Counter += 1;
            player1.win = true;
        }
        if(player2.isTurn && !player1.win) {
            botPlay();
        }


        // check if player 2 wins
        if(doesPlayerWins(bt, board)) {
            $('.header').text('Bot Wins!');
            $('.header').css('color', '#33DBFF');
            $('.p2').text ('Bot: ' + p2Counter);
            p2Counter += 1;
            player2.win = true;
        }
    }
});

function botPlay(){
    if(placed < 9) {
        let pos = playerWinningMove(board.slice(), bt);
        if (pos === -1) {
            pos = playerBlockingMove(board.slice(), bt);
            if (pos === -1) {
                pos = botCenterMove();
                if (pos === -1) {
                    console.log("alpha beta pruning");
                    pos = alphaBeta(new Node(board.slice(), placed, bt), -Infinity, Infinity)[1];
                }
            }
        }
        botPlaceo(pos);
    }
}

function alphaBeta(node, alpha, beta) {
    let bestMove = -1
    let bestScore = node.player === bt ? LOSS : WIN;
    if (node.placed === 9 || whoWins(node.board) !== DRAW) {
        return [whoWins(node.board), bestMove];
    }


    for (let k = 0; k < sides.length; k++) {
        if (node.isEmpty(sides[k])) {
            let tBoard = node.board.slice();
            tBoard[sides[k]] = node.player;
            let res = alphaBeta(new Node(tBoard, node.placed + 1, node.notPlayer()), alpha, beta)[0];

            if (node.player === bt) {
                if (bestScore < res) {
                    bestMove = sides[k];
                    bestScore = res - node.placed * 10;

                    alpha = Math.max(alpha, bestScore);
                    if (alpha >= beta) {
                        break;
                    }
                }
            }
            else{
                if (bestScore > res) {
                    bestMove = sides[k];
                    bestScore = res + node.placed * 10;

                    beta = Math.max(beta, bestScore);
                    if (alpha >= beta) {
                        break;
                    }
                }
            }
        }
    }

    return [bestScore, bestMove];
}


function notPlayer(player){
    if(player === pl){
        return bt;
    }
    else{
        return pl;
    }
}

function whoWins(tBoard){
    if(doesPlayerWins(pl, tBoard)){
        return LOSS;
    }
    else if(doesPlayerWins(bt, tBoard)){
        return WIN;
    }
    else {
        return DRAW;
    }
}

function botCenterMove(){
    if(board[4] !== bt && board[4] !== pl){
        return 4;
    }
    return -1;
}

function playerBlockingMove(tBoard, player){
    for(let k = 0; k < lines.length; k++){
        let ln = lines[k];
        let x = 0;
        let emptyPos = -1;
        for(let i = 0; i < 3; i++){
            if(tBoard[ln[i]] === notPlayer(player)){
                x++;
            }
            else if(tBoard[ln[i]] !== player){
                emptyPos = ln[i];
            }
        }
        if(x === 2 && emptyPos !== -1){
            return emptyPos;
        }
    }
    return -1;
}

function playerWinningMove(tBoard, player){
    for(let k = 0; k < lines.length; k++){
        let ln = lines[k];
        let o = 0;
        let emptyPos = -1;

        for(let i = 0; i < 3; i++){

            if(tBoard[ln[i]] === player){
                o++;
            }
            else if(tBoard[ln[i]] !== notPlayer(player)){
                emptyPos = ln[i];
            }
        }
        if(o === 2 && emptyPos !== -1){
            return emptyPos;
        }
    }
    return -1;
}

function botPlaceo(pos){
    spaces[pos].addSymbolO(document.getElementById(spaces[pos].id));
    board[pos] = 'o';
    switchTurns(player1, player2);
    spaces[pos].played = true;
    placed++;

}


function doesPlayerWins(player, tBoard){
    for(let k = 0; k < lines.length; k++){
        let ln = lines[k];
        if(tBoard[ln[0]] === player && tBoard[ln[1]] === player && tBoard[ln[2]] === player){
            return true;
        }
    }
    return false;
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

$('.reset').on('click', () => {
    player1.isTurn = true;
    player2.isTurn = false;
    player1.win = false;
    player2.win = false;
    $('.x').remove();
    $('.o').remove();
    $('.header').text('Tic Tac Toe');
    board = [1,2,3,4,5,6,7,8,9];
    for(let i = 0; i < 9; i++){
        spaces[i].played = false;
    }
    placed = 0;
});