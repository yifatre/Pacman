'use strict'

const GHOST = '👻'

var gGhosts = []
var gDeadGhosts = []

var gIntervalGhosts

function createGhosts(board) {
    gGhosts = []
    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }

    if (gIntervalGhosts) clearInterval(gIntervalGhosts)
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function createGhost(board) {
    const ghost = {
        location: { i: 2, j: 6 },
        currCellContent: FOOD,
        colorShift: getRandomIntInclusive(0, 360)
    }

    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST
}

function moveGhosts() {
    if (gGhosts.length === 0) return
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    const moveDiff = getMoveDiff()
    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    if (nextCell === SUPER_FOOD) return

    if (nextCell === PACMAN) {
        pacmanHitsGhost()
        if (gPacman.isSuper) return
    }

    // moving from current location:
    // update the model 
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // update the DOM
    renderCell(ghost.location, ghost.currCellContent)


    // Move the ghost to new location:
    // update the model 
    ghost.location = nextLocation
    ghost.currCellContent = nextCell
    gBoard[nextLocation.i][nextLocation.j] = GHOST

    // update the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostIdx(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === location.i && gGhosts[i].location.j === location.j) return i
    }
    return null
}

function moveGhostToDead(ghostIdx) {
    const ghost = gGhosts.splice(ghostIdx, 1)[0]
    ghost.currCellContent = EMPTY
    gDeadGhosts.push(ghost)
    setTimeout(bringGhostsToLife, SUPER_INTERVAL);
}

function bringGhostsToLife() {
    while (gDeadGhosts.length > 0) {
        gGhosts.push(gDeadGhosts.pop())
    }
}

function getGhostHTML(ghost) {
    var imgStr
    var colorShift
    if (gPacman.isSuper) {
        imgStr = 'img/white_ghost.png'
        colorShift = 0
    }
    else {
        imgStr = 'img/ghost.png'
        colorShift = ghost.colorShift
    }
    var str = `<img class="ghost" style="filter: hue-rotate(${colorShift}deg);" src="${imgStr}" />`
    return `<span>${str}</span>`
}