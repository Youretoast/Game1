class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.originalHeight = height;
        this.velocityY = 0;
        this.jumpPower = -20; // Increased jump power for higher/further jumps
        this.gravity = 0.8;
        this.groundY = y;
        this.isJumping = false;
        this.isDucking = false;
        this.color = '#2ecc71';
        this.image = null; // For image assets
        this.loadImage(); // Try to load image asset
    }
    
    loadImage() {
        // Try to load player image asset if it exists
        const img = new Image();
        img.onload = () => {
            this.image = img;
        };
        img.onerror = () => {
            // Image not found, will use fallback drawing
            this.image = null;
        };
        img.src = 'Images for game/man-office-clothes-running-jogging-white_155003-41445.jpg';
    }
    
    duck() {
        if (!this.isJumping) {
            this.isDucking = true;
            this.height = this.originalHeight * 0.6; // Make player shorter when ducking
            this.y = this.groundY - this.height; // Adjust Y position
        }
    }
    
    stand() {
        this.isDucking = false;
        this.height = this.originalHeight;
        this.y = this.groundY - this.height;
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
        }
    }

    update() {
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Ground collision
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
        }
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

