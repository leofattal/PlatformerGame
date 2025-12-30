// Physics and Collision System
class PhysicsEngine {
    constructor(level) {
        this.level = level;
    }

    /**
     * Apply gravity to an entity
     */
    applyGravity(entity, deltaTime) {
        // Use different gravity multipliers for rising vs falling (from PRD)
        const gravityMultiplier = entity.velocityY < 0 ?
            GAME_CONFIG.PLAYER.GRAVITY_RISE :
            GAME_CONFIG.PLAYER.GRAVITY_FALL;

        entity.velocityY += gravityMultiplier;

        // Apply terminal velocity
        if (entity.velocityY > GAME_CONFIG.TERMINAL_VELOCITY) {
            entity.velocityY = GAME_CONFIG.TERMINAL_VELOCITY;
        }
    }

    /**
     * Move entity and handle collisions
     */
    moveEntity(entity, deltaTime) {
        // Store previous grounded state
        const wasGrounded = entity.grounded;
        entity.grounded = false;

        // Move horizontally and check collisions
        entity.x += entity.velocityX;
        this.checkHorizontalCollisions(entity);

        // Move vertically and check collisions
        entity.y += entity.velocityY;
        this.checkVerticalCollisions(entity);

        // Update coyote time
        if (!entity.grounded && wasGrounded) {
            entity.coyoteFrames = GAME_CONFIG.PLAYER.COYOTE_TIME;
        } else if (entity.grounded) {
            entity.coyoteFrames = 0;
        } else if (entity.coyoteFrames > 0) {
            entity.coyoteFrames--;
        }
    }

    /**
     * Check horizontal collisions with tiles
     */
    checkHorizontalCollisions(entity) {
        const bounds = entity.getBounds();

        // Get tile range to check
        const startY = Math.floor(bounds.y / GAME_CONFIG.TILE_SIZE);
        const endY = Math.floor((bounds.y + bounds.height - 1) / GAME_CONFIG.TILE_SIZE);

        if (entity.velocityX > 0) {
            // Moving right
            const tileX = Math.floor((bounds.x + bounds.width) / GAME_CONFIG.TILE_SIZE);

            for (let tileY = startY; tileY <= endY; tileY++) {
                if (this.level.isSolidTile(tileX, tileY)) {
                    entity.x = tileX * GAME_CONFIG.TILE_SIZE - entity.width;
                    entity.velocityX = 0;
                    break;
                }
            }
        } else if (entity.velocityX < 0) {
            // Moving left
            const tileX = Math.floor(bounds.x / GAME_CONFIG.TILE_SIZE);

            for (let tileY = startY; tileY <= endY; tileY++) {
                if (this.level.isSolidTile(tileX, tileY)) {
                    entity.x = (tileX + 1) * GAME_CONFIG.TILE_SIZE;
                    entity.velocityX = 0;
                    break;
                }
            }
        }
    }

    /**
     * Check vertical collisions with tiles
     */
    checkVerticalCollisions(entity) {
        const bounds = entity.getBounds();

        // Get tile range to check
        const startX = Math.floor(bounds.x / GAME_CONFIG.TILE_SIZE);
        const endX = Math.floor((bounds.x + bounds.width - 1) / GAME_CONFIG.TILE_SIZE);

        if (entity.velocityY > 0) {
            // Moving down (falling)
            const tileY = Math.floor((bounds.y + bounds.height) / GAME_CONFIG.TILE_SIZE);

            for (let tileX = startX; tileX <= endX; tileX++) {
                if (this.level.isSolidTile(tileX, tileY)) {
                    entity.y = tileY * GAME_CONFIG.TILE_SIZE - entity.height;
                    entity.velocityY = 0;
                    entity.grounded = true;
                    entity.canDoubleJump = true;
                    break;
                }
            }
        } else if (entity.velocityY < 0) {
            // Moving up (jumping)
            const tileY = Math.floor(bounds.y / GAME_CONFIG.TILE_SIZE);

            for (let tileX = startX; tileX <= endX; tileX++) {
                if (this.level.isSolidTile(tileX, tileY)) {
                    entity.y = (tileY + 1) * GAME_CONFIG.TILE_SIZE;
                    entity.velocityY = 0;
                    break;
                }
            }
        }
    }

    /**
     * Check if entity is out of bounds (fell off level)
     */
    checkOutOfBounds(entity) {
        const bounds = entity.getBounds();

        // Fell below level
        if (bounds.y > this.level.heightInPixels) {
            return true;
        }

        return false;
    }
}
