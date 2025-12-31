class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.renderer = new Renderer(this.canvas);
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // Game state
        this.state = 'menu'; // menu, playing, gameOver
        this.score = 0;
        this.gameSpeed = 5;
        this.baseSpeed = 5;
        
        // Game objects
        this.groundY = this.canvas.height - 50;
        this.player = new Player(250, this.groundY - 50, 30, 50); // Moved player more to the right
        this.obstacleManager = new ObstacleManager(this.canvas.width, this.canvas.height, this.groundY);
        this.enemyManager = new EnemyManager(this.canvas.width, this.canvas.height, this.groundY);
        
        // UI elements
        this.menu = document.getElementById('menu');
        this.gameOverScreen = document.getElementById('gameOver');
        this.scoreDisplay = document.getElementById('score');
        this.finalScoreDisplay = document.getElementById('finalScore');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.lastTime = 0;
        this.gameLoop(0);
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.state === 'playing') {
                    this.player.jump();
                    this.player.stand(); // Stand up if jumping
                }
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                e.preventDefault();
                if (this.state === 'playing') {
                    this.player.duck();
                }
            }
            if (e.key === 'r' || e.key === 'R') {
                if (this.state === 'gameOver') {
                    this.restart();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                e.preventDefault();
                if (this.state === 'playing') {
                    this.player.stand();
                }
            }
        });

        // Button clicks
        this.startButton.addEventListener('click', () => this.start());
        this.restartButton.addEventListener('click', () => this.restart());
    }

    start() {
        this.state = 'playing';
        this.menu.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.score = 0;
        this.gameSpeed = this.baseSpeed;
        this.resetGame();
    }

    restart() {
        this.start();
    }

    resetGame() {
        this.player = new Player(250, this.groundY - 50, 30, 50); // Moved player more to the right
        this.obstacleManager.reset();
        this.enemyManager.reset();
    }

    update() {
        if (this.state !== 'playing') return;

        // Update player
        this.player.update();

        // Update obstacles
        this.obstacleManager.update(this.gameSpeed);

        // Update enemies (pass obstacles so enemy can jump over them)
        this.enemyManager.update(this.player.x, this.gameSpeed, this.obstacleManager.obstacles);

        // Check collisions
        if (this.obstacleManager.checkCollisions(this.player)) {
            this.gameOver();
            return;
        }

        if (this.enemyManager.checkCollisions(this.player)) {
            this.gameOver();
            return;
        }

        // Update score and speed
        this.score += 1;
        this.gameSpeed = this.baseSpeed + Math.floor(this.score / 500);
        
        // Update score display
        this.scoreDisplay.textContent = `Score: ${this.score}`;
    }

    render() {
        // Clear canvas
        this.renderer.clear();

        if (this.state === 'playing') {
            // Draw sky background
            this.renderer.drawSky();
            
            // Draw ground
            this.renderer.drawGround(this.groundY);

            // Draw obstacles (behind player)
            this.renderer.drawObstacles(this.obstacleManager.obstacles);

            // Draw player
            this.renderer.drawPlayer(this.player);

            // Draw enemies (only if not hidden)
            if (!this.enemyManager.isHidden) {
                this.renderer.drawEnemies(this.enemyManager.enemies);
            }
        }
    }

    gameOver() {
        this.state = 'gameOver';
        this.finalScoreDisplay.textContent = this.score;
        this.gameOverScreen.classList.remove('hidden');
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update();
        this.render();

        requestAnimationFrame((ts) => this.gameLoop(ts));
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
});

