// Particle System
class Particle {
    constructor(x, y, velocityX, velocityY, color, life, size = 2) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size;
        this.gravity = 0.2;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += this.gravity;
        this.life--;
    }

    isAlive() {
        return this.life > 0;
    }

    render(ctx, camera) {
        const alpha = this.life / this.maxLife;
        const screenX = Math.round(this.x - camera.x);
        const screenY = Math.round(this.y - camera.y);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX, screenY, this.size, this.size);
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    // Coin collect effect
    createCoinEffect(x, y) {
        const colors = ['#FFD700', '#FFA500', '#FFFF00'];
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = 1 + Math.random() * 2;
            this.particles.push(new Particle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 1,
                colors[Math.floor(Math.random() * colors.length)],
                30,
                2
            ));
        }
    }

    // Jump dust effect
    createJumpDust(x, y) {
        for (let i = 0; i < 4; i++) {
            this.particles.push(new Particle(
                x + Math.random() * 8,
                y,
                (Math.random() - 0.5) * 2,
                -Math.random() * 1,
                '#CCCCCC',
                15,
                2
            ));
        }
    }

    // Landing dust effect
    createLandingDust(x, y, width) {
        for (let i = 0; i < 6; i++) {
            this.particles.push(new Particle(
                x + Math.random() * width,
                y,
                (Math.random() - 0.5) * 3,
                -Math.random() * 2,
                '#CCCCCC',
                20,
                3
            ));
        }
    }

    // Death effect
    createDeathEffect(x, y) {
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            this.particles.push(new Particle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 2,
                '#FF0000',
                40,
                3
            ));
        }
    }

    // Enemy defeat effect
    createEnemyDefeatEffect(x, y, color = '#00FF00') {
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2;
            this.particles.push(new Particle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 1,
                color,
                30,
                2
            ));
        }
    }

    update() {
        this.particles = this.particles.filter(p => {
            p.update();
            return p.isAlive();
        });
    }

    render(ctx, camera) {
        this.particles.forEach(p => p.render(ctx, camera));
    }

    clear() {
        this.particles = [];
    }
}
