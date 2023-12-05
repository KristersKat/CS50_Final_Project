// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: 50,
    y: 450,
    width: 40,
    height: 70,
    color: "#00F",
    speed: 5,
};

const target = {
    x: 0,
    y: 200,
    width: 30,
    height: 30,
    color: "#F00",
};

canvas.addEventListener("mousemove", (event) => {
    player.x = event.clientX - canvas.getBoundingClientRect().left;
   // player.y = event.clientY - canvas.getBoundingClientRect().top;
});

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = target.color;
    ctx.fillRect(target.x, target.y, target.width, target.height);

    if (checkCollision(player, target)) {
        alert("You win!");
    }

    requestAnimationFrame(draw);
}

async function spawnTarget() {
    target.x = 0;
    target.y = 0;

    async function moveTarget() {
        target.x += 3;
        target.y = 800 - (-0.01 * target.x * target.x + 5 * target.x - 2);
        console.log(target.x, target.y);
    
        if (target.y < canvas.height) {
            // Recursive call using await
            await new Promise(resolve => setTimeout(() => resolve(moveTarget()), 17));
        }
    }
    // Start the movement
    await moveTarget();
}

async function startGame() {
    draw();
    await spawnTarget();
}

startGame();