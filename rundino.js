// DINO RUNNER - A Captivating Endless Runner
// By an AI
// Instructions:
// - Press any key to Start.
// - Press SPACE to Jump over the cacti.
// - Survive as long as you can!

let dino;
let obstacles = [];
let groundY;
let score = 0;
let highScore = 0;
let gameSpeed = 6;
let initialGameSpeed = 6;
let speedIncreaseFactor = 0.001;
let gameState = 'start'; // 'start', 'playing', 'gameOver'

let spawnTimer = 0;
let spawnInterval = 90; // Initial frames between spawns

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
  spawnInterval = 90;

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
      
      handleScore();
      handleObstacles();
      
      dino.update();
      dino.show();
      break;
    case 'gameOver':
      drawBackground();
      drawGround();
      dino.show(); // Show dino in its final position
      obstacles.forEach(o => o.show()); // Show obstacles in their final positions
      drawGameOverScreen();
      break;
  }
}

function handleScore() {
  score++;
  if (score > highScore) {
    highScore = score;
  }
  
  // Increase difficulty over time
  gameSpeed += speedIncreaseFactor;
  spawnInterval = max(40, 90 - score / 200);

  // Display Score
  textAlign(RIGHT);
  textFont('monospace');
  textSize(24);
  fill(80);
  text(`HI ${nf(highScore, 5)}  ${nf(score, 5)}`, width - 20, 40);
}

function handleObstacles() {
  // Spawn new obstacles
  spawnTimer++;
  if (spawnTimer > spawnInterval) {
    obstacles.push(new Obstacle());
    spawnTimer = 0;
    spawnInterval = random(60, 150) / (gameSpeed / initialGameSpeed);
  }

  // Update and draw obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].show();

    if (dino.hits(obstacles[i])) {
      gameState = 'gameOver';
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
  text('PIXEL DINO RUN', width / 2, height / 2 - 80);
  
  textSize(24);
  text('Press any key to Start', width / 2, height / 2);
  
  textSize(20);
  text('Instructions: Press [SPACE] or [UP ARROW] to Jump', width / 2, height / 2 + 60);
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


// --- EVENT HANDLERS ---

function keyPressed() {
  if (gameState === 'playing') {
    if (key === ' ' || keyCode === UP_ARROW) {
      dino.jump();
    }
  } else if (gameState === 'start' || gameState === 'gameOver') {
    resetGame();
  }
}


// --- HELPER FUNCTION FOR DRAWING PIXEL ART ---

function drawPixelArt(art, x, y, pixelSize) {
  noStroke();
  fill(80); // Dino and cactus color
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
    this.x = 80;
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
    drawPixelArt(currentArt, this.x, this.y, this.pixelSize);
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
  }

  update() {
    this.x -= gameSpeed;
  }

  show() {
    drawPixelArt(this.art, this.x, this.y, this.pixelSize);
  }

  isOffscreen() {
    return this.x < -this.w;
  }
}