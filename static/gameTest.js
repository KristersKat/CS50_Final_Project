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
            return 7 / 1600 * Math.pow((x - 800), 2) + 100;
        },
        function(x) {
            return 0.028 * Math.pow(x-800, 2) + 150;
        },
    ]
    const speeds = [-12, -10, -3];

    canvas.addEventListener("mousemove", (event) => {
        cursorX = event.clientX;
    });

    function getInterval(game) {
        return Math.random() * 800 / game.round + (1200 / game.round);
    }

    function gameover() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "100px Helvetica";
        ctx.fillText("Game over", 250, 350);
    }

    class Player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 600;
        }
        update(cursorX) {
            this.x = cursorX - canvas.getBoundingClientRect().left;
        }
        draw(context) {
            context.fillStyle = "blue";
            context.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        }
    }

    class Target {
        constructor(game) {
            this.game = game;
            this.player = game.player;
            this.width = 80;
            this.height = 80;
            this.x = 800;
            this.y = 100;
            this.color = "green";
            var i = Math.floor(Math.random() * 3); // Randomly selects one of the trajectories and speeds
            this.speed = speeds[i];
            this.trajectory = trajectories[i];
            this.markedForDeletion = false;
        }
        update() {
            this.x = this.x + this.speed;
            this.y = this.trajectory(this.x);

            if (this.y > 760) this.markedForDeletion = true;
            else if (this.collided()) {
                this.markedForDeletion = true;
                this.game.score += 100;
            }
        }
        draw(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
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
            this.scoreColor = "black";
            this.liveColor = "green";
        }
        draw(context) {
            context.font = this.fontSize + "px " + this.fontFamily;
            context.fillStyle = this.scoreColor;
            context.fillText("Score: " + this.game.score, 20, 40);
            context.fillStyle = this.liveColor;
            context.fillText("Lives: " + this.game.lives, 20, 70);
            context.fillText("Round: " + this.game.round, 20, 100);
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
            this.targetNo++;
            if (this.targetNo == Math.pow(this.round, 2) * 10) this.round++;

            // Handles target or hazard spawning
            if (Math.random() * 10 < this.round * 2 - 1) this.targets.push(new Hazard(this));
            else if(Math.random() * 15 < 1) this.targets.push(new OneUp(this));
            else this.targets.push(new Target(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);

    // Spawn interval variables
    let lastTime = 0;
    let interval = getInterval(game);

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        if(deltaTime > interval) {
            game.spawnTarget();
            lastTime = timeStamp;
            interval = getInterval(game);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(cursorX);
        game.draw(ctx);
        if (game.lives > 0) requestAnimationFrame(animate);
        else (gameover());
    }

    animate(0);
    /* Spawn new targets test code
    this.window.addEventListener("keydown", e => {
        game.spawnTarget();
    });*/
});