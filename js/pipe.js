class Pipe {
    constructor(x, gapY, gapSize) {
        this.x = x;
        this.width = 60;
        this.gapY = gapY;
        this.gapSize = gapSize;
        this.speed = 2;
        this.passed = false;
        this.canvasHeight = 600;
    }

    update() {
        this.x -= this.speed;
    }

    draw(ctx) {
        // Draw top pipe
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.x, 0, this.width, this.gapY);
        
        // Draw top pipe cap
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(this.x - 5, this.gapY - 20, this.width + 10, 20);
        
        // Draw bottom pipe
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.x, this.gapY + this.gapSize, this.width, this.canvasHeight - (this.gapY + this.gapSize));
        
        // Draw bottom pipe cap
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(this.x - 5, this.gapY + this.gapSize, this.width + 10, 20);
        
        // Add pipe outlines
        ctx.strokeStyle = '#006400';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, 0, this.width, this.gapY);
        ctx.strokeRect(this.x, this.gapY + this.gapSize, this.width, this.canvasHeight - (this.gapY + this.gapSize));
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    collidesWith(bird) {
        const birdBounds = bird.getBounds();
        
        // Check if bird is within pipe's x range
        if (birdBounds.x < this.x + this.width && 
            birdBounds.x + birdBounds.width > this.x) {
            
            // Check if bird hits top pipe or bottom pipe
            if (birdBounds.y < this.gapY || 
                birdBounds.y + birdBounds.height > this.gapY + this.gapSize) {
                return true;
            }
        }
        
        return false;
    }

    hasPassedBird(bird) {
        if (!this.passed && this.x + this.width < bird.x) {
            this.passed = true;
            return true;
        }
        return false;
    }
}