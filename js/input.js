// Input System
class InputManager {
    constructor(player) {
        this.player = player;
        this.keys = {};
        this.isGameActive = false;

        this.setupKeyboardControls();
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            if (!this.isGameActive) return;

            switch (e.code) {
                case 'Space':
                    this.player.jump();
                    e.preventDefault();
                    break;
                case 'KeyE':
                    // Rotate view or interact
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mouse controls
        document.addEventListener('mousedown', (e) => {
            if (!this.isGameActive) return;

            if (e.button === 0) {
                // Left click - place block
                window.dispatchEvent(new CustomEvent('placeBlock'));
            } else if (e.button === 2) {
                // Right click - remove block
                window.dispatchEvent(new CustomEvent('removeBlock'));
                e.preventDefault();
            }
        });

        // Prevent context menu on right click
        document.addEventListener('contextmenu', (e) => {
            if (this.isGameActive) {
                e.preventDefault();
            }
        });
    }

    update() {
        // Forward/Backward
        this.player.moveForward = this.keys['KeyW'] || this.keys['ArrowUp'];
        this.player.moveBackward = this.keys['KeyS'] || this.keys['ArrowDown'];

        // Left/Right
        this.player.moveLeft = this.keys['KeyA'] || this.keys['ArrowLeft'];
        this.player.moveRight = this.keys['KeyD'] || this.keys['ArrowRight'];
    }

    activateGame() {
        this.isGameActive = true;
    }

    deactivateGame() {
        this.isGameActive = false;
    }

    resetInput() {
        this.player.moveForward = false;
        this.player.moveBackward = false;
        this.player.moveLeft = false;
        this.player.moveRight = false;
    }
}
