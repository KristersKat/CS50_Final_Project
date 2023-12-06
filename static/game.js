window.addEventListener("load", function(){
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    var cursorX = 0;

    canvas.width = 800;
    canvas.height = 800;

    const trajectories = [
        function(x) {
            return 1 / 700 * Math.pow((x - 800), 2) + 100;
        },
        function(x) {
            return 7 / 1600 * Math.pow((x - 800), 2) + 110;
        },
        function(x) {
            return 0.028 * Math.pow(x-800, 2) + 140;
        },
        function(x) {
            return 0.006 * Math.pow(x-800, 2) + 120;
        },
        function(x) {
            return 0.002 * Math.pow(x-800, 2) + 100;
        },
    ]
    const speeds = [-11, -9, -2, -3, -7];

    canvas.addEventListener("mousemove", (event) => {
        cursorX = event.clientX;
    });

    function getInterval(game) {
        return Math.random() * 800 / game.round + (1200 / game.round);
    }

    function newGame() {
        canvas.removeEventListener("click", newGame);
        game = new Game();
        animate(0);
    }

    function gameover() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(document.getElementById("background"), 0, 0);
        ctx.font = "30px Helvetica";
        ctx.fillStyle = "white";
        ctx.fillText("Spēle beidzās", 310, 350);
        ctx.fillText("Rezultāts: " + game.score, 305, 380);
        ctx.fillText("Noklikšķini, lai spēlētu atkal", 230, 410);
        canvas.addEventListener("click", newGame);
    }

    class Player {
        constructor(game) {
            this.game = game;
            this.width = 80;
            this.height = 200;
            this.x = 20;
            this.y = 600;
            this.image = document.getElementById("player");
        }
        update(cursorX) {
            this.x = cursorX - canvas.getBoundingClientRect().left;
        }
        draw(context) {
            context.fillStyle = "blue";
            context.drawImage(this.image, this.x - this.width / 2, this.y);
        }
    }

    class Target {
        constructor(game) {
            this.game = game;
            this.player = game.player;
            this.width = 81;
            this.height = 99;
            this.x = 800;
            this.y = 100;
            this.color = "green";
            var i = Math.floor(Math.random() * 5); // Randomly selects one of the trajectories and speeds
            this.speed = speeds[i] - this.game.round;
            this.trajectory = trajectories[i];
            this.markedForDeletion = false;
            this.image = document.getElementById("target");
        }
        update() {
            this.x = this.x + this.speed;
            this.y = this.trajectory(this.x);

            if (this.y > 760) {
                this.markedForDeletion = true;
                this.game.score -= 100;
            }
            else if (this.collided()) {
                this.markedForDeletion = true;
                this.game.score += 100;
            }
        }
        draw(context) {
            context.fillStyle = this.color;
            context.drawImage(this.image, this.x, this.y);
        }
        collided() {
            return (
                this.player.x - this.player.width / 2 < this.x + this.width &&
                this.player.x + this.player.width / 2 > this.x &&
                this.player.y < this.y + this.height &&
                this.player.y + this.player.height > this.y
            );
        }
    }

    class Hazard extends Target {
        constructor(game) {
            super(game);
            this.color = "red";
            this.image = document.getElementById("hazard");
        }
        update() {
            this.x = this.x + this.speed;
            this.y = this.trajectory(this.x);

            if (this.y > 760) this.markedForDeletion = true;
            else if (this.collided()) {
                this.markedForDeletion = true;
                this.game.lives--;
            }
        }
    }

    class OneUp extends Target {
        constructor(game) {
            super(game);
            this.color = "yellow";
            this.image = document.getElementById("oneUp");
        }
        update() {
            this.x = this.x + this.speed;
            this.y = this.trajectory(this.x);

            if (this.y > 760) this.markedForDeletion = true;
            else if (this.collided()) {
                this.markedForDeletion = true;
                this.game.lives++;
                this.game.score += 1000;
            }
        }
    }

    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = "Helvetica";
            this.scoreColor = "white";
            this.liveColor = "white";
        }
        draw(context) {
            context.font = this.fontSize + "px " + this.fontFamily;
            context.fillStyle = this.scoreColor;
            context.fillText("Rezultāts: " + this.game.score, 20, 40);
            context.fillStyle = this.liveColor;
            context.fillText("Dzīvības: " + this.game.lives, 20, 70);
            context.fillText("Raunds: " + this.game.round, 20, 100);
            if (this.game.roundUpdate && this.game.targets.length === 0) {
                context.fillStyle = "white";
                context.fillText("Raunds " + (this.game.round - 1) + " pabeigts", 310, 370);
            }
        }
    }

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.ui = new UI(this);
            this.targets = [];
            this.score = 0;
            this.lives = 3;
            this.round = 1;
            this.roundUpdate = false;
            this.targetNo = 0;
        }
        update(cursorX){
            this.player.update(cursorX);
            this.targets.forEach(target => {
                target.update();
            });
        }
        draw(context){
            this.player.draw(context);
            this.ui.draw(context);
            this.targets.forEach(target => {
                target.draw(context);
            });
            this.targets = this.targets.filter(target => !target.markedForDeletion);
        }
        spawnTarget() {
            if(this.roundUpdate) this.roundUpdate = false;
            this.targetNo++;
            if (this.targetNo == Math.pow(this.round, 2) * 10) {
                interval = 5000;
                this.roundUpdate = true;
                this.round++;
            }
            // Handles target or hazard spawning
            if (Math.random() * 10 < this.round * 2 - 1) this.targets.push(new Hazard(this));
            else if(Math.random() * 15 < 1) this.targets.push(new OneUp(this));
            else this.targets.push(new Target(this));
        }
    }

    let game = new Game(canvas.width, canvas.height);

    // Spawn interval variables
    let lastTime = 0;
    let interval = getInterval(game);

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        if(deltaTime > interval) {
            lastTime = timeStamp;
            interval = getInterval(game);
            game.spawnTarget();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(document.getElementById("background"), 0, 0);
        game.update(cursorX);
        game.draw(ctx);
        if (game.lives > 0) requestAnimationFrame(animate);
        else (gameover());
    }

    canvas.addEventListener("click", newGame);
    ctx.drawImage(document.getElementById("background"), 0, 0);
    ctx.font = "50px Helvetica";
    ctx.fillStyle = "white";
    ctx.fillText("Noklikšķini, lai sāktu", 170, 370);

    /* Spawn new targets test code
    this.window.addEventListener("keydown", e => {
        game.spawnTarget();
    });*/
});