const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const backgroundImage = new Image();
backgroundImage.src = "../src/img/bg.svg";

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = "../src/img/player.png";
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 57,
        y: canvas.height - this.height * 1.5,
      };
    };
    this.frames = 0;
  }

  // animated gif
  draw() {
    c.drawImage(
      // 997x940
      this.image,
      63.56 * this.frames,
      0,
      63.56,
      115,
      this.position.x,
      this.position.y,
      this.width / 25,
      this.height * 1.1
    );
  }

  update() {
    this.frames++;
    if (this.frames > 39) this.frames = 0;
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

class Obstacle {
  constructor() {
    this.velocity = {
      x: 0,
      y: 1,
    };

    const obstacleImages = [
      "../src/img/Asset 1.png",
      "../src/img/Asset 2.png",
      "../src/img/Asset 3.png",
      // Add more image sources here
    ];

    const selectedImageSrc =
      obstacleImages[Math.floor(Math.random() * obstacleImages.length)];

    const obstacleImage = new Image();
    obstacleImage.src = selectedImageSrc;
    obstacleImage.onload = () => {
      const scale = 0.12;
      this.image = obstacleImage;
      this.width = obstacleImage.width * scale;
      this.height = obstacleImage.height * scale;
      this.position = {
        x: Math.random() * (650 - 280) + 280, // Random x-coordinate
        y: 0,
      };
    };
    this.passed = false;
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.y += this.velocity.y;

      if (this.position.y > canvas.height) {
        obstacles.splice(obstacles.indexOf(this), 1);
      }
    }
  }
}

const obstacles = [];
const player = new Player();
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};
let score = 0;
function detectCollision(a, b) {
  const playerTop = a.position.y;
  const playerBottom = a.position.y + a.height / 39;
  const playerLeft = a.position.x;
  const playerRight = a.position.x + a.width / 39; // Divided by the number of frames in the animation

  const obstacleTop = b.position.y;
  const obstacleBottom = b.position.y + b.height;
  const obstacleLeft = b.position.x;
  const obstacleRight = b.position.x + b.width;

  return (
    playerBottom > obstacleTop && // Player's bottom is below obstacle's top
    playerTop < obstacleBottom && // Player's top is above obstacle's bottom
    playerRight > obstacleLeft && // Player's right is to the right of obstacle's left
    playerLeft < obstacleRight // Player's left is to the left of obstacle's right
  );
}

function spawnObstacle() {
  const obstacle = new Obstacle();
  obstacles.push(obstacle);
}

function spawnObstacleWithRandomTime() {
  spawnObstacle();
  const minSpawnInterval = 2000;
  const maxSpawnInterval = 4000;
  const randomTime =
    Math.random() * (maxSpawnInterval - minSpawnInterval) + minSpawnInterval;
  setTimeout(spawnObstacleWithRandomTime, randomTime);
}

function clearObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    if (obstacles[i].position.y >= canvas.height) {
      obstacles.splice(i, 1);
    }
  }
}

let gameOver = false;
let timeSinceLastCollision = 0;
function animate() {
  if (!gameOver) {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(backgroundImage, 0, 0);

    for (const obstacle of obstacles) {
      obstacle.update();
      if (detectCollision(player, obstacle)) {
        console.log("Collision detected!");
        gameOver = true;
      }
    }

    // Increment the time since last collision
    timeSinceLastCollision += 16.67; // Roughly 60 frames per second

    // Update the score based on the time since last collision
    score = Math.floor(timeSinceLastCollision / 1000); // Convert to seconds

    // Update player's position
    player.update();

    if (keys.a.pressed && player.position.x >= 280) {
      player.velocity.x = -3;
    } else if (keys.d.pressed && player.position.x <= 650) {
      player.velocity.x = 3;
    } else {
      player.velocity.x = 0;
    }
  } else {
    c.fillStyle = "black";
    c.font = "36px Arial";
    c.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
    c.fillText(
      "Score: " + score,
      canvas.width / 2 - 40,
      canvas.height / 2 + 40
    );
    // Reset game logic here if needed
  }

  clearObstacles();
}
addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = true;
      if (gameOver) {
        player.position.x = canvas.width / 2 - player.width / 57;
        player.position.y = canvas.height - player.height * 1.5;
        obstacles.length = 0;
        gameOver = false;
        animate();
      }
      break;
    case "d":
      keys.d.pressed = true;
      if (gameOver) {
        player.position.x = canvas.width / 2 - player.width / 57;
        player.position.y = canvas.height - player.height * 1.5;
        obstacles.length = 0;
        gameOver = false;
        animate();
      }
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
spawnObstacleWithRandomTime();
animate();
