// Variables
let inputDirection = {x: 1, y: 0}
let lastInputDirection = {x: 0, y: 0}
let inputState = 1

// Keyboard commands
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (lastInputDirection.y !== 0) break
            inputDirection = {x: 0, y: -1}
            break
        case 'ArrowDown':
            if (lastInputDirection.y !== 0) break
            inputDirection = {x: 0, y: 1}
            break
        case 'ArrowLeft':
            if (lastInputDirection.x !== 0) break
            inputDirection = {x: -1, y: 0}
            break
        case 'ArrowRight':
            if (lastInputDirection.x !== 0) break
            inputDirection = {x: 1, y: 0}
            break
    }
})

// Function to update last input direction with current input direction
export function getInputDirection() {
    lastInputDirection = inputDirection
    return inputDirection
}

// Function to turn Snake clockwise by 90 degrees
export function turnRight() {
    if (inputState === 4) inputState = 1
    else inputState++
    translateInputState()
}

// Function to turn Snake anticlockwise by 90 degrees
export function turnLeft() {
    if (inputState === 1) inputState = 4
    else inputState--
    translateInputState()
}

// Function to facilitate clockwise and anticlockwise turns
function translateInputState() {
    switch (inputState) {
        case 1:
            inputDirection = {x: 1, y: 0}
            break
        case 2:
            inputDirection = {x: 0, y: 1}
            break
        case 3:
            inputDirection = {x: -1, y: 0}
            break
        case 4:
            inputDirection = {x: 0, y: -1}
            break
    }
}

// Function to reset input values
export function resetInput() {
    inputDirection = {x: 1, y: 0}
    lastInputDirection = {x: 0, y: 0}
    inputState = 1
}