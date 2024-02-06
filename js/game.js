'use strict'

const WALL = '🧱'
const FOOD = '•'
const SUPER_FOOD = '🌀'
const EMPTY = ' '
const CHERRY = '🍒'

const WALL_IMG = `<span><img class="wall" src="img/wall.png" /></span>`
const SUPER_FOOD_IMG = `<span><img class="super-food" src="img/potion.png" /></span>`

// Model
const gGame = {
    score: 0,
    isOn: false
}
var gBoard
var gFoodCount
var gCherryInterval

function onInit() {
    playAudio('start.mp3')
    updateScore(0)
    gFoodCount = 0
    gDeadGhosts = []
    gPacmanImg = getPacmanHTML('right')
    gBoard = buildBoard()
    createGhosts(gBoard)
    createPacman(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
    closeModal()
    clearInterval(gCherryInterval)
    gCherryInterval = setInterval(addCherries, 15000)
    gFoodCount = getFoodCount()
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD
            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }
        }
    }
    board[1][1] = board[1][size - 2] = board[size - 2][size - 2] = board[size - 2][1] = SUPER_FOOD
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (cell === GHOST) cell = getGhostHTML(gGhosts[getGhostIdx({ i, j })])
            else if (cell === PACMAN) cell = gPacmanImg
            else if (cell === WALL) cell = WALL_IMG
            else if (cell === SUPER_FOOD) cell = SUPER_FOOD_IMG

            const className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}


function updateScore(diff) {
    if (!diff) {
        gGame.score = 0
    } else {
        gGame.score += diff
    }
    document.querySelector('span.score').innerText = gGame.score
}

function gameOver() {
    openModal()
    console.log('Game Over')
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    gGame.isOn = false
}

function pacmanHitsGhost(location) {
    if (!gPacman.isSuper) {
        updateGameOverMsg(false)
        gameOver()
        playAudio('lose.wav')
        return
    }
    const ghostIdx = getGhostIdx(location)
    moveGhostToDead(ghostIdx)
}

function getFoodCount() {
    var foodCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j] === FOOD) foodCount++
        }
    }
    return foodCount
}

function checkVictory() {
    if (gFoodCount === 1) return true
    return false
}

function addCherries() {
    const emptyCells = getEmptyCells(gBoard)
    if (emptyCells.length === 0) return
    const idx = getRandomIntInclusive(0, emptyCells.length - 1)
    const location = emptyCells[idx]
    gBoard[location.i][location.j] = CHERRY
    renderCell(location, CHERRY)
}

function updateGameOverMsg(isWin) {
    var msg = isWin ? 'You Win! 👑' : 'You Lost 😞'
    document.querySelector('.msg').innerText = msg
}

