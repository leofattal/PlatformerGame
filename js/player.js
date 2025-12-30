// Player Character - Nova
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.PLAYER.WIDTH;
        this.height = GAME_CONFIG.PLAYER.HEIGHT;

        // Physics
        this.velocityX = 0;
        this.velocityY = 0;
        this.grounded = false;
        this.coyoteFrames = 0;
        this.jumpBufferFrames = 0;

        // State
        this.facingRight = true;
        this.health = GAME_CONFIG.PLAYER.MAX_HEALTH;
        this.lives = 3;
        this.invincibilityFrames = 0;

        // Abilities (will be unlocked)
        this.canDoubleJump = false;
        this.hasDoubleJumpAbility = false;
        this.canDash = false;

        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;

        // Spawn point
        this.spawnX = x;
        this.spawnY = y;
    }

    update(input, deltaTime) {
        // Handle invincibility
        if (this.invincibilityFrames > 0) {
            this.invincibilityFrames--;
        }

        // Get input
        const horizontalInput = input.getHorizontalAxis();
        const jumpPressed = input.isKeyPressed('jump');
        const jumpHeld = input.isKeyDown('jump');
        const sprintHeld = input.isKeyDown('sprint');

        // Update facing direction
        if (horizontalInput !== 0) {
            this.facingRight = horizontalInput > 0;
        }

        // Calculate target speed
        const maxSpeed = sprintHeld ?
            GAME_CONFIG.PLAYER.SPRINT_SPEED :
            GAME_CONFIG.PLAYER.RUN_SPEED;

        // Horizontal movement
        if (horizontalInput !== 0) {
            const acceleration = this.grounded ? 1.0 : GAME_CONFIG.PLAYER.AIR_CONTROL;
            this.velocityX += horizontalInput * (maxSpeed / GAME_CONFIG.PLAYER.ACCELERATION) * acceleration;

            // Clamp to max speed
            this.velocityX = Utils.clamp(this.velocityX, -maxSpeed, maxSpeed);
        } else {
            // Deceleration
            const deceleration = maxSpeed / GAME_CONFIG.PLAYER.DECELERATION;
            if (Math.abs(this.velocityX) < deceleration) {
                this.velocityX = 0;
            } else {
                this.velocityX -= Math.sign(this.velocityX) * deceleration;
            }
        }

        // Jump buffering
        if (jumpPressed) {
            this.jumpBufferFrames = GAME_CONFIG.PLAYER.JUMP_BUFFER;
        } else if (this.jumpBufferFrames > 0) {
            this.jumpBufferFrames--;
        }

        // Jump logic
        const canCoyoteJump = this.coyoteFrames > 0;
        if (this.jumpBufferFrames > 0 && (this.grounded || canCoyoteJump)) {
            this.jump();
            this.jumpBufferFrames = 0;
            this.coyoteFrames = 0;
        }

        // Variable jump height (release jump early for shorter jump)
        if (!jumpHeld && this.velocityY < 0) {
            this.velocityY *= 0.5;
        }

        // Update animation
        this.updateAnimation();
    }

    jump() {
        this.velocityY = GAME_CONFIG.PLAYER.JUMP_VELOCITY;
        this.grounded = false;
    }

    takeDamage(amount = 1) {
        if (this.invincibilityFrames > 0) return false;

        this.health -= amount;
        this.invincibilityFrames = GAME_CONFIG.PLAYER.INVINCIBILITY_TIME;

        // Knockback
        this.velocityY = GAME_CONFIG.PLAYER.JUMP_VELOCITY * 0.5;

        if (this.health <= 0) {
            this.die();
        }

        return true;
    }

    die() {
        this.lives--;
        if (this.lives > 0) {
            this.respawn();
        } else {
            // Game over
            console.log('Game Over');
        }
    }

    respawn() {
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = GAME_CONFIG.PLAYER.MAX_HEALTH;
        this.invincibilityFrames = GAME_CONFIG.PLAYER.INVINCIBILITY_TIME;
    }

    updateAnimation() {
        this.animationTimer++;
        if (this.animationTimer >= 8) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
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

    render(ctx, camera) {
        const screenX = Math.round(this.x - camera.x);
        const screenY = Math.round(this.y - camera.y);

        // Flashing effect when invincible
        if (this.invincibilityFrames > 0 && Math.floor(this.invincibilityFrames / 4) % 2 === 0) {
            return; // Skip rendering every other quarter second
        }

        // Draw player (simple rectangle for now)
        ctx.save();

        // Flip horizontally if facing left
        if (!this.facingRight) {
            ctx.scale(-1, 1);
            ctx.translate(-screenX * 2 - this.width, 0);
        }

        // Body (explorer outfit - teal/green)
        ctx.fillStyle = '#20B2AA';
        ctx.fillRect(screenX + 2, screenY + 6, this.width - 4, this.height - 6);

        // Head (skin tone)
        ctx.fillStyle = '#FFD4A3';
        ctx.fillRect(screenX + 3, screenY + 2, this.width - 6, 6);

        // Hat (brown explorer hat)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(screenX + 2, screenY, this.width - 4, 3);
        ctx.fillRect(screenX + 1, screenY + 1, this.width - 2, 2);

        // Eyes (simple dots)
        ctx.fillStyle = '#000000';
        ctx.fillRect(screenX + 4, screenY + 4, 2, 2);
        ctx.fillRect(screenX + this.width - 6, screenY + 4, 2, 2);

        // Backpack (darker brown)
        if (this.facingRight) {
            ctx.fillStyle = '#654321';
            ctx.fillRect(screenX + this.width - 4, screenY + 8, 3, 4);
        } else {
            ctx.fillStyle = '#654321';
            ctx.fillRect(screenX + 1, screenY + 8, 3, 4);
        }

        // Legs (simple animation)
        ctx.fillStyle = '#1E90FF';
        if (Math.abs(this.velocityX) > 0.5 && this.grounded) {
            const legOffset = this.animationFrame % 2 === 0 ? 1 : -1;
            ctx.fillRect(screenX + 3, screenY + this.height - 4, 3, 4);
            ctx.fillRect(screenX + this.width - 6 + legOffset, screenY + this.height - 4, 3, 4);
        } else {
            ctx.fillRect(screenX + 3, screenY + this.height - 4, 3, 4);
            ctx.fillRect(screenX + this.width - 6, screenY + this.height - 4, 3, 4);
        }

        ctx.restore();

        // Debug: Draw hitbox
        if (false) {
            ctx.strokeStyle = '#FF0000';
            ctx.strokeRect(screenX, screenY, this.width, this.height);
        }
    }
}
