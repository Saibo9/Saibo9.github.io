// game.js

// Canvas en context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Schaal canvas naar de grootte van het scherm
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Spelerinstellingen
const playerWidth = 50;
const playerHeight = 50;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 20;
const playerSpeed = 5;

// Kogels
const bullets = [];
const bulletSpeed = 7;

// Vijanden
const enemies = [];
const enemySpeed = 2;
const enemyWidth = 50;
const enemyHeight = 50;

// Beweging en schieten
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;

// Toetsen
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === ' ') spacePressed = true;
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
    if (e.key === ' ') spacePressed = false;
});

// Speler functie
function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

// Schietfunctie
function shootBullet() {
    if (spacePressed) {
        bullets.push({ x: playerX + playerWidth / 2 - 5, y: playerY, width: 10, height: 20 });
    }
}

// Bullet functie
function drawBullets() {
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.y -= bulletSpeed;
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Verwijder kogels die buiten het canvas gaan
        if (bullet.y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

// Vijand functie
function spawnEnemy() {
    if (Math.random() < 0.02) {
        let x = Math.random() * (canvas.width - enemyWidth);
        enemies.push({ x: x, y: -enemyHeight });
    }
}

function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        enemy.y += enemySpeed;
        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);

        // Verwijder vijanden die uit het scherm vallen
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
    }
}

// Botsing detectie
function checkCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            let bullet = bullets[i];
            let enemy = enemies[j];

            if (bullet.x < enemy.x + enemyWidth &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemyHeight &&
                bullet.y + bullet.height > enemy.y) {
                // Verwijder zowel de kogel als de vijand
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                i--;
                break;
            }
        }
    }
}

// Spel bijwerken
function updateGame() {
    // Achtergrond
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Beweging speler
    if (leftPressed && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (rightPressed && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }

    // Teken elementen
    drawPlayer();
    shootBullet();
    drawBullets();
    spawnEnemy();
    drawEnemies();
    checkCollisions();

    // Vraag de volgende frame aan
    requestAnimationFrame(updateGame);
}

// Start het spel
updateGame();
