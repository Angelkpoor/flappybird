class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.bird = new Bird(80, this.height / 2);
        this.pipes = [];
        this.score = 0;
        this.gameState = 'playing'; // 'playing', 'gameOver'
        
        this.pipeSpawnTimer = 0;
        this.pipeSpawnDelay = 120; // frames between pipe spawns
        this.groundHeight = 50;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleInput();
            }
        });

        this.canvas.addEventListener('click', () => {
            this.handleInput();
        });
    }

    handleInput() {
        if (this.gameState === 'playing') {
            this.bird.jump();
        } else if (this.gameState === 'gameOver') {
            this.restart();
        }
    }

    update() {
        if (this.gameState !== 'playing') return;

        // Update bird
        this.bird.update();

        // Check ground collision
        if (this.bird.y + this.bird.height >= this.height - this.groundHeight) {
            this.gameOver();
            return;
        }

        // Spawn pipes
        this.pipeSpawnTimer++;
        if (this.pipeSpawnTimer >= this.pipeSpawnDelay) {
            this.spawnPipe();
            this.pipeSpawnTimer = 0;
        }

        // Update pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.update();

            // Check collision
            if (pipe.collidesWith(this.bird)) {
                this.gameOver();
                return;
            }

            // Check scoring
            if (pipe.hasPassedBird(this.bird)) {
                this.score++;
            }

            // Remove off-screen pipes
            if (pipe.isOffScreen()) {
                this.pipes.splice(i, 1);
            }
        }
    }

    spawnPipe() {
        const minGapY = 100;
        const maxGapY = this.height - this.groundHeight - 150;
        const gapSize = 120;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        
        this.pipes.push(new Pipe(this.width, gapY, gapSize));
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw clouds
        this.drawClouds();

        // Draw pipes
        this.pipes.forEach(pipe => pipe.draw(this.ctx));

        // Draw bird
        this.bird.draw(this.ctx);

        // Draw ground
        this.drawGround();

        // Draw score
        this.drawScore();

        // Draw game over screen if needed
        if (this.gameState === 'gameOver') {
            this.drawGameOver();
        }
    }

    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Simple cloud shapes
        const clouds = [
            { x: 50, y: 80, size: 30 },
            { x: 200, y: 60, size: 25 },
            { x: 320, y: 100, size: 35 }
        ];

        clouds.forEach(cloud => {
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 20, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 35, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawGround() {
        // Draw ground
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.height - this.groundHeight, this.width, this.groundHeight);
        
        // Draw grass on top of ground
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, this.height - this.groundHeight, this.width, 10);
    }

    drawScore() {
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 3;
        this.ctx.textAlign = 'center';
        
        const text = this.score.toString();
        this.ctx.strokeText(text, this.width / 2, 60);
        this.ctx.fillText(text, this.width / 2, 60);
    }

    drawGameOver() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Game Over text
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.width / 2, this.height / 2 - 50);

        // Final score
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.width / 2, this.height / 2);

        // Restart instruction
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillText('Click or Press SPACE to restart', this.width / 2, this.height / 2 + 50);
    }

    gameOver() {
        this.gameState = 'gameOver';
    }

    restart() {
        this.bird = new Bird(80, this.height / 2);
        this.pipes = [];
        this.score = 0;
        this.gameState = 'playing';
        this.pipeSpawnTimer = 0;
    }

    run() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.run());
    }
}