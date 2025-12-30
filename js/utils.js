// Game Constants
const GAME_CONFIG = {
    // Display
    NATIVE_WIDTH: 320,
    NATIVE_HEIGHT: 180,
    SCALE: 3,
    FPS: 60,

    // Physics (from PRD)
    TILE_SIZE: 16,
    GRAVITY: 32, // units/second²
    TERMINAL_VELOCITY: 16, // max fall speed

    // Player movement (tiles/second converted to pixels/frame)
    PLAYER: {
        RUN_SPEED: 6 * 16 / 60, // 6 tiles/sec
        SPRINT_SPEED: 8 * 16 / 60, // 8 tiles/sec
        AIR_SPEED: 5 * 16 / 60, // 5 tiles/sec
        JUMP_VELOCITY: -12, // initial jump velocity
        GRAVITY_RISE: 32 * 0.8 / 60, // 80% gravity when rising
        GRAVITY_FALL: 32 * 1.2 / 60, // 120% gravity when falling
        ACCELERATION: 0.15 * 60, // frames to reach max speed
        DECELERATION: 0.25 * 60, // frames to stop
        AIR_CONTROL: 0.75,
        COYOTE_TIME: 6, // frames (100ms at 60fps)
        JUMP_BUFFER: 9, // frames (150ms at 60fps)
        MAX_HEALTH: 3,
        INVINCIBILITY_TIME: 90, // frames (1.5s)
        WIDTH: 14,
        HEIGHT: 16
    }
};

// Utility Functions
const Utils = {
    /**
     * Clamp a value between min and max
     */
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation
     */
    lerp: (start, end, t) => {
        return start + (end - start) * t;
    },

    /**
     * Check AABB collision between two rectangles
     */
    checkCollision: (rect1, rect2) => {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },

    /**
     * Convert tile coordinates to pixel coordinates
     */
    tileToPixel: (tileX, tileY) => {
        return {
            x: tileX * GAME_CONFIG.TILE_SIZE,
            y: tileY * GAME_CONFIG.TILE_SIZE
        };
    },

    /**
     * Convert pixel coordinates to tile coordinates
     */
    pixelToTile: (pixelX, pixelY) => {
        return {
            x: Math.floor(pixelX / GAME_CONFIG.TILE_SIZE),
            y: Math.floor(pixelY / GAME_CONFIG.TILE_SIZE)
        };
    }
};
