class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.velocity = 0;
        this.gravity = 0.4;
        this.jumpStrength = -6;
        this.rotation = 0;
    }

    update() {
        // Apply gravity
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Update rotation based on velocity for visual effect
        this.rotation = Math.min(Math.max(this.velocity * 3, -30), 90);

        // Prevent bird from going above the canvas
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }

    jump() {
        this.velocity = this.jumpStrength;
    }

    draw(ctx) {
        ctx.save();
        
        // Move to bird position and rotate
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        // Draw bird body (yellow circle)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bird outline
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(5, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw beak
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.moveTo(this.width / 2 - 5, 0);
        ctx.lineTo(this.width / 2 + 5, -2);
        ctx.lineTo(this.width / 2 + 5, 2);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
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