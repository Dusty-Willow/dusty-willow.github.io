import { getInputDirection } from "./input.js"

// Variables and Constants
export const SNAKE_SPEED = 5
let snakeBody = [{ x: 11, y: 11}, {x: 11, y: 12}]
let newSegments = 0

// Update function for Snake
export function update() {
    addSegments()
    const inputDirection = getInputDirection()
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] }
    }

    snakeBody[0].x += inputDirection.x
    snakeBody[0].y += inputDirection.y
}

// Draw function for Snake requiring the board to be passed into it
export function draw(gameBoard) {
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        console.log(snakeBody[0])
        snakeElement.classList.add('snake')
        gameBoard.appendChild(snakeElement)
    })
}

// Function to allow snake growth
export function expandSnake(amount) {
    newSegments += amount
}

// Function to check for overlap between snake and other collidable spaces
export function onSnake(position, { ignoreHead = false } = {}) {
    return snakeBody.some((segment, index) => {
        if ((ignoreHead && index === 0) || (ignoreHead && index === 1)) return false
        return equalPositions(segment, position)
    })
}

// Function to retrieve position of Snake Head
export function getSnakeHead() {
    return snakeBody[0]
}

// Function to check if Snake intersects itself
export function snakeIntersection() {
    return onSnake(snakeBody[0], { ignoreHead: true })
}

// Function to check if two spaces are the same
function equalPositions(pos1, pos2) {
    return (pos1.x === pos2.x && pos1.y === pos2.y)
}

// Function to add new segment to the snake
function addSegments() {
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1]})
    }

    newSegments = 0
}

// Function to reset snake
export function resetSnake() {
    snakeBody = [{ x: 11, y: 11}, {x: 11, y: 12}]
    newSegments = 0
}