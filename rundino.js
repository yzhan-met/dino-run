// DINO RUNNER - A Captivating Endless Runner
// By an AI
// Instructions:
// - Press any key to Start.
// - Press the KEY shown above each cactus to Jump over it.
// - Press SPACE to Pause/Resume.
// - Learn typing while you play!
// - Survive as long as you can!

let dino;
let obstacles = [];
let groundY;
let score = 0;
let highScore = 0;
let highScoreName = ''; // Name of the high score holder
let gameSpeed = 6;
let initialGameSpeed = 6;
let speedIncreaseFactor = 0.001;
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let isPaused = false; // Track pause state
let isEnteringName = false; // Track if user is entering name for new high score
let nameInput = ''; // Temporary storage for name being typed
let achievedNewHighScore = false; // Track if player achieved new high score this session

let spawnTimer = 0;
let spawnInterval = 130; // Initial frames between spawns

// Jump Key System
const keyPool = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];
let currentObstacleIndex = 0; // Track which obstacle is the active one

// Configuration System
let configOpen = false;
let speedMultiplier = 1.0; // Speed multiplier (0.5x to 2x)
let selectedCharacter = 0; // Index of selected character

// Mobile Detection and Touch Controls
let isMobile = false;
let onScreenKeyButton = { x: 0, y: 0, size: 120, visible: false, key: '' };

// Character variants (different colors)
const characters = [
  { name: 'Green Dino', color: [80, 150, 80] },
  { name: 'Blue Dino', color: [80, 120, 200] },
  { name: 'Red Dino', color: [200, 80, 80] },
  { name: 'Purple Dino', color: [150, 80, 200] },
  { name: 'Orange Dino', color: [255, 140, 60] }
];

// --- PIXEL ART ASSETS ---
// 1 represents a filled pixel, 0 is empty.

const dinoArt_run1 = [
  [0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0]
];

const dinoArt_run2 = [
  [0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 0, 0]
];

const dinoArt_jump = [
  [0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const cactusArt_small = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0],
  [0, 1, 0],
  [0, 1, 0]
];

const cactusArt_medium = [
  [0, 1, 0, 0],
  [1, 1, 1, 0],
  [0, 1, 0, 1],
  [0, 1, 1, 1],
  [0, 1, 0, 0],
  [0, 1, 0, 0]
];

const cactusArt_large = [
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 0],
  [0, 1, 0],
  [0, 1, 0],
  [0, 1, 0]
];

const cactusTypes = [
    { art: cactusArt_small, pixelSize: 6 },
    { art: cactusArt_medium, pixelSize: 5 },
    { art: cactusArt_large, pixelSize: 6 }
];

// --- BACKGROUND ---
let bgLayers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundY = height - 80;
  
  // Detect if on mobile device
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Load saved high score from localStorage
  let savedHighScore = localStorage.getItem('dinoRunHighScore');
  if (savedHighScore !== null) {
    highScore = parseInt(savedHighScore);
  }
  
  // Load saved high score holder name
  let savedName = localStorage.getItem('dinoRunHighScoreName');
  if (savedName !== null) {
    highScoreName = savedName;
  }
  
  // Initialize background layers for parallax effect
  // Layer = { color, speedFactor, elements[] }
  // Element = { x, y, size }
  bgLayers = [
    { color: color(255, 245, 157), speedFactor: 0.05, elements: [{x: width * 0.7, y: height * 0.2, size: 80}] }, // Sun
    { color: color(135, 206, 235), speedFactor: 0, elements: [] }, // Sky - doesn't move
    { color: color(34, 139, 34, 150), speedFactor: 0.2, elements: [] }, // Far mountains
    { color: color(0, 100, 0, 180), speedFactor: 0.4, elements: [] } // Near mountains
  ];
  
  // Populate mountain layers
  for (let i = 0; i < 15; i++) {
    bgLayers[2].elements.push({x: random(width*2), y: groundY - random(50, 150), size: random(100, 300)});
    bgLayers[3].elements.push({x: random(width*2), y: groundY - random(20, 80), size: random(150, 400)});
  }
  
  resetGame();
}

function resetGame() {
  score = 0;
  gameSpeed = initialGameSpeed;
  obstacles = [];
  spawnTimer = 0;
  spawnInterval = 130;
  isPaused = false; // Reset pause state
  achievedNewHighScore = false; // Reset high score flag

  dino = new Dino();
  gameState = 'playing';
}

function draw() {
  switch (gameState) {
    case 'start':
      drawBackground();
      drawGround();
      dino.show();
      drawStartScreen();
      break;
    case 'playing':
      drawBackground();
      drawGround();
      
      if (!configOpen && !isPaused) {
        handleScore();
        handleObstacles();
        
        dino.update();
      }
      dino.show();
      
      // Show pause indicator
      if (isPaused) {
        fill(0, 0, 0, 100);
        rect(0, 0, width, height);
        
        fill(255);
        textAlign(CENTER, CENTER);
        textFont('monospace');
        textSize(40);
        text('PAUSED', width / 2, height / 2);
        textSize(20);
        text('Press SPACE to resume', width / 2, height / 2 + 50);
      }
      break;
    case 'gameOver':
      drawBackground();
      drawGround();
      dino.show(); // Show dino in its final position
      obstacles.forEach(o => o.show()); // Show obstacles in their final positions
      drawGameOverScreen();
      break;
    case 'enterName':
      drawBackground();
      drawGround();
      dino.show();
      obstacles.forEach(o => o.show());
      drawNameEntryScreen();
      break;
  }
  
  // Always draw config button on top
  drawConfigButton();
  
  // Draw on-screen keyboard button for mobile
  if (isMobile && gameState === 'playing' && !configOpen && !isPaused) {
    drawOnScreenKeyboard();
  }
  
  // Draw config panel if open
  if (configOpen) {
    drawConfigPanel();
  }
}

function handleScore() {
  score++;
  if (score > highScore) {
    highScore = score;
    // Save new high score to localStorage
    localStorage.setItem('dinoRunHighScore', highScore.toString());
    
    // Set flag that new high score was achieved (don't interrupt gameplay)
    achievedNewHighScore = true;
  }
  
  // Increase difficulty over time
  gameSpeed += speedIncreaseFactor;
  spawnInterval = max(40, 90 - score / 200);

  // Display Score (top-left to avoid config button)
  textAlign(LEFT);
  textFont('monospace');
  textSize(24);
  fill(80);
  // Show name if available
  if (highScoreName) {
    text(`HI ${nf(highScore, 5)} (${highScoreName})  ${nf(score, 5)}`, 20, 40);
  } else {
    text(`HI ${nf(highScore, 5)}  ${nf(score, 5)}`, 20, 40);
  }
}

function handleObstacles() {
  // Spawn new obstacles
  spawnTimer++;
  if (spawnTimer > spawnInterval) {
    obstacles.push(new Obstacle());
    spawnTimer = 0;
    // Adjust spawn interval to maintain consistent distance regardless of speed
    // Divide by speedMultiplier so faster speeds spawn more frequently to maintain spacing
    // spawnInterval = (random(60, 150) / (gameSpeed / initialGameSpeed)) / speedMultiplier;
    spawnInterval = random(60, 150)
  }

  // Update and draw obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].show();

    if (dino.hits(obstacles[i])) {
      // Check if player achieved new high score during this session
      if (achievedNewHighScore && !isEnteringName) {
        isEnteringName = true;
        nameInput = '';
        gameState = 'enterName';
      } else {
        gameState = 'gameOver';
      }
      return; // Exit early to prevent further processing
    }

    if (obstacles[i].isOffscreen()) {
      obstacles.splice(i, 1);
    }
  }
}

function drawBackground() {
  // Deepest layer first (sky)
  background(135, 206, 250); // Light Blue Sky
  
  // Draw sun
  let sunLayer = bgLayers[0];
  fill(sunLayer.color);
  noStroke();
  let sun = sunLayer.elements[0];
  ellipse(sun.x, sun.y, sun.size, sun.size);
  
  // Draw mountain layers
  for(let i=2; i<bgLayers.length; i++) {
    let layer = bgLayers[i];
    fill(layer.color);
    noStroke();
    for(let el of layer.elements) {
      triangle(el.x, groundY, el.x + el.size/2, el.y, el.x + el.size, groundY);
      el.x -= gameSpeed * layer.speedFactor;
      if (el.x < -el.size) {
        el.x = width + random(50, 150);
      }
    }
  }
}

function drawGround() {
  noStroke();
  fill(160, 120, 80); // Brownish color for the ground
  rect(0, groundY, width, height - groundY);
  
  // Ground texture lines
  fill(130, 90, 50);
  for(let i=0; i<width; i+=20) {
      rect((i - (frameCount * gameSpeed) % 40), groundY + 20, 10, 4);
  }
}

// --- SCREEN DRAWING FUNCTIONS ---

function drawStartScreen() {
  textAlign(CENTER, CENTER);
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);
  
  fill(255);
  textFont('monospace');
  textSize(50);
  text('PIXEL DINO RUN', width / 2, height / 2 - 100);
  
  textSize(24);
  text('Press any key to Start', width / 2, height / 2 - 20);
  
  textSize(20);
  text('Instructions:', width / 2, height / 2 + 30);
  textSize(18);
  text('Press the KEY shown above each cactus to jump!', width / 2, height / 2 + 60);
  text('Learn typing while you play!', width / 2, height / 2 + 90);
}

function drawGameOverScreen() {
  textAlign(CENTER, CENTER);
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  fill(255);
  textFont('monospace');
  textSize(60);
  text('GAME OVER', width / 2, height / 2 - 80);

  textSize(28);
  text(`Score: ${score}`, width / 2, height / 2);

  textSize(22);
  text('Press any key to try again', width / 2, height / 2 + 80);
}

function drawNameEntryScreen() {
  textAlign(CENTER, CENTER);
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  fill(255);
  textFont('monospace');
  textSize(50);
  text('🎉 NEW HIGH SCORE! 🎉', width / 2, height / 2 - 100);

  textSize(32);
  text(`Score: ${highScore}`, width / 2, height / 2 - 40);

  textSize(24);
  text('Enter your name:', width / 2, height / 2 + 20);

  // Display name input box
  fill(255);
  stroke(100, 200, 100);
  strokeWeight(3);
  rect(width / 2 - 150, height / 2 + 60, 300, 50, 5);

  // Display typed name
  fill(80);
  noStroke();
  textSize(28);
  text(nameInput + '_', width / 2, height / 2 + 85);

  textSize(18);
  fill(200);
  text('Press ENTER when done (max 10 characters)', width / 2, height / 2 + 140);
}


// --- EVENT HANDLERS ---

function keyPressed() {
  // Handle name entry
  if (gameState === 'enterName') {
    if (keyCode === ENTER) {
      // Save the name and return to game over screen
      if (nameInput.trim().length > 0) {
        highScoreName = nameInput.trim();
        localStorage.setItem('dinoRunHighScoreName', highScoreName);
      }
      isEnteringName = false;
      gameState = 'gameOver';
      return;
    } else if (keyCode === BACKSPACE) {
      // Remove last character
      nameInput = nameInput.slice(0, -1);
      return;
    } else if (key.length === 1 && nameInput.length < 10) {
      // Add character if it's a letter, number, or space
      if (key.match(/[a-zA-Z0-9 ]/)) {
        nameInput += key;
      }
      return;
    }
    return;
  }
  
  if (gameState === 'playing') {
    // Space bar toggles pause
    if (key === ' ') {
      isPaused = !isPaused;
      return;
    }
    
    // Don't process jump keys when paused
    if (isPaused) {
      return;
    }
    
    // Find the next obstacle that hasn't been passed
    let nextObstacle = null;
    for (let obs of obstacles) {
      if (!obs.passed) {
        nextObstacle = obs;
        break;
      }
    }
    
    // Check if the pressed key matches the next obstacle's jump key
    if (nextObstacle && key.toUpperCase() === nextObstacle.jumpKey) {
      dino.jump();
    }
  } else if (gameState === 'start' || gameState === 'gameOver') {
    resetGame();
  }
}


// --- HELPER FUNCTION FOR DRAWING PIXEL ART ---

function drawPixelArt(art, x, y, pixelSize, customColor = null) {
  noStroke();
  if (customColor) {
    fill(customColor[0], customColor[1], customColor[2]);
  } else {
    fill(80); // Default color
  }
  for (let r = 0; r < art.length; r++) {
    for (let c = 0; c < art[r].length; c++) {
      if (art[r][c] === 1) {
        rect(x + c * pixelSize, y + r * pixelSize, pixelSize, pixelSize);
      }
    }
  }
}

// --- CLASSES ---

class Dino {
  constructor() {
    this.pixelSize = 7;
    this.w = dinoArt_run1[0].length * this.pixelSize;
    this.h = dinoArt_run1.length * this.pixelSize;
    this.x = width / 4; // Position at 1/4 from left
    this.y = groundY - this.h;
    this.vy = 0; // Velocity in y direction
    this.gravity = 0.8;
    this.jumpPower = -19;
    this.runFrame = 0;
  }

  jump() {
    // Can only jump if on the ground
    if (this.y === groundY - this.h) {
      this.vy = this.jumpPower;
    }
  }

  hits(obstacle) {
    // Simple Axis-Aligned Bounding Box collision
    let dinoBox = {
      x: this.x + this.pixelSize * 2, // Fine-tune bounding box
      y: this.y,
      w: this.w - this.pixelSize * 4,
      h: this.h
    };
    
    let obsBox = {
      x: obstacle.x,
      y: obstacle.y,
      w: obstacle.w,
      h: obstacle.h
    };

    return dinoBox.x < obsBox.x + obsBox.w &&
           dinoBox.x + dinoBox.w > obsBox.x &&
           dinoBox.y < obsBox.y + obsBox.h &&
           dinoBox.y + dinoBox.h > obsBox.y;
  }

  update() {
    this.vy += this.gravity;
    this.y += this.vy;

    // Prevent falling through the ground
    if (this.y >= groundY - this.h) {
      this.y = groundY - this.h;
      this.vy = 0;
    }

    // Update running animation frame
    this.runFrame++;
  }

  show() {
    let currentArt;
    if (this.y < groundY - this.h) {
      currentArt = dinoArt_jump;
    } else {
      // Switch between running frames
      currentArt = (this.runFrame % 20 < 10) ? dinoArt_run1 : dinoArt_run2;
    }
    drawPixelArt(currentArt, this.x, this.y, this.pixelSize, characters[selectedCharacter].color);
  }
}


class Obstacle {
  constructor() {
    let type = random(cactusTypes);
    this.art = type.art;
    this.pixelSize = type.pixelSize;
    
    this.w = this.art[0].length * this.pixelSize;
    this.h = this.art.length * this.pixelSize;
    
    this.x = width;
    this.y = groundY - this.h;
    
    // Assign a random jump key to this obstacle
    this.jumpKey = random(keyPool);
    this.passed = false; // Track if dino has passed this obstacle
  }

  update() {
    this.x -= gameSpeed * speedMultiplier;
    
    // Check if dino has passed this obstacle
    if (!this.passed && this.x + this.w < dino.x) {
      this.passed = true;
    }
  }

  show() {
    drawPixelArt(this.art, this.x, this.y, this.pixelSize);
    
    // Display the jump key above the obstacle
    this.showJumpKey();
  }
  
  showJumpKey() {
    push();
    
    // Position above the obstacle
    let keyX = this.x + this.w / 2;
    let keyY = this.y - 50;
    
    // Background for the key
    fill(255, 200, 0, 220); // Yellow background
    stroke(80);
    strokeWeight(3);
    rectMode(CENTER);
    rect(keyX, keyY, 45, 45, 8);
    
    // Display the key letter
    noStroke();
    fill(40);
    textAlign(CENTER, CENTER);
    textFont('monospace');
    textSize(32);
    textStyle(BOLD);
    text(this.jumpKey, keyX, keyY);
    
    pop();
  }

  isOffscreen() {
    return this.x < -this.w;
  }
}


// --- ON-SCREEN KEYBOARD FOR MOBILE ---

function drawOnScreenKeyboard() {
  // Find the next obstacle to get its jump key
  let nextObstacle = null;
  for (let obs of obstacles) {
    if (!obs.passed) {
      nextObstacle = obs;
      break;
    }
  }
  
  if (!nextObstacle) return;
  
  // Position button at bottom center of screen
  let btnSize = 120;
  let btnX = width / 2 - btnSize / 2;
  let btnY = height - btnSize - 40;
  
  // Store button position for touch detection
  onScreenKeyButton.x = btnX;
  onScreenKeyButton.y = btnY;
  onScreenKeyButton.size = btnSize;
  onScreenKeyButton.key = nextObstacle.jumpKey;
  onScreenKeyButton.visible = true;
  
  push();
  
  // Button shadow
  fill(0, 0, 0, 50);
  noStroke();
  ellipse(btnX + btnSize/2 + 5, btnY + btnSize/2 + 5, btnSize, btnSize);
  
  // Button background
  fill(255, 200, 0, 230); // Yellow
  stroke(80);
  strokeWeight(4);
  ellipse(btnX + btnSize/2, btnY + btnSize/2, btnSize, btnSize);
  
  // Key letter
  fill(40);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('monospace');
  textSize(56);
  textStyle(BOLD);
  text(nextObstacle.jumpKey, btnX + btnSize/2, btnY + btnSize/2);
  
  // Instruction text above button
  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(20);
  text('TAP TO JUMP', width / 2, btnY - 20);
  
  pop();
}


// --- CONFIG UI FUNCTIONS ---

function drawConfigButton() {
  push();
  
  // Button position (top-right corner)
  let btnX = width - 60;
  let btnY = 20;
  let btnSize = 40;
  
  // Check if mouse is over button
  let isHover = mouseX > btnX && mouseX < btnX + btnSize && 
                mouseY > btnY && mouseY < btnY + btnSize;
  
  // Button background
  fill(isHover ? 220 : 200);
  stroke(80);
  strokeWeight(2);
  rect(btnX, btnY, btnSize, btnSize, 5);
  
  // Gear icon (simplified)
  fill(80);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  text('⚙', btnX + btnSize/2, btnY + btnSize/2);
  
  pop();
}

function drawConfigPanel() {
  push();
  
  // Semi-transparent overlay
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  
  // Panel background
  let panelW = min(500, width - 40);
  let panelH = min(450, height - 40);
  let panelX = (width - panelW) / 2;
  let panelY = (height - panelH) / 2;
  
  fill(240);
  stroke(80);
  strokeWeight(3);
  rect(panelX, panelY, panelW, panelH, 10);
  
  // Title
  fill(80);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('monospace');
  textSize(28);
  text('SETTINGS', width / 2, panelY + 40);
  
  // Character Selection
  textAlign(LEFT, CENTER);
  textSize(20);
  text('Select Character:', panelX + 30, panelY + 90);
  
  let charStartY = panelY + 120;
  let charSpacing = 70;
  
  for (let i = 0; i < characters.length; i++) {
    let charX = panelX + 30 + (i % 3) * 150;
    let charY = charStartY + Math.floor(i / 3) * 80;
    
    // Character preview box
    let isSelected = (i === selectedCharacter);
    let isHover = mouseX > charX && mouseX < charX + 60 &&
                  mouseY > charY && mouseY < charY + 60;
    
    stroke(isSelected ? [255, 200, 0] : (isHover ? [150, 150, 150] : [100, 100, 100]));
    strokeWeight(isSelected ? 4 : 2);
    fill(255);
    rect(charX, charY, 60, 60, 5);
    
    // Draw mini dino preview
    let miniArt = dinoArt_run1;
    let miniPixelSize = 3;
    let offsetX = charX + 10;
    let offsetY = charY + 10;
    
    noStroke();
    fill(characters[i].color[0], characters[i].color[1], characters[i].color[2]);
    for (let r = 0; r < miniArt.length; r++) {
      for (let c = 0; c < miniArt[r].length; c++) {
        if (miniArt[r][c] === 1) {
          rect(offsetX + c * miniPixelSize, offsetY + r * miniPixelSize, miniPixelSize, miniPixelSize);
        }
      }
    }
  }
  
  // Speed Control
  textAlign(LEFT, CENTER);
  textSize(20);
  fill(80);
  noStroke();
  text('Game Speed:', panelX + 30, panelY + 300);
  
  textSize(16);
  text(`${speedMultiplier.toFixed(1)}x`, panelX + 380, panelY + 300);
  
  // Speed slider
  let sliderX = panelX + 30;
  let sliderY = panelY + 330;
  let sliderW = panelW - 60;
  let sliderH = 10;
  
  // Slider track
  fill(180);
  noStroke();
  rect(sliderX, sliderY, sliderW, sliderH, 5);
  
  // Slider fill
  let fillW = map(speedMultiplier, 0.5, 2.0, 0, sliderW);
  fill(100, 180, 100);
  rect(sliderX, sliderY, fillW, sliderH, 5);
  
  // Slider handle
  let handleX = sliderX + fillW;
  fill(80);
  stroke(255);
  strokeWeight(2);
  ellipse(handleX, sliderY + sliderH/2, 20, 20);
  
  // Close button
  let closeX = panelX + panelW - 50;
  let closeY = panelY + panelH - 50;
  let isCloseHover = dist(mouseX, mouseY, closeX + 15, closeY + 15) < 20;
  
  fill(isCloseHover ? 220 : 200);
  stroke(80);
  strokeWeight(2);
  rect(closeX, closeY, 40, 40, 5);
  
  fill(80);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  text('✕', closeX + 20, closeY + 20);
  
  pop();
}

function mousePressed() {
  // Check config button click
  let btnX = width - 60;
  let btnY = 20;
  let btnSize = 40;
  
  if (mouseX > btnX && mouseX < btnX + btnSize && 
      mouseY > btnY && mouseY < btnY + btnSize) {
    configOpen = !configOpen;
    return;
  }
  
  // If config is open, handle panel interactions
  if (configOpen) {
    let panelW = min(500, width - 40);
    let panelH = min(450, height - 40);
    let panelX = (width - panelW) / 2;
    let panelY = (height - panelH) / 2;
    
    // Check close button
    let closeX = panelX + panelW - 50;
    let closeY = panelY + panelH - 50;
    if (dist(mouseX, mouseY, closeX + 20, closeY + 20) < 20) {
      configOpen = false;
      return;
    }
    
    // Check character selection
    let charStartY = panelY + 120;
    for (let i = 0; i < characters.length; i++) {
      let charX = panelX + 30 + (i % 3) * 150;
      let charY = charStartY + Math.floor(i / 3) * 80;
      
      if (mouseX > charX && mouseX < charX + 60 &&
          mouseY > charY && mouseY < charY + 60) {
        selectedCharacter = i;
        return;
      }
    }
    
    // Check speed slider
    let sliderX = panelX + 30;
    let sliderY = panelY + 330;
    let sliderW = panelW - 60;
    let sliderH = 10;
    
    if (mouseX > sliderX && mouseX < sliderX + sliderW &&
        mouseY > sliderY - 10 && mouseY < sliderY + sliderH + 10) {
      let newSpeed = map(mouseX, sliderX, sliderX + sliderW, 0.5, 2.0);
      speedMultiplier = constrain(newSpeed, 0.5, 2.0);
    }
  }
}

function mouseDragged() {
  if (configOpen) {
    let panelW = min(500, width - 40);
    let panelH = min(450, height - 40);
    let panelX = (width - panelW) / 2;
    let panelY = (height - panelH) / 2;
    
    // Handle speed slider dragging
    let sliderX = panelX + 30;
    let sliderY = panelY + 330;
    let sliderW = panelW - 60;
    let sliderH = 10;
    
    if (mouseX > sliderX - 20 && mouseX < sliderX + sliderW + 20 &&
        mouseY > sliderY - 20 && mouseY < sliderY + sliderH + 20) {
      let newSpeed = map(mouseX, sliderX, sliderX + sliderW, 0.5, 2.0);
      speedMultiplier = constrain(newSpeed, 0.5, 2.0);
    }
  }
}

// Touch event handler for mobile devices
function touchStarted() {
  // Handle name entry screen touches
  if (gameState === 'enterName') {
    // Let keyPressed handle this
    return false;
  }
  
  // Handle on-screen keyboard button
  if (isMobile && gameState === 'playing' && !configOpen && !isPaused && onScreenKeyButton.visible) {
    let touchX = touches.length > 0 ? touches[0].x : mouseX;
    let touchY = touches.length > 0 ? touches[0].y : mouseY;
    
    let btnCenterX = onScreenKeyButton.x + onScreenKeyButton.size / 2;
    let btnCenterY = onScreenKeyButton.y + onScreenKeyButton.size / 2;
    let distance = dist(touchX, touchY, btnCenterX, btnCenterY);
    
    if (distance < onScreenKeyButton.size / 2) {
      // Simulate key press for the current jump key
      key = onScreenKeyButton.key;
      keyPressed();
      return false; // Prevent default
    }
  }
  
  // Let mousePressed handle other interactions
  mousePressed();
  return false; // Prevent default touch behavior
}