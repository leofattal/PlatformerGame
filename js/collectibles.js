// Collectibles System
class Coin {
    constructor(x, y, type = 'small') {
        this.x = x;
        this.y = y;
        this.type = type; // 'small' or 'large'
        this.width = type === 'small' ? 8 : 12;
        this.height = type === 'small' ? 8 : 12;
        this.collected = false;
        this.value = type === 'small' ? 1 : 5;
        this.points = type === 'small' ? 10 : 50;

        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.bobOffset = 0;
        this.bobSpeed = 0.1;
    }

    update() {
        if (this.collected) return;

        // Bobbing animation
        this.bobOffset = Math.sin(this.bobSpeed * Date.now() * 0.01) * 2;

        // Spin animation
        this.animationTimer++;
        if (this.animationTimer >= 8) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
    }

    checkCollision(player) {
        if (this.collected) return false;

        const bounds = this.getBounds();
        const playerBounds = player.getBounds();

        if (Utils.checkCollision(bounds, playerBounds)) {
            this.collected = true;
            return true;
        }
        return false;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y + this.bobOffset,
            width: this.width,
            height: this.height
        };
    }

    render(ctx, camera) {
        if (this.collected) return;

        const screenX = Math.round(this.x - camera.x);
        const screenY = Math.round(this.y + this.bobOffset - camera.y);

        ctx.save();

        // Draw coin based on animation frame
        const size = this.width;
        const color = this.type === 'small' ? '#FFD700' : '#FFA500';
        const darkColor = this.type === 'small' ? '#DAA520' : '#FF8C00';

        // Spinning effect - vary width based on frame
        const widthScale = [1, 0.7, 0.3, 0.7][this.animationFrame];
        const drawWidth = size * widthScale;
        const offsetX = (size - drawWidth) / 2;

        // Main coin body
        ctx.fillStyle = color;
        ctx.fillRect(screenX + offsetX, screenY, drawWidth, size);

        // Shine effect
        if (widthScale > 0.5) {
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(screenX + offsetX + 1, screenY + 1, Math.max(1, drawWidth - 2), 2);
        }

        // Border
        ctx.strokeStyle = darkColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX + offsetX, screenY, drawWidth, size);

        ctx.restore();
    }
}

class CollectibleManager {
    constructor() {
        this.coins = [];
    }

    addCoin(x, y, type = 'small') {
        this.coins.push(new Coin(x, y, type));
    }

    update() {
        this.coins.forEach(coin => coin.update());
    }

    checkCollisions(player) {
        let coinsCollected = 0;
        let pointsEarned = 0;

        this.coins.forEach(coin => {
            if (coin.checkCollision(player)) {
                coinsCollected += coin.value;
                pointsEarned += coin.points;
            }
        });

        return { coins: coinsCollected, points: pointsEarned };
    }

    render(ctx, camera) {
        this.coins.forEach(coin => coin.render(ctx, camera));
    }

    reset() {
        this.coins.forEach(coin => coin.collected = false);
    }

    clear() {
        this.coins = [];
    }
}
