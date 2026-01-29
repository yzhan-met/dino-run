// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GROUND_OFFSET = 60; // Distance from bottom where ground and dino are positioned
const GROUND_HEIGHT = 50; // Height of the ground strip
const DINO_WIDTH = 40;
const DINO_HEIGHT = 50;
const GRAVITY = 0.6;
const JUMP_POWER = -12;
const OBSTACLE_SPEED = 5;

// Game variables
let gameRunning = false;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;

// Display elements
const keyDisplay = document.getElementById('keyDisplay');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const restartBtn = document.getElementById('restartBtn');

// Update high score display
highScoreDisplay.textContent = highScore;

// Dino object
const dino = {
    x: 50,
    y: canvas.height - GROUND_OFFSET,
    width: DINO_WIDTH,
    height: DINO_HEIGHT,
    velocityY: 0,
    gravity: GRAVITY,
    jumpPower: JUMP_POWER,
    isJumping: false,
    draw() {
        // Dino body (green)
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Dino eye
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 25, this.y + 10, 8, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 28, this.y + 13, 3, 3);
        
        // Dino legs
        ctx.fillStyle = '#4CAF50';
        const legOffset = Math.floor(Date.now() / 100) % 2 === 0 ? 0 : 5;
        ctx.fillRect(this.x + 5, this.y + this.height, 8, 10);
        ctx.fillRect(this.x + 27 + legOffset, this.y + this.height, 8, 10);
    },
    jump() {
        if (!this.isJumping && gameRunning) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
        }
    },
    update() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        
        // Ground collision
        if (this.y >= canvas.height - GROUND_OFFSET) {
            this.y = canvas.height - GROUND_OFFSET;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }
};

// Available keys for jumping (easy to find keys for kids)
const availableKeys = [
    ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

// Current jump key
let currentJumpKey = ' ';

// Function to get random key (ensuring it's different from current key)
function getRandomKey() {
    let newKey;
    do {
        newKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
    } while (newKey === currentJumpKey);
    return newKey;
}

// Function to update key display
function updateKeyDisplay() {
    if (currentJumpKey === ' ') {
        keyDisplay.textContent = 'SPACE';
    } else {
        keyDisplay.textContent = currentJumpKey.toUpperCase();
    }
}

// Obstacles array
let obstacles = [];

// Obstacle class
class Obstacle {
    constructor() {
        this.width = 30;
        this.height = 50;
        this.x = canvas.width;
        this.y = canvas.height - GROUND_OFFSET;
        this.speed = OBSTACLE_SPEED;
        this.passed = false;
    }
    
    draw() {
        // Cactus obstacle (reddish-brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
        
        // Cactus arms
        ctx.fillRect(this.x - 8, this.y - this.height + 15, 8, 20);
        ctx.fillRect(this.x + this.width, this.y - this.height + 10, 8, 15);
    }
    
    update() {
        this.x -= this.speed;
        
        // Check if obstacle has been passed
        if (!this.passed && this.x + this.width < dino.x) {
            this.passed = true;
            score++;
            scoreDisplay.textContent = score;
            
            // Update high score
            if (score > highScore) {
                highScore = score;
                highScoreDisplay.textContent = highScore;
                localStorage.setItem('dinoHighScore', highScore);
            }
            
            // Change jump key after passing obstacle
            currentJumpKey = getRandomKey();
            updateKeyDisplay();
        }
    }
    
    collidesWith(dino) {
        return (
            dino.x < this.x + this.width &&
            dino.x + dino.width > this.x &&
            dino.y < this.y &&
            dino.y + dino.height > this.y - this.height
        );
    }
}

// Function to spawn obstacles
function spawnObstacle() {
    if (gameRunning && !gameOver) {
        obstacles.push(new Obstacle());
        
        // Random spawn interval between 1.5 to 3 seconds
        const spawnInterval = 1500 + Math.random() * 1500;
        setTimeout(spawnObstacle, spawnInterval);
    }
}

// Draw ground
function drawGround() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - GROUND_HEIGHT);
    ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT);
    ctx.stroke();
    
    // Ground pattern
    ctx.fillStyle = '#D2B48C';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
}

// Draw score on canvas
function drawScore() {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);
}

// Game over screen
function showGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 45);
    
    restartBtn.style.display = 'block';
    keyDisplay.style.display = 'none';
}

// Game loop
function gameLoop() {
    if (!gameRunning || gameOver) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    drawGround();
    
    // Update and draw dino
    dino.update();
    dino.draw();
    
    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].draw();
        
        // Check collision
        if (obstacles[i].collidesWith(dino)) {
            gameOver = true;
            gameRunning = false;
            showGameOver();
            return;
        }
        
        // Remove off-screen obstacles
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
    
    // Draw score on canvas
    drawScore();
    
    requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    gameRunning = true;
    gameOver = false;
    score = 0;
    obstacles = [];
    scoreDisplay.textContent = score;
    restartBtn.style.display = 'none';
    keyDisplay.style.display = 'block';
    
    // Reset dino position
    dino.y = canvas.height - GROUND_OFFSET;
    dino.velocityY = 0;
    dino.isJumping = false;
    
    // Start with space key
    currentJumpKey = ' ';
    updateKeyDisplay();
    
    // Start spawning obstacles
    setTimeout(spawnObstacle, 1500);
    
    // Start game loop
    gameLoop();
}

// Keyboard event listener
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    // Check if correct key is pressed
    const isCorrectKey = key === currentJumpKey || (currentJumpKey === ' ' && e.code === 'Space');
    
    // Start game on first correct key press if not running
    if (!gameRunning && !gameOver && isCorrectKey) {
        startGame();
    }
    
    // Jump if correct key is pressed
    if (isCorrectKey) {
        dino.jump();
        e.preventDefault(); // Prevent page scrolling
    }
});

// Restart button
restartBtn.addEventListener('click', () => {
    startGame();
});

// Initial message
ctx.fillStyle = '#333';
ctx.font = 'bold 32px Arial';
ctx.textAlign = 'center';
ctx.fillText('Press any key to start!', canvas.width / 2, canvas.height / 2);

// Draw ground on initial screen
drawGround();
dino.draw();
