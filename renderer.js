class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cloudOffset = 0;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawSky() {
        // Arcade-style night sky with neon gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add some stars for arcade feel
        this.drawStars();
        
        // Draw clouds (darker for night theme)
        this.cloudOffset += 0.3;
        this.drawClouds();
    }
    
    drawStars() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const stars = [
            { x: 50, y: 30 }, { x: 150, y: 50 }, { x: 250, y: 25 },
            { x: 350, y: 45 }, { x: 450, y: 35 }, { x: 550, y: 55 },
            { x: 650, y: 30 }, { x: 750, y: 40 }
        ];
        stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawClouds() {
        // Darker clouds for night/arcade theme
        this.ctx.fillStyle = 'rgba(50, 50, 70, 0.6)';
        const cloudPositions = [
            { x: 100 + this.cloudOffset % 1000, y: 50 },
            { x: 400 + (this.cloudOffset * 0.7) % 1000, y: 80 },
            { x: 700 + (this.cloudOffset * 0.5) % 1000, y: 40 },
            { x: -200 + (this.cloudOffset * 0.6) % 1000, y: 60 }
        ];
        
        cloudPositions.forEach(pos => {
            this.drawCloud(pos.x, pos.y);
        });
    }
    
    drawCloud(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
        this.ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 15, y - 15, 15, 0, Math.PI * 2);
        this.ctx.arc(x + 35, y - 15, 18, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawGround(groundY) {
        // Arcade-style street/road gradient (dark asphalt)
        const groundGradient = this.ctx.createLinearGradient(0, groundY, 0, this.canvas.height);
        groundGradient.addColorStop(0, '#2c3e50');
        groundGradient.addColorStop(0.5, '#34495e');
        groundGradient.addColorStop(1, '#1a252f');
        this.ctx.fillStyle = groundGradient;
        this.ctx.fillRect(0, groundY, this.canvas.width, this.canvas.height - groundY);
        
        // Street markings (road lines)
        this.ctx.strokeStyle = '#f39c12';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([20, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, groundY + 15);
        this.ctx.lineTo(this.canvas.width, groundY + 15);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Neon border glow
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00ffff';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, groundY);
        this.ctx.lineTo(this.canvas.width, groundY);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    drawPlayer(player) {
        // Support for image assets (if provided)
        if (player.image && player.image.complete) {
            this.ctx.drawImage(
                player.image, 
                player.x, 
                player.y, 
                player.width, 
                player.height
            );
            return;
        }
        
        // Fallback: Arcade-style neon character
        // Shadow with glow
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#00ff00';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(player.x + 2, player.y + player.height + 2, player.width, 4);
        this.ctx.shadowBlur = 0;
        
        // Body with neon green glow
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#00ff00';
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
        this.ctx.shadowBlur = 0;
        
        // Body highlight
        this.ctx.fillStyle = '#39ff14';
        this.ctx.fillRect(player.x + 2, player.y + 2, player.width - 4, 8);
        
        // Head
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(player.x + player.width / 2, player.y, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eyes (glowing)
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#ffffff';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(player.x + player.width / 2 - 4, player.y - 2, 3, 0, Math.PI * 2);
        this.ctx.arc(player.x + player.width / 2 + 4, player.y - 2, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(player.x + player.width / 2 - 4, player.y - 2, 2, 0, Math.PI * 2);
        this.ctx.arc(player.x + player.width / 2 + 4, player.y - 2, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Arms (when not ducking)
        if (!player.isDucking) {
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(player.x - 3, player.y + 10, 4, 15);
            this.ctx.fillRect(player.x + player.width - 1, player.y + 10, 4, 15);
        }
        
        // Legs (when not ducking)
        if (!player.isDucking) {
            this.ctx.fillStyle = '#00cc00';
            this.ctx.fillRect(player.x + 5, player.y + player.height - 10, 6, 10);
            this.ctx.fillRect(player.x + player.width - 11, player.y + player.height - 10, 6, 10);
        }
    }

    drawObstacle(obstacle) {
        if (obstacle.type === 'plane') {
            this.drawPlane(obstacle);
        } else {
            this.drawOfficeBuilding(obstacle);
        }
    }
    
    drawOfficeBuilding(building) {
        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.fillRect(building.x + 4, building.y + building.height + 3, building.width, 5);
        
        // Building base color (gray concrete)
        const gradient = this.ctx.createLinearGradient(building.x, building.y, building.x + building.width, building.y);
        gradient.addColorStop(0, '#7f8c8d');
        gradient.addColorStop(0.5, '#95a5a6');
        gradient.addColorStop(1, '#7f8c8d');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(building.x, building.y, building.width, building.height);
        
        // Building outline
        this.ctx.strokeStyle = '#34495e';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(building.x, building.y, building.width, building.height);
        
        // Draw windows (office building style)
        const floors = building.floors || Math.floor(building.height / 15);
        const windowWidth = 8;
        const windowHeight = 10;
        const windowSpacing = 12;
        const floorHeight = building.height / floors;
        
        // Window colors (some lit, some dark for realism)
        const windowColors = ['#f1c40f', '#e67e22', '#3498db', '#2c3e50', '#34495e'];
        
        for (let floor = 0; floor < floors; floor++) {
            const floorY = building.y + (floor * floorHeight);
            const windowsPerRow = Math.floor((building.width - 10) / windowSpacing);
            
            for (let i = 0; i < windowsPerRow; i++) {
                const windowX = building.x + 5 + (i * windowSpacing);
                const windowY = floorY + 3;
                
                // Random window color (some lit, some dark)
                const isLit = Math.random() > 0.4;
                this.ctx.fillStyle = isLit 
                    ? windowColors[Math.floor(Math.random() * 3)] // Lit windows (yellow, orange, blue)
                    : windowColors[3 + Math.floor(Math.random() * 2)]; // Dark windows
                
                this.ctx.fillRect(windowX, windowY, windowWidth, windowHeight);
                
                // Window frame
                this.ctx.strokeStyle = '#2c3e50';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(windowX, windowY, windowWidth, windowHeight);
            }
        }
        
        // Building top accent (roof)
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(building.x - 2, building.y - 3, building.width + 4, 3);
        
        // OFFICE sign (neon arcade style)
        const signY = building.y + 15; // Position sign near top of building
        const signWidth = building.width - 4;
        const signHeight = 12;
        
        // Sign background
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(building.x + 2, signY, signWidth, signHeight);
        
        // Sign border with neon glow
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#ffff00';
        this.ctx.strokeStyle = '#ffff00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(building.x + 2, signY, signWidth, signHeight);
        this.ctx.shadowBlur = 0;
        
        // Draw "OFFICE" text
        this.ctx.save();
        this.ctx.font = 'bold 8px "Press Start 2P", monospace';
        this.ctx.fillStyle = '#ffff00';
        this.ctx.shadowBlur = 3;
        this.ctx.shadowColor = '#ffff00';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('OFFICE', building.x + building.width / 2, signY + signHeight / 2);
        this.ctx.shadowBlur = 0;
        this.ctx.restore();
    }
    
    drawPlane(plane) {
        // Shadow with cyan glow
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = '#00ffff';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(plane.x + 5, plane.y + plane.height + 3, plane.width, 3);
        this.ctx.shadowBlur = 0;
        
        // Main body with neon cyan glow
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#00ffff';
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillRect(plane.x, plane.y, plane.width, plane.height);
        this.ctx.shadowBlur = 0;
        
        // Body highlight
        this.ctx.fillStyle = '#66ffff';
        this.ctx.fillRect(plane.x + 2, plane.y + 2, plane.width - 4, 6);
        
        // Wings (left and right) with glow
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = '#0099ff';
        this.ctx.fillStyle = '#0099ff';
        this.ctx.beginPath();
        this.ctx.moveTo(plane.x - 8, plane.y + 8);
        this.ctx.lineTo(plane.x, plane.y + 5);
        this.ctx.lineTo(plane.x, plane.y + 12);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(plane.x + plane.width, plane.y + 5);
        this.ctx.lineTo(plane.x + plane.width + 8, plane.y + 8);
        this.ctx.lineTo(plane.x + plane.width, plane.y + 12);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Cockpit window (glowing)
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#ffff00';
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(plane.x + plane.width / 2, plane.y - 2, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        this.ctx.fillStyle = '#ffaa00';
        this.ctx.beginPath();
        this.ctx.arc(plane.x + plane.width / 2, plane.y - 2, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Tail
        this.ctx.fillStyle = '#0099ff';
        this.ctx.beginPath();
        this.ctx.moveTo(plane.x + plane.width - 5, plane.y);
        this.ctx.lineTo(plane.x + plane.width + 5, plane.y - 10);
        this.ctx.lineTo(plane.x + plane.width, plane.y);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Propeller blur effect (neon)
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#ffffff';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(plane.x - 2, plane.y + plane.height / 2, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    drawEnemy(enemy) {
        // Support for image assets (if provided)
        if (enemy.image && enemy.image.complete) {
            this.ctx.drawImage(
                enemy.image, 
                enemy.x, 
                enemy.y, 
                enemy.width, 
                enemy.height
            );
            return;
        }
        
        // Fallback: Arcade-style neon enemy
        // Shadow with red glow
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#ff00ff';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.fillRect(enemy.x + 3, enemy.y + enemy.height + 2, enemy.width, 5);
        this.ctx.shadowBlur = 0;
        
        // Body with neon purple glow
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = '#ff00ff';
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        this.ctx.shadowBlur = 0;
        
        // Body highlight
        this.ctx.fillStyle = '#ff66ff';
        this.ctx.fillRect(enemy.x + 3, enemy.y + 3, enemy.width - 6, 10);
        
        // Head
        this.ctx.fillStyle = '#cc00cc';
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width / 2, enemy.y, enemy.width / 2.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Glowing red eyes (more intense)
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff0000';
        this.ctx.fillStyle = '#ff0000';
        const eyeSize = enemy.width / 6;
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width / 2 - enemy.width / 4, enemy.y - 2, eyeSize, 0, Math.PI * 2);
        this.ctx.arc(enemy.x + enemy.width / 2 + enemy.width / 4, enemy.y - 2, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Arms
        this.ctx.fillStyle = '#cc00cc';
        this.ctx.fillRect(enemy.x - 4, enemy.y + 12, 5, 18);
        this.ctx.fillRect(enemy.x + enemy.width - 1, enemy.y + 12, 5, 18);
        
        // Megaphone in right hand (extended forward)
        const megaphoneX = enemy.x + enemy.width - 1;
        const megaphoneY = enemy.y + 15;
        
        // Megaphone body (cone shape)
        this.ctx.fillStyle = '#ff6600';
        this.ctx.beginPath();
        this.ctx.moveTo(megaphoneX, megaphoneY);
        this.ctx.lineTo(megaphoneX + 12, megaphoneY + 8);
        this.ctx.lineTo(megaphoneX + 8, megaphoneY + 12);
        this.ctx.lineTo(megaphoneX + 2, megaphoneY + 8);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Megaphone handle/grip
        this.ctx.fillStyle = '#cc5500';
        this.ctx.fillRect(megaphoneX + 2, megaphoneY + 8, 4, 6);
        
        // Megaphone rim
        this.ctx.strokeStyle = '#ff8800';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(megaphoneX, megaphoneY);
        this.ctx.lineTo(megaphoneX + 12, megaphoneY + 8);
        this.ctx.stroke();
        
        // Sound waves from megaphone
        this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(megaphoneX + 12, megaphoneY + 8, 8, 0, Math.PI / 2);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(megaphoneX + 12, megaphoneY + 8, 12, 0, Math.PI / 2);
        this.ctx.stroke();
        
        // Legs
        this.ctx.fillStyle = '#990099';
        this.ctx.fillRect(enemy.x + enemy.width / 4, enemy.y + enemy.height - 12, 6, 12);
        this.ctx.fillRect(enemy.x + enemy.width * 3 / 4 - 6, enemy.y + enemy.height - 12, 6, 12);
        
        // BOSS sign above enemy
        const signY = enemy.y - 20;
        const signWidth = enemy.width + 10;
        const signHeight = 14;
        
        // Sign background
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(enemy.x - 5, signY, signWidth, signHeight);
        
        // Sign border with red neon glow
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = '#ff0000';
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(enemy.x - 5, signY, signWidth, signHeight);
        this.ctx.shadowBlur = 0;
        
        // Draw "BOSS" text
        this.ctx.save();
        this.ctx.font = 'bold 9px "Press Start 2P", monospace';
        this.ctx.fillStyle = '#ff0000';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = '#ff0000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('BOSS', enemy.x + enemy.width / 2, signY + signHeight / 2);
        this.ctx.shadowBlur = 0;
        this.ctx.restore();
    }

    drawObstacles(obstacles) {
        obstacles.forEach(obstacle => this.drawObstacle(obstacle));
    }

    drawEnemies(enemies) {
        enemies.forEach(enemy => this.drawEnemy(enemy));
    }

    drawScore(score) {
        // Score is drawn in HTML, but we can add canvas score too if needed
    }
}

