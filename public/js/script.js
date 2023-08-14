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
        y: canvas.height - this.height,
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
      "../src/img/batu 4.png",
      "../src/img/batu 2.png",
      "../src/img/batu 3.png",
      // Add more image sources here
    ];

    const selectedImageSrc =
      obstacleImages[Math.floor(Math.random() * obstacleImages.length)];

    const obstacleImage = new Image();
    obstacleImage.src = selectedImageSrc;
    obstacleImage.onload = () => {
      const scale = 0.05;
      this.image = obstacleImage;
      this.width = obstacleImage.width * scale;
      this.height = obstacleImage.height * scale;
      this.position = {
        x: Math.random() * (canvas.width - this.width), // Random x-coordinate
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
      if (detectCollision(player, this)) {
        console.log("Collision detected!");
        gameOver = true; // Set the game over flag
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

function detectCollision(a, b) {
  return (
    a.position.x < b.position.x + b.width &&
    a.position.x + a.width > b.position.x &&
    a.position.y < b.position.y + b.height &&
    a.position.y + a.height > b.position.y
  );
}

function spawnObstacle() {
  const obstacle = new Obstacle();
  obstacles.push(obstacle);
}

function spawnObstacleWithRandomTime() {
  spawnObstacle();
  const minSpawnInterval = 1500;
  const maxSpawnInterval = 3000;
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

function animate() {
  if (!gameOver) {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(backgroundImage, 0, 0);

    for (const obstacle of obstacles) {
      obstacle.update();
    }

    player.update();

    if (keys.a.pressed && player.position.x >= 280) {
      player.velocity.x = -3;
    } else if (keys.d.pressed && player.position.x <= 650) {
      player.velocity.x = 3;
    } else {
      player.velocity.x = 0;
    }
  } else {
    // Game over logic
    c.fillStyle = "black";
    c.font = "36px Arial";
    c.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
  }

  clearObstacles(); // Clear obstacles that have moved out of the canvas
}

clearObstacles(); // Clear obstacles that have moved out of the canvas

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
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
