// Main Entry Point
(function() {
    'use strict';

    // Wait for DOM to be ready
    window.addEventListener('DOMContentLoaded', () => {
        initGame();
    });

    function initGame() {
        console.log('Adventure Quest - Initializing...');

        // Get canvas
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            console.error('Canvas element not found!');
            return;
        }

        // Set canvas size to native resolution
        canvas.width = GAME_CONFIG.NATIVE_WIDTH;
        canvas.height = GAME_CONFIG.NATIVE_HEIGHT;

        // Apply CSS scaling for display
        canvas.style.width = (GAME_CONFIG.NATIVE_WIDTH * GAME_CONFIG.SCALE) + 'px';
        canvas.style.height = (GAME_CONFIG.NATIVE_HEIGHT * GAME_CONFIG.SCALE) + 'px';

        // Create and start game
        const game = new Game(canvas);
        game.start();

        console.log('Adventure Quest - Started!');
        console.log(`Canvas: ${canvas.width}x${canvas.height} (scaled ${GAME_CONFIG.SCALE}x)`);
        console.log('Controls: Arrow Keys/WASD to move, SPACE to jump, SHIFT to sprint');
    }
})();
