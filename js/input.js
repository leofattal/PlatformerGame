// Input Manager
class InputManager {
    constructor() {
        this.keys = {};
        this.keysPressed = {};
        this.keysReleased = {};

        // Key mappings
        this.keyMap = {
            // Movement
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'ArrowDown': 'down',
            'KeyA': 'left',
            'KeyD': 'right',
            'KeyS': 'down',

            // Jump
            'Space': 'jump',
            'ArrowUp': 'jump',
            'KeyW': 'jump',

            // Sprint
            'ShiftLeft': 'sprint',
            'ShiftRight': 'sprint',

            // Actions
            'KeyZ': 'action',
            'KeyJ': 'action',

            // Dash
            'KeyX': 'dash',
            'KeyK': 'dash',

            // Pause
            'Escape': 'pause',
            'KeyP': 'pause',

            // Restart
            'KeyR': 'restart'
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            const action = this.keyMap[e.code];
            if (action) {
                e.preventDefault();
                if (!this.keys[action]) {
                    this.keysPressed[action] = true;
                }
                this.keys[action] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            const action = this.keyMap[e.code];
            if (action) {
                e.preventDefault();
                this.keys[action] = false;
                this.keysReleased[action] = true;
            }
        });

        // Prevent context menu on right click for future mouse support
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Check if key is currently held down
    isKeyDown(action) {
        return this.keys[action] || false;
    }

    // Check if key was just pressed this frame
    isKeyPressed(action) {
        return this.keysPressed[action] || false;
    }

    // Check if key was just released this frame
    isKeyReleased(action) {
        return this.keysReleased[action] || false;
    }

    // Get horizontal movement input (-1, 0, or 1)
    getHorizontalAxis() {
        let axis = 0;
        if (this.isKeyDown('left')) axis -= 1;
        if (this.isKeyDown('right')) axis += 1;
        return axis;
    }

    // Clear one-frame input states (call at end of game loop)
    clearFrameInputs() {
        this.keysPressed = {};
        this.keysReleased = {};
    }
}
