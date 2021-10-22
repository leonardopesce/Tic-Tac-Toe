let board = [
    1,2,3,
    4,5,6,
    7,8,9
];

let pl = "x";
let bt = "o";

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
        this.value = -2;

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

class Tree{
    constructor() {
        this.value = -2;
        this.pos = -1;
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
                    pos = alphaBetaPruning(board);
                }
            }
        }
        botPlaceo(pos);
    }
}

function alphaBetaPruning(tBoard){
    let tree = new Tree();
    for(let i = 0; i < sides.length; i++){
        let tempBoard = tBoard.slice();
        if(tempBoard[sides[i]] !== bt && tempBoard[sides[i]] !== pl){
            console.log("found a empty space");
            tempBoard[sides[i]] = bt;
            let tempNodeValue = minMaxNode(new Node(tempBoard, placed + 1, pl), -2, 2);
            if(tree.value === -2){
                tree.value = tempNodeValue;
                tree.pos = sides[i];
            }
            else if(tree.value < tempNodeValue){
                tree.value = tempNodeValue;
                tree.pos = sides[i];

            }
            //console.log("side " + sides[i] + " value " + tree.value + " tempNodeValue " + tempNodeValue);
            if(tree.value === 1){
                return tree.pos;
            }
        }

    }
    return tree.pos;
}

function minMaxNode(node, alpha, beta){
    if(node.placed === 9){
        //console.log("win " + node.value);
        return whoWins(node.board);
    }

    if(node.player === pl){
        let minEval = 2;
        for(let k = 0; k < sides.length; k++){
           if(node.isEmpty(sides[k])){
                minEval = Math.min(
                    minEval,
                    minMaxNode(new Node(node.board.slice(), node.placed + 1, node.notPlayer()), alpha, beta)
                );
                beta = Math.min(beta, minEval);
                if(beta <= alpha){
                    break;
                }
                return minEval;
           }
        }
    }
    else if(node.player === bt){
        let maxEval = -2;
        for(let k = 0; k < sides.length; k++) {
            if (node.isEmpty(sides[k])) {
                maxEval = Math.max(
                    maxEval,
                    minMaxNode(new Node(node.board.slice(), node.placed + 1, node.notPlayer()), alpha, beta)
                );
                alpha = Math.max(alpha, maxEval);
                if (beta <= alpha) {
                    break;
                }
                return maxEval;
            }
        }
    }
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
        return -1;
    }
    else if(doesPlayerWins(bt, tBoard)){
        return 1;
    }
    else {
        return 0;
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