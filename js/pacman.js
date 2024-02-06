'use strict'

const PACMAN = '😀'
const SUPER_INTERVAL = 5000

var gPacman
var gPacmanImg = getPacmanHTML('right')

function createPacman(board) {
    gPacman = {
        location: { i: 2, j: 2 },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function onMovePacman(ev) {
    if (!gGame.isOn) return

    const nextLocation = getNextLocation(ev.key)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === WALL) return

    if (nextCell === GHOST) {
        pacmanHitsGhost(nextLocation)
    }

    if (nextCell === FOOD) {
        playAudio('bite.mp3')
        updateScore(1)
        gFoodCount = getFoodCount()
    }

    if (nextCell === CHERRY) {
        playAudio('bite.mp3')
        updateScore(10)
    }

    if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) return
        gPacman.isSuper = true
        var currGhosts = document.querySelectorAll('.ghost')
        for (var i = 0; i < currGhosts.length; i++) {
            currGhosts[i].classList.add('super')
        }

        setTimeout(() => { gPacman.isSuper = false }, SUPER_INTERVAL);
    }

    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY

    renderCell(gPacman.location, EMPTY)

    //Move the pacman to new location:
    //update the model
    gPacman.location = nextLocation
    gBoard[nextLocation.i][nextLocation.j] = PACMAN

    // update the DOM
    renderCell(nextLocation, gPacmanImg)

    var isWin = checkVictory()
    if (isWin) {
        updateGameOverMsg(isWin)
        gameOver()
        playAudio('win.wav')
    }
}

function getNextLocation(eventKeyboard) {
    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard) {
        case 'ArrowUp':
            gPacmanImg = getPacmanHTML('up')
            nextLocation.i--
            break;
        case 'ArrowRight':
            gPacmanImg = getPacmanHTML('right')
            nextLocation.j++
            break;
        case 'ArrowDown':
            gPacmanImg = getPacmanHTML('down')
            nextLocation.i++
            break;
        case 'ArrowLeft':
            gPacmanImg = getPacmanHTML('left')
            nextLocation.j--
            break;
    }
    return nextLocation
}

function getPacmanHTML(direction) {
    var str = `<img class="pacman ${direction}" src="img/pacman.png" />`
    return `<span>${str}</span>`
}