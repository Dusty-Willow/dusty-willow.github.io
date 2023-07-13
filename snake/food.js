import { onSnake, expandSnake } from "./snake.js"
import { randomGridPosition } from "./grid.js"
import { incrementScore } from "./game.js"

// Variables and Constants
let food = getRandomFoodPosition()
const GROWTH_RATE = 1

// Function to update Food position when consumed while incrementing score and growing Snake
export function update() {
    if (onSnake(food)) {
        expandSnake(GROWTH_RATE)
        incrementScore()
        food = getRandomFoodPosition()
    }
    
}

// Function to draw food on board
export function draw(gameBoard) {
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    gameBoard.appendChild(foodElement)
}

// Function to generate new position for Food randomly on grid and not on Snake
function getRandomFoodPosition() {
    let newFoodPosition
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition()
    }
    return newFoodPosition
}

// Function to reset Food position
export function resetFood() {
    food = getRandomFoodPosition()
}