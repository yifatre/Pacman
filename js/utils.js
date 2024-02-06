'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function playAudio(audioFileName) {
    const sound = new Audio(`audio/${audioFileName}`)
    sound.play()
}

function getEmptyCells(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] === EMPTY) emptyCells.push({ i, j })
        }
    }
    return emptyCells
}

function openModal() {
    document.querySelector('.modal').classList.remove('hide')
}

function closeModal() {
    document.querySelector('.modal').classList.add('hide')
}
