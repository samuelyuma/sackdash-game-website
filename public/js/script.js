const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const backgroundImage = new Image()
backgroundImage.src = '../img-game/bg.svg'

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0,
        }

        const image = new Image()
        image.src = '../img-game/player.png'
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 57,
                y: canvas.height - this.height * 1.5,
            }
        }
        this.frames = 0
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
        )
    }

    update() {
        this.frames++
        if (this.frames > 39) this.frames = 0
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Obstacle {
    constructor() {
        this.velocity = {
            x: 0,
            y: 1,
        }

        const obstacleImages = [
            '../img-game/Asset 1.png',
            '../img-game/Asset 2.png',
            '../img-game/Asset 3.png',
            '../img-game/Asset 4.png',
            '../img-game/Asset 5.png',
            '../img-game/Asset 6.png',
            '../img-game/Asset 7.png',
            '../img-game/Asset 8.png',
            // Add more image sources here
        ]

        const selectedImageSrc =
            obstacleImages[Math.floor(Math.random() * obstacleImages.length)]

        const obstacleImage = new Image()
        obstacleImage.src = selectedImageSrc
        obstacleImage.onload = () => {
            const scale = 0.12
            this.image = obstacleImage
            this.width = obstacleImage.width * scale
            this.height = obstacleImage.height * scale
            // setting posisi random
            this.position = {
                x: Math.random() * (650 - 280) + 280, // Random x-coordinate
                y: 0,
            }
        }
        this.passed = false
    }

    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.y += this.velocity.y

            if (this.position.y > canvas.height) {
                obstacles.splice(obstacles.indexOf(this), 1)
            }
        }
    }
}

const obstacles = []
const player = new Player()
const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}
let score = 0
function detectCollision(a, b) {
    const playerTop = a.position.y
    const playerBottom = a.position.y + a.height / 2
    const playerLeft = a.position.x
    const playerRight = a.position.x + a.width / 39 // Divided by the number of frames in the animation

    const obstacleTop = b.position.y
    const obstacleBottom = b.position.y + b.height
    const obstacleLeft = b.position.x
    const obstacleRight = b.position.x + b.width / 2

    return (
        playerBottom > obstacleTop && // Player's bottom is below obstacle's top
        playerTop < obstacleBottom && // Player's top is above obstacle's bottom
        playerRight > obstacleLeft && // Player's right is to the right of obstacle's left
        playerLeft < obstacleRight // Player's left is to the left of obstacle's right
    )
}

function stopBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic')
    backgroundMusic.pause()
    backgroundMusic.currentTime = 0 // Reset the playback position
}

function spawnObstacle() {
    const obstacle = new Obstacle()
    obstacles.push(obstacle)
}
// setting interval waktu
function spawnObstacleWithRandomTime() {
    spawnObstacle()
    const minSpawnInterval = 2000
    const maxSpawnInterval = 4000
    const randomTime =
        Math.random() * (maxSpawnInterval - minSpawnInterval) + minSpawnInterval
    setTimeout(spawnObstacleWithRandomTime, randomTime)
}

function clearObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].position.y >= canvas.height) {
            obstacles.splice(i, 1)
        }
    }
}

function playBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic')

    backgroundMusic.addEventListener('ended', () => {
        backgroundMusic.currentTime = 0 // Reset the playback position
        if (!gameOver) {
            backgroundMusic.play() // Start playing from the beginning if the game is not over
        }
    })

    backgroundMusic.play() // Start playing the music
}

let gameOver = false
let timeSinceLastCollision = 0
let playButtonHover = false

function animate() {
    if (!gameOver) {
        playBackgroundMusic()
        requestAnimationFrame(animate)
        c.clearRect(0, 0, canvas.width, canvas.height)
        c.drawImage(backgroundImage, 0, 0)

        for (const obstacle of obstacles) {
            obstacle.update()
            if (detectCollision(player, obstacle)) {
                console.log('Collision detected!')
                gameOver = true
                stopBackgroundMusic()
            }
        }

        // Increment the time since last collision
        timeSinceLastCollision += 16.67 // Roughly 60 frames per second

        // Update the score based on the time since last collision
        score = Math.floor(timeSinceLastCollision / 1000) // Convert to seconds

        // Update player's position
        player.update()

        if (keys.a.pressed && player.position.x >= 280) {
            player.velocity.x = -3
        } else if (keys.d.pressed && player.position.x <= 650) {
            player.velocity.x = 3
        } else {
            player.velocity.x = 0
        }
    } else {
        // Darken the background with a black overlay
        c.fillStyle = 'rgba(0, 0, 0, 0.5)'
        c.fillRect(0, 0, canvas.width, canvas.height)

        // Set the styles for the text
        c.fillStyle = '#ffffff'
        c.font = '72px Khand, Arial' // Changed font size for the "Game Over" text
        const gameOverText = 'Game Over!'
        const scoreText = 'Score: ' + score
        const playAgainText1 = 'Press one of the following keys to play again:'
        const playAgainText2 = "'a', 'd', arrow right, arrow left"

        const gameOverTextWidth = c.measureText(gameOverText).width
        const scoreTextWidth = c.measureText(scoreText).width
        const playAgainText1Width = c.measureText(playAgainText1).width
        const playAgainText2Width = c.measureText(playAgainText2).width

        const gameOverTextX = canvas.width / 2 - gameOverTextWidth / 2
        const gameOverTextY = canvas.height / 2 - 60 // Adjusted Y position for vertical centering
        const scoreTextX = canvas.width / 2 - scoreTextWidth / 2 - 6
        const scoreTextY = canvas.height / 2 + 15 // Adjusted Y position for vertical centering

        // Calculate the width of the longer line of playAgainText
        const maxPlayAgainTextWidth = Math.max(
            playAgainText1Width,
            playAgainText2Width
        )

        const playAgainText1X =
            canvas.width / 2 - maxPlayAgainTextWidth / 2 + 315 // Centered horizontally
        const playAgainText1Y = scoreTextY + 60 // Positioned under the score text
        const playAgainText2X = canvas.width / 2 - playAgainText2Width / 2 + 190 // Centered horizontally under playAgainText1
        const playAgainText2Y = playAgainText1Y + 30 // Positioned below playAgainText1

        // Draw the text on the canvas
        c.fillText(gameOverText, gameOverTextX, gameOverTextY)

        c.font = '48px "JetBrains Mono", Arial' // Changed font and size for the score text
        c.fillText(scoreText, scoreTextX, scoreTextY) // Centered score text

        c.font = '20px "JetBrains Mono", Arial' // Changed font and size for the play again text
        c.fillText(playAgainText1, playAgainText1X, playAgainText1Y)
        c.fillText(playAgainText2, playAgainText2X, playAgainText2Y) // Centered under playAgainText1
    }

    clearObstacles()
}

addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'a':
            keys.a.pressed = true
            if (gameOver) {
                player.position.x = canvas.width / 2 - player.width / 57
                player.position.y = canvas.height - player.height * 1.5
                obstacles.length = 0
                gameOver = false
                animate()
            }
            break
        case 'd':
            keys.d.pressed = true
            if (gameOver) {
                player.position.x = canvas.width / 2 - player.width / 57
                player.position.y = canvas.height - player.height * 1.5
                obstacles.length = 0
                gameOver = false
                animate()
            }
            break
        case 'ArrowLeft':
            keys.a.pressed = true
            if (gameOver) {
                player.position.x = canvas.width / 2 - player.width / 57
                player.position.y = canvas.height - player.height * 1.5
                obstacles.length = 0
                gameOver = false
                animate()
            }
            break
        case 'ArrowRight':
            keys.d.pressed = true
            if (gameOver) {
                player.position.x = canvas.width / 2 - player.width / 57
                player.position.y = canvas.height - player.height * 1.5
                obstacles.length = 0
                gameOver = false
                animate()
            }
            break
    }
})

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'ArrowLeft':
            keys.a.pressed = false
            break
        case 'ArrowRight':
            keys.d.pressed = false
            break
    }
})

spawnObstacleWithRandomTime()
animate()
