class Enemy {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = '#9b59b6';
        this.velocityY = 0;
        this.jumpPower = -15;
        this.gravity = 0.8;
        this.groundY = y;
        this.isJumping = false;
        this.jumpCooldown = 0;
        this.canvasWidth = 0; // Will be set by EnemyManager
        this.image = null; // For image assets
        this.loadImage(); // Try to load image asset
    }
    
    loadImage() {
        // Try to load enemy image asset if it exists
        const img = new Image();
        img.onload = () => {
            this.image = img;
        };
        img.onerror = () => {
            // Image not found, will use fallback drawing
            this.image = null;
        };
        img.src = 'assets/enemy.png'; // Path to enemy image asset
    }

    update(playerX, gameSpeed, obstacles) {
        // Enemy stays at fixed position on left side (same speed as player = 0 horizontal movement)
        // Enemy jumps over obstacles when they approach
        
        // Update jump cooldown
        if (this.jumpCooldown > 0) {
            this.jumpCooldown--;
        }
        
        // Check for approaching obstacles and jump if needed
        this.checkAndJumpOverObstacles(obstacles);
        
        // Apply gravity and update vertical position
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        
        // Ground collision
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }
    
    checkAndJumpOverObstacles(obstacles) {
        // Check if an obstacle is approaching and jump if needed
        for (let obstacle of obstacles) {
            // Check if obstacle is near enemy's X position (within jump range)
            const distanceToObstacle = obstacle.x - this.x;
            const jumpTriggerDistance = 80; // Jump when obstacle is this far away
            
            // If obstacle is approaching and we're on ground and not on cooldown
            if (distanceToObstacle > 0 && 
                distanceToObstacle < jumpTriggerDistance && 
                !this.isJumping && 
                this.jumpCooldown === 0) {
                // Check if we need to jump (obstacle height requires jumping)
                if (obstacle.height > 30) { // Only jump for taller obstacles
                    this.jump();
                    this.jumpCooldown = 30; // Prevent multiple jumps
                    break;
                }
            }
        }
    }
    
    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
        }
    }

    isOffScreen() {
        // Enemy stays on screen, so this shouldn't be called
        return false;
    }

    hasCaughtPlayer(playerX) {
        // Enemy is on left side, so it catches player if it reaches player's X position
        // But since enemy doesn't move horizontally, this won't happen
        // Instead, check if player gets too close to enemy
        return false; // Enemy doesn't catch by moving, collision is handled separately
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

class EnemyManager {
    constructor(canvasWidth, canvasHeight, groundY) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.groundY = groundY;
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 180; // frames between enemy spawns
        this.hitCount = 0;
        this.isHidden = false;
        this.hideTimer = 0;
        this.hideDuration = 600; // 10 seconds at 60fps
        this.baseX = 50; // Base position
        this.currentX = 50; // Current position (moves further left after hits)
        this.sizeMultiplier = 1.0; // Enemy grows larger each time it's eliminated
    }
    
    setCanvasWidth(width) {
        this.canvasWidth = width;
        // Update canvas width for all enemies
        this.enemies.forEach(enemy => {
            enemy.canvasWidth = width;
        });
    }

    update(playerX, gameSpeed, obstacles) {
        // Handle hide timer
        if (this.isHidden) {
            this.hideTimer++;
            if (this.hideTimer >= this.hideDuration) {
                this.isHidden = false;
                this.hideTimer = 0;
                // Move enemy further left after coming back
                this.currentX = Math.max(10, this.currentX - 20);
                this.spawnEnemy();
            }
        } else {
            // Spawn a single enemy if none exists (enemy stays on left side)
            if (this.enemies.length === 0) {
                this.spawnEnemy();
            }

            // Update existing enemy
            this.enemies.forEach(enemy => {
                enemy.groundY = this.groundY - enemy.height; // Update ground position first
                enemy.update(playerX, gameSpeed, obstacles);
            });
        }
    }
    
    hitEnemy() {
        this.hitCount++;
        if (this.hitCount >= 10) {
            // Remove enemy and hide for a few moments
            this.enemies = [];
            this.isHidden = true;
            this.hitCount = 0;
            // Increase size multiplier for next spawn (enemy gets larger)
            this.sizeMultiplier += 0.2; // Grow by 20% each time
        }
    }

    spawnEnemy() {
        const baseWidth = 40;
        const baseHeight = 50;
        // Apply size multiplier to make enemy larger
        const width = baseWidth * this.sizeMultiplier;
        const height = baseHeight * this.sizeMultiplier;
        const x = this.currentX; // Use current position (moves further left after hits)
        const y = this.groundY - height; // Position on ground (adjusted for larger size)
        
        const enemy = new Enemy(x, y, width, height);
        enemy.groundY = this.groundY - height; // Set ground Y position (where enemy's feet touch)
        enemy.canvasWidth = this.canvasWidth;
        this.enemies.push(enemy);
    }

    checkCollisions(player) {
        const playerBounds = player.getBounds();
        
        for (let enemy of this.enemies) {
            // Check bounding box collision (enemy is on left, player on right)
            if (Collision.checkAABB(playerBounds, enemy.getBounds())) {
                return true;
            }
        }
        return false;
    }

    reset() {
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 180;
        this.hitCount = 0;
        this.isHidden = false;
        this.hideTimer = 0;
        this.currentX = this.baseX;
        this.sizeMultiplier = 1.0; // Reset size multiplier
        // Enemy will be spawned on first update
    }
}

