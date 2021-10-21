let board = [
    1,2,3,
    4,5,6,
    7,8,9
];

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
        if(doesPlayerWins("x")) {
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
        if(doesPlayerWins("o")) {
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
        if (!botWinningMove()) {
            if (!botBlockingMove()) {
                if (!botCenterMove()) {
                    let pos = getRandomInt(8);
                    while (board[pos] === "x" || board[pos] === "o") {
                        pos = getRandomInt(8);
                    }
                    console.log("placing at random " + pos);
                    botPlaceo(pos);
                }
            }
        }
    }
}

function botCenterMove(){
    if(board[4] !== "o" && board[4] !== "x"){
        console.log("center move")
        botPlaceo(4);
        return true;
    }
    return false;
}

function botBlockingMove(){
    for(let k = 0; k < lines.length; k++){
        let ln = lines[k];
        let x = 0;
        let emptyPos = -1;
        for(let i = 0; i < 3; i++){
            if(board[ln[i]] === "x"){
                x++;
            }
            else if(board[ln[i]] !== "o"){
                emptyPos = ln[i];
            }
        }
        if(x === 2 && emptyPos !== -1){
            console.log("block pos " + emptyPos);
            botPlaceo(emptyPos);
            return true;
        }
    }


    return false;
}


function botWinningMove(){
    for(let k = 0; k < lines.length; k++){
        let ln = lines[k];
        let o = 0;
        let emptyPos = -1;
        console.log(ln);
        for(let i = 0; i < 3; i++){

            if(board[ln[i]] === "o"){
                o++;
            }
            else if(board[ln[i]] !== "x"){
                emptyPos = ln[i];
            }
        }
        if(o === 2 && emptyPos !== -1){
            console.log("win pos " + emptyPos);
            botPlaceo(emptyPos);
            return true;
        }
    }
    return false;
}

function botPlaceo(pos){
    spaces[pos].addSymbolO(document.getElementById(spaces[pos].id));
    board[pos] = 'o';
    switchTurns(player1, player2);
    spaces[pos].played = true;
    placed++;

}


function doesPlayerWins(player){
    for(let k = 0; k < lines.length; k++){
        let ln = lines[k];
        if(board[ln[0]] === player && board[ln[1]] === player && board[ln[2]] === player){
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