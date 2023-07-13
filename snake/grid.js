// Constants representing Board size
const GRID_SIZE_X = 31
const GRID_SIZE_Y = 21

// Function to generate random position on game Board
export function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * GRID_SIZE_X) + 1,
        y: Math.floor(Math.random() * GRID_SIZE_Y) + 1
    }
}

// Function to check if a position is outside the confines of the game Board
export function outsideGrid(position) {
    return (position.x < 1 || position.x > GRID_SIZE_X || position.y < 1 || position.y > GRID_SIZE_Y)
}