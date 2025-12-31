class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = '#e74c3c';
        this.speed = 0;
        this.type = 'ground'; // 'ground' or 'plane'
    }

    update(speed) {
        this.speed = speed;
        this.x -= speed;
    }

    isOffScreen() {
        return this.x + this.width < 0;
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

class Plane extends Obstacle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'plane';
        this.color = '#3498db';
    }
}

class ObstacleManager {
    constructor(canvasWidth, canvasHeight, groundY) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.groundY = groundY;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 120; // frames between spawns
    }

    update(gameSpeed) {
        // Spawn new obstacles
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnObstacle();
            this.spawnTimer = 0;
            // Decrease spawn interval as game speeds up (but not too fast)
            this.spawnInterval = Math.max(60, 120 - Math.floor(gameSpeed / 2));
        }

        // Update existing obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.update(gameSpeed);
        });

        // Remove off-screen obstacles
        this.obstacles = this.obstacles.filter(obstacle => !obstacle.isOffScreen());
    }

    spawnObstacle() {
        // 70% chance of ground obstacle, 30% chance of plane
        const isPlane = Math.random() < 0.3;
        
        if (isPlane) {
            this.spawnPlane();
        } else {
            this.spawnGroundObstacle();
        }
    }
    
    spawnGroundObstacle() {
        // Office building width (wider than before)
        const width = 40;
        // 70% chance of normal height (30-60), 30% chance of taller (60-80, taller than player)
        const isTall = Math.random() < 0.3;
        const height = isTall 
            ? Math.random() * 20 + 60  // Tall buildings: 60-80
            : Math.random() * 30 + 30; // Normal buildings: 30-60
        const x = this.canvasWidth;
        const y = this.groundY - height; // Position on ground
        
        const building = new Obstacle(x, y, width, height);
        building.floors = Math.floor(height / 15); // Number of floors based on height
        this.obstacles.push(building);
    }
    
    spawnPlane() {
        const width = 60;
        const height = 20;
        const x = this.canvasWidth;
        // Plane flies low, at player's head level when standing
        const y = this.groundY - 80; // Position above ground (player head level)
        
        this.obstacles.push(new Plane(x, y, width, height));
    }

    checkCollisions(player) {
        const playerBounds = player.getBounds();
        
        for (let obstacle of this.obstacles) {
            if (Collision.checkAABB(playerBounds, obstacle.getBounds())) {
                // If it's a plane and player is ducking, they avoid it
                if (obstacle.type === 'plane' && player.isDucking) {
                    continue; // Player ducked under the plane, no collision
                }
                // Otherwise, collision occurs
                return true;
            }
        }
        return false;
    }

    reset() {
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 120;
    }
}

