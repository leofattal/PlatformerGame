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
        this.gameOver = false;
        this.levelComplete = false;

        // Initialize systems
        this.input = new InputManager();
        this.audio = new AudioSystem();
        this.level = new Level(TestLevel);
        this.physics = new PhysicsEngine(this.level);
        this.particles = new ParticleSystem();
        this.collectibles = new CollectibleManager();
        this.enemies = new EnemyManager(this.physics);

        // Camera
        this.camera = {
            x: 0,
            y: 0,
            width: GAME_CONFIG.NATIVE_WIDTH,
            height: GAME_CONFIG.NATIVE_HEIGHT
        };

        // Create player at spawn point
        this.player = new Player(32, 160);

        // Track previous state for effects
        this.wasGrounded = false;
        this.wasJumping = false;

        // HUD data
        this.coins = 0;
        this.score = 0;
        this.coinsToNextLife = 100;

        // Timing
        this.lastFrameTime = performance.now();
        this.deltaTime = 0;
        this.frameCount = 0;

        // Initialize level collectibles and enemies
        this.initializeLevel();
    }

    initializeLevel() {
        // Add coins from level data
        if (this.level.coins) {
            this.level.coins.forEach(coin => {
                this.collectibles.addCoin(coin.x, coin.y, coin.type);
            });
        }

        // Add enemies from level data
        if (this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                this.enemies.addEnemy(enemy.x, enemy.y, enemy.type);
            });
        }
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
            if (this.audio) this.audio.playPause();
        }

        if (this.paused) return;

        // Handle restart
        if (this.input.isKeyDown('restart')) {
            this.restart();
            return;
        }

        // Game over or level complete state
        if (this.gameOver || this.levelComplete) {
            if (this.input.isKeyPressed('jump') || this.input.isKeyPressed('action')) {
                this.restart();
            }
            return;
        }

        // Store previous state
        this.wasGrounded = this.player.grounded;

        // Update player
        this.player.update(this.input, deltaTime);

        // Check for jump
        if (this.input.isKeyPressed('jump') && !this.wasJumping && this.player.velocityY < 0) {
            this.audio.playJump();
            this.particles.createJumpDust(this.player.x, this.player.y + this.player.height);
            this.wasJumping = true;
        }
        if (this.player.grounded) {
            this.wasJumping = false;
        }

        // Apply physics
        this.physics.applyGravity(this.player, deltaTime);
        this.physics.moveEntity(this.player, deltaTime);

        // Landing effect
        if (this.player.grounded && !this.wasGrounded && this.player.velocityY >= 0) {
            this.audio.playLand();
            this.particles.createLandingDust(this.player.x, this.player.y + this.player.height, this.player.width);
        }

        // Check if player fell off level
        if (this.physics.checkOutOfBounds(this.player)) {
            this.handlePlayerDeath();
        }

        // Update collectibles
        this.collectibles.update();
        const collected = this.collectibles.checkCollisions(this.player);
        if (collected.coins > 0) {
            this.coins += collected.coins;
            this.score += collected.points;
            this.audio.playCoinCollect();

            // Create particle effect
            this.particles.createCoinEffect(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height / 2
            );

            // Check for 1-up
            if (this.coins >= this.coinsToNextLife) {
                this.player.lives++;
                this.coinsToNextLife += 100;
                this.audio.play1Up();
            }
        }

        // Update enemies
        this.enemies.update(this.level);
        const enemyCollision = this.enemies.checkPlayerCollision(this.player);

        if (enemyCollision.damaged && this.player.invincibilityFrames === 0) {
            const damaged = this.player.takeDamage();
            if (damaged) {
                this.audio.playDamage();
                this.player.velocityX = enemyCollision.knockbackDirection * 3;

                if (this.player.health <= 0) {
                    this.handlePlayerDeath();
                }
            }
        }

        if (enemyCollision.enemyDefeated) {
            this.score += enemyCollision.points;
            this.audio.playEnemyDefeat();
            this.particles.createEnemyDefeatEffect(enemyCollision.enemyX, enemyCollision.enemyY);
        }

        // Update particles
        this.particles.update();

        // Update camera to follow player
        this.updateCamera();
    }

    handlePlayerDeath() {
        this.audio.playDeath();
        this.particles.createDeathEffect(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2
        );

        this.player.die();

        if (this.player.lives <= 0) {
            this.gameOver = true;
        } else {
            // Respawn after a delay
            setTimeout(() => {
                this.player.respawn();
                this.particles.clear();
            }, 1000);
        }
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

        // Render collectibles
        this.collectibles.render(this.ctx, this.camera);

        // Render enemies
        this.enemies.render(this.ctx, this.camera);

        // Render particles
        this.particles.render(this.ctx, this.camera);

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

        // Render game over screen
        if (this.gameOver) {
            this.renderGameOverScreen();
        }

        // Render level complete screen
        if (this.levelComplete) {
            this.renderLevelCompleteScreen();
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

    renderGameOverScreen() {
        const ctx = this.ctx;
        ctx.save();

        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, GAME_CONFIG.NATIVE_WIDTH, GAME_CONFIG.NATIVE_HEIGHT);

        // Game Over text
        ctx.fillStyle = '#FF0000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAME OVER', GAME_CONFIG.NATIVE_WIDTH / 2, GAME_CONFIG.NATIVE_HEIGHT / 2 - 20);

        // Stats
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px Arial';
        ctx.fillText(`Final Score: ${this.score}`, GAME_CONFIG.NATIVE_WIDTH / 2, GAME_CONFIG.NATIVE_HEIGHT / 2 + 10);
        ctx.fillText(`Coins: ${this.coins}`, GAME_CONFIG.NATIVE_WIDTH / 2, GAME_CONFIG.NATIVE_HEIGHT / 2 + 25);

        // Restart prompt
        ctx.fillText('Press R to restart', GAME_CONFIG.NATIVE_WIDTH / 2, GAME_CONFIG.NATIVE_HEIGHT / 2 + 45);

        ctx.restore();
    }

    renderLevelCompleteScreen() {
        const ctx = this.ctx;
        ctx.save();

        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, GAME_CONFIG.NATIVE_WIDTH, GAME_CONFIG.NATIVE_HEIGHT);

        // Level Complete text
        ctx.fillStyle = '#00FF00';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LEVEL COMPLETE!', GAME_CONFIG.NATIVE_WIDTH / 2, GAME_CONFIG.NATIVE_HEIGHT / 2 - 20);

        // Stats
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px Arial';
        ctx.fillText(`Score: ${this.score}`, GAME_CONFIG.NATIVE_WIDTH / 2, GAME_CONFIG.NATIVE_HEIGHT / 2 + 10);
        ctx.fillText(`Coins: ${this.coins}`, GAME_CONFIG.NATIVE_WIDTH / 2, GAME_CONFIG.NATIVE_HEIGHT / 2 + 25);

        ctx.restore();
    }

    restart() {
        // Reset player
        this.player.respawn();
        this.player.lives = 3;
        this.player.health = GAME_CONFIG.PLAYER.MAX_HEALTH;

        // Reset game state
        this.coins = 0;
        this.score = 0;
        this.coinsToNextLife = 100;
        this.gameOver = false;
        this.levelComplete = false;

        // Reset systems
        this.collectibles.reset();
        this.enemies.reset();
        this.particles.clear();
    }
}
