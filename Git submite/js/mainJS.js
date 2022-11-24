'use strict'

// build a mine sweeper game

// the model

const MINE='🤯'
const FLAG='🚩'
const EMPTY=''

const BOOM=`<img class="boom" src='img/boom.jfif' alt='boom'/>`



var gBoard=[]
var stopWatchInterval
var flashingInteval



// board character
var gLevel={
    size: 4,
    Mines:3,
}

var gGame={
    isOn:false,
    showCount:0,
    markedCount:0,
    secsPassed: 0,
    lives:3,
    hint:3,
    hitOn: false,
    safeOn:false,
    safe:3

}




function onInit(){
// inisation function
    document.querySelector(".markers span").innerText=gLevel.Mines
    gBoard=buildBoard()
    //saveClick()
    renderBoard()

}


// DONE: Builds the board
function buildBoard() {
    var board=[]
    for (var i = 0; i < gLevel.size; i++) {
        board.push([])
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShow: false,
                isMine: false,
                isMarked: false}

            }
        }
    // DONE Treturn the created board
    return board
}

// DONE:rander Board
function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
      strHTML += '<tr>'
      for (var j = 0; j < gBoard[0].length; j++) {
        var cell = gBoard[i][j]
        
        // class the cell show or unshow
        var className=`cell cell-${i}-${j}`
        var value=''
        if (cell.isShow) {
            className+=' show'
            if (cell.isMine) {value=BOOM
            }else if (cell.minesAroundCount){value=cell.minesAroundCount} 
        }else if (cell.isMarked){
            className+=" mark"
            value=FLAG
        }else{className+=' unshow'}
        //cell Data
        var cellData = 'data-i="' + i + '" data-j="' + j + '"'
        strHTML += `<td ${cellData} class="${className}" 
            onclick="onCellClicked(event,${i},${j})" 
            onContextMenu="cellMarked(${i},${j})">
            ${value}
            </td>`
      }

      strHTML += '</tr>\n' 
    //   strHTML +=`<input onkeydown="saveCommand(event)" value="Hello World"/>`
    }
    
    var elBoard = document.querySelector('.board-continer')
    elBoard.innerHTML = strHTML
}

// DONE Called when a cell (td) is clicked
function onCellClicked(ev,i, j){
    if (!gGame.secsPassed) {startGame({i:i,j:j})}
    if (!gGame.isOn) return
    if(ev.button!==0)return
    if (gGame.hitOn){showTheHint({i:i,j:j}); return}

    // TODO to chack is is mine
    if (gBoard[i][j].isMine){
        // stepOnMine({i:i,j:j})
        itsMine ({i:i,j:j})
        return
    }
    // DONE open the neighors cell in who is not a mine
    // expandShown ({i:i,j:j}) disable for full expend function
    fullExpend({i:i,j:j})
    renderBoard()
    checkGameOver() 
}

// DONE set the mine and timer on the start of the game
function startGame(loc){
    gGame.isOn=true
    
    gGame.secsPassed= Date.now()
    
    
    // DONN random a plase to the mine
    randomMinePlace(loc)
    
    // DONE: Call setMinesNegsCount(board)
    gBoard=setMinesNegsCount(gBoard)

    renderBoard()

    // DONE start stopwatch
    stopWatchInterval=setInterval(()=>{
        var time =((Date.now()-gGame.secsPassed)/1000).toFixed(2)
        document.querySelector(".timer span").innerText=time
    },100)
}

// DONE raction to stepping on a mine
function endOflife(loc){
    const worngMark=[]
    for (var i=0; i<gBoard.length;i++){
        for (var j=0; j<gBoard[0].length;j++){
        if (gBoard[i][j].isMine && !gBoard[i][j].isMarked){
            gBoard[i][j].isShow=true
        }
        if (gBoard[i][j].isMarked && !gBoard[i][j].isMine){
            worngMark.push({i:i,j:j}) 
        }
    }
    }
    stopGame()
    renderBoard()
    const elCell = document.querySelector(`.cell-${loc.i}-${loc.j}`)
    elCell.classList.add("hit")

    for (var i=0;worngMark.length>i;i++){
        var loc=worngMark[i]
        const elCell = document.querySelector(`.cell-${loc.i}-${loc.j}`)
        console.log(elCell)
        elCell.classList.remove("mark")
        elCell.classList.add("hit")
    }

    
}

// DONE stop the clock and the gGame to false
function stopGame(){
    clearInterval(stopWatchInterval)
    gGame.isOn=false
    
}

// DONE Count mines around each cell 
function setMinesNegsCount(board){
    for (var i=0; i<board.length;i++){
        for (var j=0;j<board[0].length;j++)
        if (!board[i][j].isMine){
// DONE set the cell's minesAroundCount.
            board[i][j].minesAroundCount=countNeighbors(board, {i:i,j:j})}
    }
    return (board)
}

//  On right click it mark the cell with suspected mine
function cellMarked(i,j){
    if ((gLevel.Mines-gGame.markedCount)<=0) return
    if (!gGame.secsPassed) return
    if (!gGame.isOn || gGame.hitOn ||gGame.safeOn) return
    // DONE to make sure is not a shown cell
    if (gBoard[i][j].isShow){return}
    //saveClick()
    // DONE to remove a flag in case is with flag
    if (gBoard[i][j].isMarked){
        gGame.markedCount--
        gBoard[i][j].isMarked=false 
    // DONE to add a flag if thier isnt on
    }else{ 
        gBoard[i][j].isMarked=true
        gGame.markedCount++}
    renderBoard()
    // update the flag count
    document.querySelector(".markers span").innerText=gLevel.Mines-gGame.markedCount
    checkGameOver()
}


// DONE chack of game gamer as won
function checkGameOver(){
    // Chack in all the cells if show and isMine are not the same
    // And chack if isMine and flag the same
    for (var i=0;i<gBoard.length;i++){
        for (var j=0; j<gBoard[0].length;j++){
            var cell=gBoard[i][j]
            if (!cell.isMine && !cell.isShow) return
            if (cell.isMine){
                if (!cell.isMarked && !cell.isShow) return
            }
        }
    }
        // document.querySelector(".status span" ).innerText="😎"
    
    document.querySelector(".png").src='img/won.png'
    clearInterval(stopWatchInterval)
    gGame.isOn=false
    // recordCounting()
}

// DONE restart the game status
 function restart(){

    clearInterval(stopWatchInterval)
    stopWatchInterval=''
    document.querySelector(".png").src='img/game.png'
    document.querySelector(".timer span" ).innerText="00.00"
    document.querySelector(".markers span" ).innerText=gLevel.Mines
    
    gGame.lives=3
    gGame.secsPassed=0
    gGame.showCount=0
    gGame.markedCount=0
    gGame.hint=3
    gGame.safeOn=false,
    gGame.safe=3
    gGame.isOn=false

    document.querySelector(".shortH span").innerText="🎃🎃🎃"
    document.querySelector(".safeC span").innerText=gGame.safe




    // make that mine are more the lives
    if (gLevel.Mines<3){gGame.lives=gLevel.Mines}

    livesShown()
    gBoard=buildBoard()
    //saveClick()
    renderBoard()
 }

// DONE heart show
function livesShown(){
    var value=""
    for (var h=0;h<gGame.lives;h++){value+="💗"}
    document.querySelector(".left span").innerText=value
}

// DONE Stop the game show all the unmarked mine
function itsMine(loc){
    gBoard[loc.i][loc.j].isShow=true
    gBoard[loc.i][loc.j].isMarked=false
    renderBoard()
    gGame.lives--   
    livesShown()
    // mark the mine
    const elCell = document.querySelector(`.cell-${loc.i}-${loc.j}`)
    elCell.classList.add("hit")
    if (gGame.lives<1){
        endOflife(loc)
        // gGame.isOn=false
        // document.querySelector(".status span" ).innerText="🤯"
        document.querySelector(".png").src='img/dead.png'
        // clearInterval(stopWatchInterval)
        }
}


// DONE show all the neigbhors around the wanted cell
function expandShown(loc){
    for (var i=loc.i-1;i<=loc.i+1;i++){
        if (i<0 || i>gBoard.length-1) continue
        for (var j=loc.j-1;j<=loc.j+1;j++){
            if (j<0 || j>gBoard[0].length-1) continue
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShow){
                gBoard[i][j].isShow=true
                if (gBoard[i][j].isMarked){gBoard[i][j].isMarked=false}
                gGame.showCount++
            }
        }
    }
}

// DONE random a place to hold the mine
function randomMinePlace (loc){
    const freeCells=[]
    for (var i=0;i<gBoard.length;i++){

        for (var j=0; j<gBoard[0].length;j++){
            if (!gBoard[i][j].isMine){
                if (loc.i===i && loc.j===j)continue
                freeCells.push({i:i,j:j})
            }
        }
    }
    for (var i=0;i<gLevel.Mines;i++){
        var randerIdx=getRandomIntInt(0,freeCells.length-1)
        var selectedCell=freeCells[randerIdx]
        gBoard[selectedCell.i][selectedCell.j].isMine=true
        freeCells.splice(randerIdx,1)
    }
}

// DONE react to the size buttons
function changeLevel(level){
    gLevel.size=level
    gLevel.Mines=Math.floor(level) 
    restart()
}



// TODO function recordCounting(){
//     const time=((Date.now()-gGame.secsPassed)/1000).toFixed(2)
//     if (gLevel.size<=4)
//         if (sessionStorage.lowStageRecord>time){sessionStorage.lowStageRecord=time}
//         document.querySelector("#lev").innerText="Easy"
//         document.querySelector("#re").innerText=sessionStorage.lowStageRecord
//     // }else if (gLevel.size===6){
//     //     if (!sessionStorage.midStageRecord){sessionStorage.midStageRecord=0
//     //     } else if (sessionStorage.midStageRecord>time){sessionStorage.midStageRecord=time}
//     //     elRecored[0].innerText="Medium"
//     //     elRecored[1].innerText=sessionStorage.midStageRecord
//     // }else if (gLevel.size===9){
//     //     if (!sessionStorage.highStageRecord){sessionStorage.highStageRecord=0
//     //     } else if  (sessionStorage.highStageRecord>time){sessionStorage.highStageRecord=time}
//     //     elRecored[0].innerText="High"
//     //     elRecored[1].innerText=sessionStorage.highStageRecord
//     // }else {
//     //     sessionStorage.superStageRecord=time
//     //     if (!sessionStorage.superStageRecord){sessionStorage.superStageRecord=0
//     //     } else if  (sessionStorage.superStageRecord>time){sessionStorage.superStageRecord=time}
//     //     elRecored[0].innerText="High"
//     //     elRecored[1].innerText=sessionStorage.superStageRecord
//     // }
// }
// 
// function 
// function 
// function 

// DONE full expend function when click
function fullExpend(loc){
    for (var i=loc.i-1;i<=loc.i+1;i++){
        if (i<0 || i>gBoard.length-1) continue
        for (var j=loc.j-1;j<=loc.j+1;j++){
            if (j<0 || j>gBoard[0].length-1) continue
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShow){
                if (gBoard[i][j].isShow) continue
                gBoard[i][j].isShow=true
                gGame.showCount++
                if ((i===loc.i) && (j===loc.j)) continue
                    if (!gBoard[i][j].minesAroundCount) {fullExpend({i:i,j:j})}
            }
        }
    }
}

// TODO Hint the neighbors
function shortHint(){
    if (!gGame.isOn || !gGame.hint || gGame.hitOn) return
    gGame.hint--
    gGame.hitOn=true
    var value=""
    for (var h=0;h<gGame.hint;h++){value+="🎃"}
    document.querySelector(".shortH span").innerText=value
}

function neibgChange(loc){
    const coverBack=[]
    for (var i=loc.i-1;i<=loc.i+1;i++){
        if (i<0 || i>gBoard.length-1) continue
        for (var j=loc.j-1;j<=loc.j+1;j++){
            if (j<0 || j>gBoard[0].length-1) continue
            if (!gBoard[i][j].isShow){
                gBoard[i][j].isShow=true
                coverBack.push({i:i,j:j})
            }
        }
    }
    return (coverBack)
}

function showTheHint(loc){
    const coverBackIdx= neibgChange(loc)
    renderBoard()
    setTimeout(()=>{
        for (var i=0;i<coverBackIdx.length;i++){
            const locI=coverBackIdx[i].i
            const locJ=coverBackIdx[i].j
            gBoard[locI][locJ].isShow=false
        }
        gGame.hitOn=false
        renderBoard()
    },700)
    
}


function safeClick(){
    if (!gGame.isOn || gGame.hitOn || !gGame.safe) return
    gGame.safe--
    document.querySelector(".safeC span").innerText=gGame.safe
    findSafeCell()
}

// DONE safe click
function findSafeCell(){
    clearInterval(flashingInteval)
    const saveCells=[]
    for (var i=0;i<gBoard.length;i++){
        for (var j=0; j<gBoard[0].length;j++){
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShow){
                saveCells.push({i:i,j:j})
            }
        }
    }
    
    if (saveCells.length){
        const randomIdx=getRandomIntInt(0,saveCells.length-1)
        i=saveCells[randomIdx].i
        j=saveCells[randomIdx].j
        const elCell = document.querySelector(`.cell-${i}-${j}`)
        flashingInteval=setInterval(() => {
            elCell.classList.toggle("flash")
        }, 300);
        elCell.classList.remove("flash")
        
        setTimeout(()=>{clearInterval(flashingInteval)},1500)
        elCell.classList.add("flash")
    }
}



// un Finished redo
function saveClick(){
    const data={B:copyMat(gBoard),L:copyMat(gLevel),G:copyMat(gGame)}
    prevuse.push(data)

}


function undo(){
    if (!prevuse) return
    const data=prevuse.pop()
    gBoard=data.B
    gGame=data.L
    gLevel=data.G

    
    
    
    var value=""
    for (var h=0;h<gGame.hint;h++){value+="🎃"}
    document.querySelector(".shortH span").innerText=value
    livesShown()
    document.querySelector(".safeC span").innerText=gGame.safe
    renderBoard()
    console.log (gBoard)
}