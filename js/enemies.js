// Enemy System
class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.velocityX = 0;
        this.velocityY = 0;
        this.grounded = false;
        this.defeated = false;
        this.animationFrame = 0;
        this.animationTimer = 0;
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

// Bounce Blob - Simple patrol enemy
class BounceBlob extends Enemy {
    constructor(x, y) {
        super(x, y, 'bounceBlob');
        this.width = 14;
        this.height = 12;
        this.velocityX = 0.5;
        this.direction = 1;
        this.patrolDistance = 64; // 4 tiles
        this.startX = x;
        this.canBeJumpedOn = true;
    }

    update(level) {
        if (this.defeated) return;

        // Simple patrol AI
        if (Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.direction *= -1;
        }
        this.velocityX = this.direction * 0.5;

        // Animation
        this.animationTimer++;
        if (this.animationTimer >= 15) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 2;
        }
    }

    render(ctx, camera) {
        if (this.defeated) return;

        const screenX = Math.round(this.x - camera.x);
        const screenY = Math.round(this.y - camera.y);

        ctx.save();

        // Body (green blob)
        ctx.fillStyle = '#7EC850';

        // Squish animation
        const squish = this.animationFrame === 0 ? 0 : 2;
        ctx.fillRect(screenX, screenY + squish, this.width, this.height - squish);

        // Eyes
        ctx.fillStyle = '#000000';
        const eyeY = screenY + 3 + squish;
        if (this.direction > 0) {
            ctx.fillRect(screenX + 8, eyeY, 2, 2);
            ctx.fillRect(screenX + 11, eyeY, 2, 2);
        } else {
            ctx.fillRect(screenX + 1, eyeY, 2, 2);
            ctx.fillRect(screenX + 4, eyeY, 2, 2);
        }

        // Highlight
        ctx.fillStyle = '#A0FF80';
        ctx.fillRect(screenX + 2, screenY + 1 + squish, 3, 2);

        ctx.restore();
    }

    takeDamage() {
        this.defeated = true;
        return 100; // Points for defeating
    }
}

// Spike Shell - Cannot be jumped on
class SpikeShell extends Enemy {
    constructor(x, y) {
        super(x, y, 'spikeShell');
        this.width = 14;
        this.height = 12;
        this.velocityX = 0.3;
        this.direction = 1;
        this.patrolDistance = 48; // 3 tiles
        this.startX = x;
        this.canBeJumpedOn = false;
    }

    update(level) {
        if (this.defeated) return;

        // Patrol AI
        if (Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.direction *= -1;
        }
        this.velocityX = this.direction * 0.3;

        // Animation
        this.animationTimer++;
        if (this.animationTimer >= 10) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
    }

    render(ctx, camera) {
        if (this.defeated) return;

        const screenX = Math.round(this.x - camera.x);
        const screenY = Math.round(this.y - camera.y);

        ctx.save();

        // Shell body (red)
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(screenX + 1, screenY + 2, this.width - 2, this.height - 2);

        // Spikes
        ctx.fillStyle = '#8B0000';
        const spikePositions = [2, 5, 8, 11];
        spikePositions.forEach(pos => {
            ctx.fillRect(screenX + pos, screenY, 2, 3);
        });

        // Shell pattern
        ctx.fillStyle = '#A52A2A';
        ctx.fillRect(screenX + 3, screenY + 4, 3, 3);
        ctx.fillRect(screenX + 8, screenY + 4, 3, 3);

        ctx.restore();
    }

    takeDamage() {
        // Cannot be defeated by jumping
        return 0;
    }
}

class EnemyManager {
    constructor(physics) {
        this.enemies = [];
        this.physics = physics;
    }

    addEnemy(x, y, type) {
        switch (type) {
            case 'bounceBlob':
                this.enemies.push(new BounceBlob(x, y));
                break;
            case 'spikeShell':
                this.enemies.push(new SpikeShell(x, y));
                break;
        }
    }

    update(level) {
        this.enemies.forEach(enemy => {
            if (!enemy.defeated) {
                enemy.update(level);

                // Apply physics to enemies
                this.physics.applyGravity(enemy);
                this.physics.moveEntity(enemy);
            }
        });
    }

    checkPlayerCollision(player) {
        let result = {
            damaged: false,
            enemyDefeated: false,
            points: 0
        };

        this.enemies.forEach(enemy => {
            if (enemy.defeated) return;

            const playerBounds = player.getBounds();
            const enemyBounds = enemy.getBounds();

            if (Utils.checkCollision(playerBounds, enemyBounds)) {
                // Check if player is jumping on enemy from above
                const playerBottom = playerBounds.y + playerBounds.height;
                const enemyTop = enemyBounds.y + 4; // Small margin

                if (player.velocityY > 0 && playerBottom <= enemyTop && enemy.canBeJumpedOn) {
                    // Player defeats enemy
                    result.enemyDefeated = true;
                    result.points = enemy.takeDamage();
                    result.enemyX = enemy.x + enemy.width / 2;
                    result.enemyY = enemy.y + enemy.height / 2;

                    // Bounce player
                    player.velocityY = GAME_CONFIG.PLAYER.JUMP_VELOCITY * 0.5;
                } else {
                    // Player takes damage
                    result.damaged = true;
                    result.knockbackDirection = player.x < enemy.x ? -1 : 1;
                }
            }
        });

        return result;
    }

    render(ctx, camera) {
        this.enemies.forEach(enemy => enemy.render(ctx, camera));
    }

    reset() {
        this.enemies.forEach(enemy => enemy.defeated = false);
    }

    clear() {
        this.enemies = [];
    }
}
