// ********** app.js **********

const cells = document.querySelectorAll('.cell');
const winnerText = document.getElementById('winner-text');
const endGameOverlay = document.getElementById('game-over');
const btnNextRound = document.getElementById('next-round');
const endMatchOverlay = document.getElementById('match-over');
const btnNewGame = document.getElementById('new-game');
const btnGameMode = document.getElementById('game-mode');
const btnReset = document.getElementById('reset-button');

const xClass = 'x';
const oClass = 'o';

let currentClass;
let endGameType;
let overlayDisplay;
let player1Score;
let player2Score;
let winner;
let gameMode = btnGameMode.value;

currentClass = xClass;

/*  How the board looks :   
        [0, 1, 2]
        [3, 4, 5]
        [6, 7, 8]  */

const winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

startGame();


// ---------- GENERAL START MATCH FUNCTION ----------


function startGame(){
    
    player1Score = 0;
    player2Score = 0;

    scoreDisplay();
    clearCellMark();

    cells.forEach((cell) => {
        cell.removeEventListener('click', (e) => {
            boardCheck(e);
        })
        cell.addEventListener('click', (e) => {
            boardCheck(e);
        });
    });
};

function resetGame(){
    player1Score = 0;
    player2Score = 0;
    scoreDisplay();
    clearCellMark();
}


// ---------- CHECK BOARD AFTER EACH TURN ----------


function boardCheck(e){
    if (e.target.classList.contains(xClass) || e.target.classList.contains(oClass)){
        alert('You Must Make A Valid Move!');
    } else {
        addPlayerMove(e, currentClass);

        if (checkForWin(currentClass)){

            overlayDisplay = true;
            endGameDisplay(overlayDisplay);
            
            endGameType = 'win';
            endGame(endGameType);
           
        } else if (checkForDraw()){

            /*overlayDisplay = true;
            endGameDisplay(overlayDisplay);*/

            displayDraw();

            endGameType = 'draw';
            endGame(endGameType);

            switchClass(currentClass);

        } else {
            switchClass(currentClass);
            botMove(gameMode, currentClass);
        };
    };
};


// ---------- ADDING AND REMOVING CELL MARKS AND SWAPPING TURNS ----------


function clearCellMark(){
    cells.forEach(cell => {
        cell.classList.remove(xClass);
        cell.classList.remove(oClass);
    })
}

function addPlayerMove(e, currentClass){
    e.target.classList.add(currentClass);
};

function switchClass(classChange){
    switch(classChange){
        case xClass:
            return currentClass = oClass;
        case oClass:
            return currentClass = xClass;
    };
};


// ---------- SCORE KEEPING ----------


function addToScore(winner){
    switch(winner){
        case 'x':
            player1Score++;
            scoreDisplay();
            console.log("X's Win!");
            checkTotalWins();
            return
        
        case 'o':
            player2Score++;
            scoreDisplay();
            console.log("O's Win!");
            checkTotalWins();
            return
        
        default:
            console.log("Draw!");
            return
    };
};


// ---------- CHECKING FOR ROUND AND MATCH WINS ----------


function checkForWin(currentClass){
    return winConditions.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass)
        })
    })
};

function checkTotalWins(overlayDisplay){
    if (player1Score === 3 || player2Score === 3) {
        if (currentClass === xClass){
            document.getElementById('new-game-text').textContent = 
            `X's Win The Match!`;
        } else if (currentClass === oClass) {
            document.getElementById('new-game-text').textContent = 
            `O's Win The Match!`;
        };
        
        const winner = currentClass.toUpperCase();
        console.log(`${winner}'s Win The Match!`);

        overlayDisplay = false;
        endGameDisplay(overlayDisplay);

        endMatchOverlay.classList.add('show');
        btnNewGame.classList.add('show');
    };
};

function checkForDraw(){
    return [...cells].every(cell => {
        return cell.classList.contains(xClass) || cell.classList.contains(oClass);
    });
};


// ---------- END OF GAME/MATCH FUNCTIONS ----------


function endGame(typeOfEndGame){
    switch(typeOfEndGame){
        case 'win':
            addToScore(currentClass);
            return
        case 'draw':
            addToScore();    
            return
    };
};

function endGameDisplay(overlayDisplay){
    switch(overlayDisplay){
        case true:
            if (currentClass === xClass){
                document.getElementById('next-round-text').textContent = 
                `X's Win!`;
            } else if (currentClass === oClass) {
                document.getElementById('next-round-text').textContent = 
                `O's Win!`;
            };

            endGameOverlay.classList.add('show');
            btnNextRound.classList.add('show');

            return

        case false:
            
            endGameOverlay.classList.remove('show');
            btnNextRound.classList.remove('show');
            return
    };
};

function displayDraw(){
    document.getElementById('next-round-text').textContent = 
    `Draw!`;

    endGameOverlay.classList.add('show');
    btnNextRound.classList.add('show');
    return
}


// ---------- UPDATING SCORE DISPLAY ON SCREEN ----------


function scoreDisplay(){
    
    const playerScoreContainer = document.getElementById('player-1');
    const playerScoreDisplay = document.getElementById('player-1-score');
    
    playerScoreDisplay.textContent = player1Score;
    playerScoreContainer.appendChild(playerScoreDisplay);

    
    const botScoreContainer = document.getElementById('player-2');
    const botScoreDisplay = document.getElementById('player-2-score');

    botScoreDisplay.textContent = player2Score;
    botScoreContainer.appendChild(botScoreDisplay);

    const gameNumber = document.getElementById('game-number');
    gameNumber.textContent = `Game #${player1Score + player2Score + 1}`;
}


// ---------- NEW GAME BUTTON ----------


function newGameButton(){
    endMatchOverlay.classList.remove('show');
    btnNewGame.classList.remove('show');
};


// ---------- BOT MODE ----------


function checkMode(gameMode, currentClass){
    if(gameMode === 'bot-easy' && currentClass === oClass){
        botMove(gameMode, currentClass);
    }
};

function botMove(gameMode, currentClass){
    if (gameMode === 'bot-easy' && currentClass === oClass){
        let openCells = document.querySelectorAll('.cell:not(.x):not(.o)');
        let numberOfCells = openCells.length;
        let randomCell = Math.floor(Math.random()*numberOfCells);
        openCells[randomCell].classList.add('o');

    
        if (checkForWin(currentClass)){

            overlayDisplay = true;
            endGameDisplay(overlayDisplay);
            
            endGameType = 'win';
            endGame(endGameType);
           
        } else if (checkForDraw()){

            /*overlayDisplay = true;
            endGameDisplay(overlayDisplay);*/

            displayDraw();

            endGameType = 'draw';
            endGame(endGameType);

            switchClass(currentClass);
        } else{
            switchClass(currentClass);   
        } 
    };
};


// ---------- BUTTON EVENT LISTENERS ----------


btnNextRound.addEventListener('click', () => {   
    endGameDisplay(overlayDisplay === false);
    clearCellMark();
    checkMode(gameMode, currentClass);
});

btnNewGame.addEventListener('click', () => {
    clearCellMark();
    resetGame();
    newGameButton();
    checkMode(gameMode, currentClass);
});

btnGameMode.addEventListener('change', (e) => {
    gameMode = e.target.value;
    console.log(gameMode);
    currentClass = xClass;
    resetGame();
});

btnReset.addEventListener('click', resetGame);