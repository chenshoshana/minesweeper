'use strict'
window.addEventListener("contextmenu", e => e.preventDefault());
var gBoard = []
var gTime = document.querySelector('h2 span').innerText
var gCurrCell;
var gMine;
var gShownCellsCount = 0
var gMarkedCellsCount = 0
var gFlag = '🚩';
var gBoardSize;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    score: 0,
    level: 4
}


function buildBoard(boardSize) {
    gBoardSize = boardSize
    gCurrCell = { id: 0, i: i, j: j }
    gMine = '💣'
    var board = []
    var mines;
    if (boardSize === 4) {
        mines = 2
    } else if (boardSize === 8) {
        mines = 12
    } else if (boardSize === 12) {
        mines = 30
    }

    for (var i = 0; i < boardSize; i++) {
        board.push([])
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = { i: i, j: j, isShown: false, minesAroundCount: 0, isMarked: false, isMine: false }

        }
    }
    for (var i = 0; i <= mines - 1; i++) {
        board[(Math.floor(Math.random() * boardSize))][Math.floor((Math.random() * boardSize))].isMine = true
    }
    setMinesNegsCount(board)
    console.log(board)
    return board
}

function init() {
    gGame.score = 0
    var smilie = document.querySelector('.smilie')
    smilie.innerText = '😃'
    setInterval(timer(), 1000)
    gBoard = buildBoard(gGame.level)
    renderBoard(gBoard)
    gGame.isOn = true
}

function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            strHTML += `<td onclick="cellClicked(this,${i},${j})" class=i${i}j${j}`
            strHTML += ` oncontextmenu="cellMarked(this,${i},${j})"></td>`

        }
    }
    strHTML += `</tr>`

    var elBoard = document.querySelector('.board')
    var elBox = document.querySelector('.box')
        //elBox.innerHTML = diffBtnHTML
    elBoard.innerHTML = strHTML
}

function timer() {
    gTime += 1

    return gTime
}

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            if (currCell.isMine === true) continue
            currCell.minesAroundCount = countMinesAround(board, currCell)
        }
    }
}

function countMinesAround(board, cell) {
    var minesAroundCount = 0
    for (var i = cell.i - 1; i <= cell.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = cell.j - 1; j <= cell.j + 1; j++) {
            if (j < 0 || j > board.length - 1) continue
            if (i === cell.i && j === cell.j) continue
            if (board[i][j].isMine) minesAroundCount++
        }
    }
    return minesAroundCount
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return

    var currCell = gBoard[i][j]
    if (currCell.isShown === false && currCell.isMarked === false) {
        currCell.isShown = true
        elCell.innerText = currCell.isMine ? gMine : currCell.minesAroundCount
        gShownCellsCount++
        elCell.style.backgroundColor = 'darkgray'
        if (!currCell.isMine) updateScore()
    }
    console.log('IsMINe in cell: ', currCell.isMine)
    if (currCell.isMine) {
        gGame.isOn = false
        var smilie = document.querySelector('.smilie')
        smilie.innerText = '🤯'
    }

    checkGameOver()
    console.log('gShownCellsCount', gShownCellsCount)
    return elCell
}

function cellMarked(elCell, i, j) {

    if (!gGame.isOn) return
    var currCell = gBoard[i][j]
    if (currCell.isShown === false) {
        if (currCell.isMarked === false) {
            currCell.isMarked = true
            elCell.innerText = gFlag
            gMarkedCellsCount++
        } else {
            currCell.isMarked = false
            elCell.innerText = ''
            gMarkedCellsCount--
        }
    }

    checkGameOver()
    console.log('gMarkedCellsCount', gMarkedCellsCount)
    return false
}

function checkGameOver() {
    if (!gGame.isOn) {
        alert('you are bombed!')
        showAll()
    }
    if (gShownCellsCount + gMarkedCellsCount === (gBoardSize * gBoardSize)) {
        gGame.isOn = false
        alert('you won!')
    }
}

function showAll() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].isShown = true
            var elCell = document.querySelector(`.i${i}j${j}`)
            elCell.innerText = gBoard[i][j].isMine ? gMine : gBoard[i][j].minesAroundCount
            elCell.style.backgroundColor = 'darkgray'
        }
    }
}

function updateScore() {
    gGame.score++
        document.querySelector('h2 span').innerText = gGame.score
}

function chooseLevel(cellsNum) {
    gGame.level = cellsNum
    init()

}

// function checkNegs(board, negs, ii, jj) {

//     var currCell = board[ii][jj]

//     if (currCell) return
//     elCell.innerText = currCell.isMine ? gMine : currCell.minesAroundCount
//     gShownCellsCount++
//     elCell.style.backgroundColor = 'darkgray'
//     if (!currCell.isMine) updateScore()
//     negs.forEach(element => checkNegs(negs, i, j));
//     for (var i = cell.i - 1; i <= cell.i + 1; i++) {
//         if (i < 0 || i > board.length - 1) continue
//         for (var j = cell.j - 1; j <= cell.j + 1; j++) {
//             if (j < 0 || j > board.length - 1) continue
//             if (!board[i][j].isMine) 
//         }
//     }
// }

function restartBtn() {

    init()
}