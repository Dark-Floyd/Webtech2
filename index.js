const boxes = document.querySelectorAll('.box')
const numPad = document.querySelectorAll('.numpad')
const enter = document.querySelector('.enter')
const popup_open = document.querySelector('#stats')
const popup_close = document.querySelector('#close_btn')
const popup = document.querySelector('.popup');
var tryDone = document.querySelectorAll('#try_done')
var timesPlayed = document.querySelector('#count-played')
var timesWon = document.querySelector('#count-won')
var winRate = document.querySelector('#win-rate')
var board = undefined
var stats = undefined

const initGame = () => {
    board = new Board("22", ['7','*','3','+','1','-','0'])
    stats = new Statistics()
  }

document.onreadystatechange = () => {
if (document.readyState === "complete") {
    initGame();
    }
}
const rowMaxSize = 7
const amountOfRows = 6
var gameActive = true
var currentRow = 0;

function userInput (input) {
    if(gameActive) {
        let keyFromKeyboard = input.key
        let keyFromMouse
        switch (input.target.innerText) {
            case "⌫":
                keyFromMouse = "Backspace"
                break;
            default:
                keyFromMouse = input.target.innerText
        }
        let key = keyFromKeyboard || keyFromMouse
        let isNumberOrSign = /[0-9]|\+|\-|\*|\//i.test(key)

        if(key == 'Enter') { 
            console.log("detect enter")
            console.log("row answer", board.rows[currentRow].calculateRowResult())
            if(board.rows[currentRow].calculateRowResult() == board.result) {
                let colors = board.calculateColors(currentRow)
                loadColors(currentRow, colors)
                currentRow++
                if(board.isWon(currentRow - 1)) { //WON
                    stats.reportWon(currentRow - 1)
                    loadStats()
                    gameActive = false;
                }
                else if(currentRow >= amountOfRows) { //LOST
                    stats.reportLost()
                    loadStats()
                    gameActive = false;
                } else { 
                    let resultNextAppearence = document.querySelector('#line_' + currentRow)
                    resultNextAppearence.setAttribute('style', 'display: block;')
                }
            } 
        } else if(isNumberOrSign) { 
            board.rows[currentRow].addValue(key)
            updateLastBox(board.rows[currentRow], currentRow)
        } else if(key == 'Backspace') { 
            board.rows[currentRow].removeValue()
            emptyLastBox(board.rows[currentRow], currentRow)
        }
    }
}

function updateLastBox(row, rowNumber) {
    let currentBox = boxes[(rowMaxSize * rowNumber) + row.size - 1]
    let value = row.rowValues[row.size - 1]
    currentBox.innerText = value
    currentBox.setAttribute('class', 'box filled')
}

function emptyLastBox(row, rowNumber) {
    let currentBox = boxes[(rowMaxSize * rowNumber) + row.size]
    let value = ''
    currentBox.innerText = value
    currentBox.setAttribute('class', 'box')
}

function loadColors (rowNumber, colors) {
    console.log(colors)
    for (let i = 0; i < rowMaxSize; i++) {
        switch (colors[i]) {
            case 'g':
                boxes[(rowMaxSize * rowNumber) + i].setAttribute('class', 'box filled green')
                break;
            case 'y':
                boxes[(rowMaxSize * rowNumber) + i].setAttribute('class', 'box filled yellow')
                break;
            default: 
                boxes[(rowMaxSize * rowNumber) + i].setAttribute('class', 'box filled default')
        }
    }
}

function loadStats () {
    timesPlayed.innerText = stats.played
    timesWon.innerText = stats.won
    winRate.innerText = ((stats.played/stats.won) * 100) + '%'
    for(let i = 0; i < rowMaxSize - 1; i++) {
        try_done[i].innerText = stats.rowsResults[i]
    }
}


class Row {
    constructor() {
        this.rowValues = new Array()
        this.rowValues.fill('E')
        this.size = 0
    }

    addValue(value) {
        if(this.size < rowMaxSize) {
            this.rowValues.push(value)
            this.size++
        }
    }

    removeValue() {
        if(this.size > 0) {
            this.rowValues.pop()
            this.size--
        }   
    }

    calculateRowResult() {
        if(this.size == rowMaxSize) {
            let mathStr = this.rowValues.join("")
            try {
                return eval(mathStr)
            }
            catch {
                return -1
            }
        } else return -1;
    }

}

class Board {
    constructor(result, rightExpression) {
        this.rows = [new Row(), new Row(), new Row(), new Row(), new Row(), new Row()]
        this.result = result
        this.rightExpression = rightExpression
    }

    calculateColors(rowNumber) {
        let row = this.rows[rowNumber]
        let result = new Array(7)
        let indexsChecked = new Array(7)
        indexsChecked.fill(0)
        result.fill('b')
        for (let i = 0; i < rowMaxSize; i++) {
            if(this.rightExpression[i] === row.rowValues[i]) {
                result[i] = 'g'
                indexsChecked[i] = 1
            }
        }
        for (let i = 0; i < rowMaxSize; i++) {
            if(result[i] != 'g') {
                let index = this.rightExpression.indexOf(row.rowValues[i])
                if(index != -1 && indexsChecked[index] != 1) {
                    result[i] = 'y'
                    indexsChecked[index] = 1
                }
            }
        }

        return result
    }

    isWon(rowNumber) {
        let rowStr = this.rows[rowNumber].rowValues.join("")
        let rightExpressionStr = this.rightExpression.join("")
        
        return rowStr === rightExpressionStr
    }
}

class Statistics {
    constructor() {
        this.played = 0
        this.won = 0
        this.rowsResults = new Array(rowMaxSize)
        this.rowsResults.fill(0)
    }

    reportWon(rowNumber) {
        this.rowsResults[rowNumber]++
        this.won++
        this.played++
    }

    reportLost() {
        this.rowsResults[rowMaxSize - 1]++
        this.played++
    }
}
popup_open.addEventListener('click', () => {
    popup.style.display = "flex";
})

popup_close.addEventListener('click', () => {
    popup.style.display = "none";
})



document.addEventListener("keydown", userInput)
numPad.forEach(box => box.addEventListener("click", userInput))
enter.addEventListener("click", userInput)