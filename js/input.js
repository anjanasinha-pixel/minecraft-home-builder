// Input System
class InputManager {
    constructor(player, camera) {
        this.player = player;
        this.camera = camera;
        this.keys = {};
        this.isGameActive = false;
        this.touchDrag = false;
        this.lastTouchX = 0;
        this.lastTouchY = 0;

        this.setupKeyboardControls();
        this.setupTouchControls();
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
                case 'KeyP':
                    window.dispatchEvent(new CustomEvent('placeBlock'));
                    e.preventDefault();
                    break;
                case 'KeyO':
                    window.dispatchEvent(new CustomEvent('removeBlock'));
                    e.preventDefault();
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

    setupTouchControls() {
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.addEventListener('touchstart', (e) => {
                if (!this.isGameActive) return;
                const touch = e.touches[0];
                this.touchDrag = true;
                this.lastTouchX = touch.clientX;
                this.lastTouchY = touch.clientY;
                e.preventDefault();
            }, { passive: false });

            canvas.addEventListener('touchmove', (e) => {
                if (!this.isGameActive || !this.touchDrag || !this.camera) return;
                const touch = e.touches[0];
                const deltaX = touch.clientX - this.lastTouchX;
                const deltaY = touch.clientY - this.lastTouchY;
                this.camera.rotateYaw(-deltaX * 0.003);
                this.camera.rotatePitch(-deltaY * 0.003);
                this.lastTouchX = touch.clientX;
                this.lastTouchY = touch.clientY;
                e.preventDefault();
            }, { passive: false });

            canvas.addEventListener('touchend', () => {
                this.touchDrag = false;
            });
        }

        const buttons = document.querySelectorAll('.mobile-btn');
        buttons.forEach((button) => {
            const action = button.getAttribute('data-action');
            button.addEventListener('touchstart', (e) => {
                if (!this.isGameActive) return;
                switch (action) {
                    case 'move-forward':
                        this.keys['KeyW'] = true;
                        break;
                    case 'move-backward':
                        this.keys['KeyS'] = true;
                        break;
                    case 'move-left':
                        this.keys['KeyA'] = true;
                        break;
                    case 'move-right':
                        this.keys['KeyD'] = true;
                        break;
                    case 'place-block':
                        window.dispatchEvent(new CustomEvent('placeBlock'));
                        break;
                    case 'remove-block':
                        window.dispatchEvent(new CustomEvent('removeBlock'));
                        break;
                    case 'jump':
                        this.player.jump();
                        break;
                    case 'prev-block':
                        this.cycleBlock(-1);
                        break;
                    case 'next-block':
                        this.cycleBlock(1);
                        break;
                    case 'switch-player':
                        window.dispatchEvent(new CustomEvent('switchPlayerTouch'));
                        break;
                }
                e.preventDefault();
            }, { passive: false });

            button.addEventListener('touchend', () => {
                switch (action) {
                    case 'move-forward':
                        this.keys['KeyW'] = false;
                        break;
                    case 'move-backward':
                        this.keys['KeyS'] = false;
                        break;
                    case 'move-left':
                        this.keys['KeyA'] = false;
                        break;
                    case 'move-right':
                        this.keys['KeyD'] = false;
                        break;
                }
            });
        });
    }

    update() {
        // Forward/Backward
        this.player.moveForward = this.keys['KeyW'] || this.keys['ArrowUp'];
        this.player.moveBackward = this.keys['KeyS'] || this.keys['ArrowDown'];

        // Left/Right
        this.player.moveLeft = this.keys['KeyA'] || this.keys['ArrowLeft'];
        this.player.moveRight = this.keys['KeyD'] || this.keys['ArrowRight'];

        // Camera rotation when no mouse is available
        if (this.camera) {
            if (this.keys['KeyQ']) {
                this.camera.rotateYaw(0.04);
            }
            if (this.keys['KeyE']) {
                this.camera.rotateYaw(-0.04);
            }
            if (this.keys['KeyR']) {
                this.camera.rotatePitch(0.03);
            }
            if (this.keys['KeyF']) {
                this.camera.rotatePitch(-0.03);
            }
        }
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

    cycleBlock(direction) {
        const blockOrder = ['dirt', 'grass', 'wood', 'stone', 'sand', 'brick'];
        const currentBlock = this.player.selectedBlockType || 'dirt';
        const currentIndex = blockOrder.indexOf(currentBlock);
        const newIndex = (currentIndex + direction + blockOrder.length) % blockOrder.length;
        const newBlock = blockOrder[newIndex];
        window.dispatchEvent(new CustomEvent('selectBlock', { detail: { type: newBlock } }));
    }
}
