import { update as updateSnake, draw as drawSnake, resetSnake, getSnakeHead, snakeIntersection, SNAKE_SPEED } from './snake.js'
import { update as updateFood, draw as drawFood, resetFood } from './food.js'
import { outsideGrid } from './grid.js'
import { resetInput, turnRight, turnLeft } from './input.js'

// Variables and Constants
let lastRenderTime = 0
let gameOver = false
let replay = false
let gameScore = 0
let highScore = 0
let DIFFICULTY_SCALING = 0

const gameBoard = document.getElementById('game-board')
const scoreBoard = document.getElementById('score-board')
const discountDisplay = document.getElementById('discount-code')
const highScoreBoard = document.getElementById('high-scores')
const discountButtons = document.getElementById('discount-buttons')
const saveForm = document.getElementById('save-form')

let discountCodeList = []
let discountCode = ''
let discountPercentage = ''

// Load list of discount codes from codes.json via jquery
$.getJSON('codes.json', function (json) {
    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            var item = json[key];
            // discountCodeList.push(item.Code);
            discountCodeList.push([item.Code, item.Discount])
        }
    }

    discountCode = generateDiscountCode()   // Discount Code in use
});

let highScoreList = [0, 0, 0, 0, 0]   // List of High Scores

// Sort High Scores in descending order
highScoreList =  highScoreList.sort(function(a, b) {
    return b - a;
})

// Buttons
var playButton = document.getElementById("play-button");    // Play button
playButton.addEventListener("click", main);

var turnRightButton = document.getElementById("turn-right");    // Clockwise turn button
turnRightButton.addEventListener("click", turnRight);

var turnLeftButton = document.getElementById("turn-left");  // Anticlockwise turn button
turnLeftButton.addEventListener("click", turnLeft);

// High Score Board
highScoreBoard.innerHTML = `High Scores<br>${highScoreList[0]}<br>${highScoreList[1]}<br>${highScoreList[2]}<br>${highScoreList[3]}<br>${highScoreList[4]}`

// Main game function
function main(currentTime) {
    if (replay) {
        lastRenderTime = 0
        gameOver = false
        gameScore = 0
        DIFFICULTY_SCALING = 0
        replay = false
        discountButtons.innerHTML = ''
        resetSnake()
        resetFood()
        resetInput()
        discountCode = generateDiscountCode()
    }

    if (gameOver) {
        if (gameScore > highScore) highScore = gameScore
        replay = true
        return true
    }

    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    if (secondsSinceLastRender < 1 / (SNAKE_SPEED + DIFFICULTY_SCALING)) return

    lastRenderTime = currentTime

    update()
    draw()
}

// Update function for values related to Snake, Food and to check for collisions
function update() {
    updateSnake()
    updateFood()
    checkDeath()
}

// Draw function for drawing updated state of game, including the Board, Snake, Food, Discount Code, Score and High Scores
function draw() {
    discountDisplay.innerHTML = 'Earn Points to Reveal Discount Code<br>'
    if (gameScore < 10) {
        for (let i = 0; i < Math.floor(gameScore/2); i++) {
            discountDisplay.innerHTML += discountCode[i]
        }
    } else {
        discountDisplay.innerHTML = "Congratulations! You've unlocked a " + discountPercentage + "% discount code!<br>" + discountCode
    }
    highScoreBoard.innerHTML = `High Scores<br>${highScoreList[0]}<br>${highScoreList[1]}<br>${highScoreList[2]}<br>${highScoreList[3]}<br>${highScoreList[4]}`
    scoreBoard.innerHTML = `Score: ${gameScore}`
    gameBoard.innerHTML = ''
    if (gameOver) {
        gameBoard.innerHTML += '<div id="replay" class="center border"><div id="game-over-message">GAME OVER</div><button id="replay-button" class="glow-on-hover" type="button">Play Again</button></div>'
        var replayButton = document.getElementById("replay-button");
        replayButton.addEventListener("click", main)

        if (gameScore >= 10) {
            discountButtons.innerHTML += '<button id="use-code-button" class="glow-on-hover">Use Now</button>'
            discountButtons.innerHTML += '<button id="save-code-button" class="glow-on-hover">Save For Later</button>'
            var useCodeButton = document.getElementById("use-code-button");
            useCodeButton.addEventListener("click", function() {
                location.href = "https://www.pandahub.ca/" + discountCode
            })
            var saveCodeButton = document.getElementById("save-code-button");
            saveCodeButton.addEventListener("click", makeForm)
        } else {
            discountDisplay.innerHTML = "Better luck next time!"
        }
    } else {
        drawSnake(gameBoard)
        drawFood(gameBoard)
    }
    
}

// Function to check for collisions against border walls and the snake itself
function checkDeath() {
    // if (outsideGrid(getSnakeHead())) console.log("Triggered Outside Grid")
    // if (snakeIntersection()) console.log("Triggered Snake Intersection")
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
    if (gameOver) {
        let replace = true
        for (let i = 0; i < highScoreList.length; i++) {
            if (replace && gameScore > highScoreList[i]) {
                replace = false
                highScoreList.push(gameScore)
                highScoreList =  highScoreList.sort(function(a, b) {
                    return b - a;
                })
                highScoreList.pop()
            }
        }
    }
}

// Function to increment score and scale difficulty based on current score
export function incrementScore() {
    gameScore += 1
    DIFFICULTY_SCALING = Math.floor(gameScore / 2)
}

function generateDiscountCode() {
    let randomCode = Math.floor(Math.random() * discountCodeList.length)
    // console.log(discountCodeList[randomCode][0])
    discountPercentage = discountCodeList[randomCode][1]
    return discountCodeList[randomCode][0]
}

function makeForm() {
    saveForm.innerHTML += '<div class="form-border"><label for="first-name">First Name:</label><br><input type="text" id="first-name" name="first-name"><br><label for="last-name">Last Name:</label><br><input type="text" id="last-name" name="last-name"><br><label for="email">Email:</label><br><input type="text" id="email" name="email"><br><br><button id="submit-code-form-button" class="glow-on-hover">Confirm</button><button id="cancel-code-form-button" class="glow-on-hover">Cancel</button></div>'
    var submitCodeFormButton = document.getElementById('submit-code-form-button');
    submitCodeFormButton.addEventListener("click", codeFormSubmit)
    var cancelCodeFormButton = document.getElementById('cancel-code-form-button');
    cancelCodeFormButton.addEventListener("click", function() {
        saveForm.innerHTML = ''
    })
}

function removeForm() {
    saveForm.innerHTML = ''
}

function codeFormSubmit() {
    let firstName = document.getElementById('first-name').value
    let lastName = document.getElementById('last-name').value
    let userEmail = document.getElementById('email').value
    let userCode = discountCode

    if (firstName == '' || lastName == '' || userEmail == '') alert("Please enter details to save code.")
    else {
        let message = "This email to " + userEmail + " is to confirm that " + firstName + " " + lastName + " has earned the discount code " + userCode + " to be used at Panda Hub."
        
        // IMPLEMENT CODE FOR SENDING EMAIL HERE
        
        console.log(message)
        removeForm()
        alert("Code has been sent to your email.")
    }
    
}