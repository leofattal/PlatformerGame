// Main Game Class
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Disable image smoothing for pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;

        // Game state
        this.running = false;
        this.paused = false;

        // Initialize systems
        this.input = new InputManager();
        this.level = new Level(TestLevel);
        this.physics = new PhysicsEngine(this.level);

        // Camera
        this.camera = {
            x: 0,
            y: 0,
            width: GAME_CONFIG.NATIVE_WIDTH,
            height: GAME_CONFIG.NATIVE_HEIGHT
        };

        // Create player at spawn point
        this.player = new Player(32, 160);

        // HUD data
        this.coins = 0;
        this.score = 0;

        // Timing
        this.lastFrameTime = performance.now();
        this.deltaTime = 0;
        this.frameCount = 0;
    }

    start() {
        this.running = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.running) return;

        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        // Update
        this.update(this.deltaTime);

        // Render
        this.render();

        // Clear frame inputs
        this.input.clearFrameInputs();

        // Next frame
        this.frameCount++;
        requestAnimationFrame(() => this.gameLoop());
    }

    update(deltaTime) {
        // Handle pause
        if (this.input.isKeyPressed('pause')) {
            this.paused = !this.paused;
        }

        if (this.paused) return;

        // Handle restart
        if (this.input.isKeyDown('restart')) {
            this.restart();
            return;
        }

        // Update player
        this.player.update(this.input, deltaTime);

        // Apply physics
        this.physics.applyGravity(this.player, deltaTime);
        this.physics.moveEntity(this.player, deltaTime);

        // Check if player fell off level
        if (this.physics.checkOutOfBounds(this.player)) {
            this.player.die();
        }

        // Update camera to follow player
        this.updateCamera();
    }

    updateCamera() {
        // Center camera on player with some lead
        const targetX = this.player.x - this.camera.width / 2 + this.player.width / 2;
        const targetY = this.player.y - this.camera.height / 2 + this.player.height / 2;

        // Smooth camera movement
        this.camera.x = Utils.lerp(this.camera.x, targetX, 0.1);
        this.camera.y = Utils.lerp(this.camera.y, targetY, 0.1);

        // Clamp camera to level bounds
        this.camera.x = Utils.clamp(this.camera.x, 0, this.level.widthInPixels - this.camera.width);
        this.camera.y = Utils.clamp(this.camera.y, 0, this.level.heightInPixels - this.camera.height);
    }

    render() {
        // Clear screen
        this.ctx.fillStyle = '#87CEEB'; // Sky blue
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Save context
        this.ctx.save();

        // Render level
        this.level.render(this.ctx, this.camera);

        // Render player
        this.player.render(this.ctx, this.camera);

        // Restore context
        this.ctx.restore();

        // Render HUD
        this.renderHUD();

        // Render pause screen
        if (this.paused) {
            this.renderPauseScreen();
        }
    }

    renderHUD() {
        const ctx = this.ctx;
        ctx.save();

        // HUD background (semi-transparent)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, GAME_CONFIG.NATIVE_WIDTH, 20);

        // Text settings
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px Arial';
        ctx.textBaseline = 'top';

        // Coins
        ctx.fillText(`Coins: ${this.coins}`, 4, 4);

        // Score
        ctx.fillText(`Score: ${this.score}`, 80, 4);

        // Lives
        ctx.fillText(`Lives: ${this.player.lives}`, 160, 4);

        // Health hearts
        const heartX = 220;
        const heartY = 4;
        for (let i = 0; i < GAME_CONFIG.PLAYER.MAX_HEALTH; i++) {
            if (i < this.player.health) {
                ctx.fillStyle = '#FF0000';
            } else {
                ctx.fillStyle = '#666666';
            }
            ctx.fillRect(heartX + i * 10, heartY, 8, 8);
        }

        ctx.restore();
    }

    renderPauseScreen() {
        const ctx = this.ctx;
        ctx.save();

        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, GAME_CONFIG.NATIVE_WIDTH, GAME_CONFIG.NATIVE_HEIGHT);

        // Pause text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PAUSED', GAME_CONFIG.NATIVE_WIDTH / 2, GAME_CONFIG.NATIVE_HEIGHT / 2 - 10);

        ctx.font = '8px Arial';
        ctx.fillText('Press ESC to resume', GAME_CONFIG.NATIVE_WIDTH / 2, GAME_CONFIG.NATIVE_HEIGHT / 2 + 10);

        ctx.restore();
    }

    restart() {
        // Reset player
        this.player.respawn();
        this.coins = 0;
        this.score = 0;
    }
}
