'use strict'
  
// const GAMER_IMG = '<img src="img/gamer.png">'
// const WIN_SOUND = new Audio('sound/win.wav')
// WIN_SOUND.play()


function countNeighbors(board, pos){
    
    var countNeighbors=0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === pos.i && j === pos.j) continue
            if (board[i][j].isMine) {countNeighbors++}
        }
    }
    return countNeighbors

}




function getRandomIntInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}
