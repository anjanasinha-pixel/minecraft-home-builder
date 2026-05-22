// Input System
class InputManager {
    constructor(player, camera) {
        this.player = player;
        this.camera = camera;
        this.keys = {};
        this.isGameActive = false;
        this.touchDrag = false;
        this.touchMoved = false;
        this.lastTouchX = 0;
        this.lastTouchY = 0;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;

        this.setupKeyboardControls();
        this.setupTouchControls();
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'KeyR', 'KeyF', 'Space', 'KeyP', 'KeyO'].includes(e.code)) {
                e.preventDefault();
            }

            if (!this.isGameActive) return;

            switch (e.code) {
                case 'Space':
                    this.player.jump();
                    break;
                case 'KeyP':
                    window.dispatchEvent(new CustomEvent('placeBlock'));
                    break;
                case 'KeyO':
                    window.dispatchEvent(new CustomEvent('removeBlock'));
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
        if (!canvas) return;

        // Tap / Double-tap only controls for mobile
        this._lastTapTime = 0;
        this._lastTapX = 0;
        this._lastTapY = 0;
        this._tapTimeout = null;

        // Single tap = place block (center) or toggle movement/look zones
        // Double tap = remove block
        canvas.addEventListener('touchend', (e) => {
            if (!this.isGameActive) return;
            const touch = e.changedTouches[0];
            const now = performance.now();
            const x = touch.clientX;
            const y = touch.clientY;
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;

            const sinceLast = now - (this._lastTapTime || 0);
            const dist = Math.hypot(x - (this._lastTapX || 0), y - (this._lastTapY || 0));

            // Double-tap detection
            if (sinceLast < 300 && dist < 40) {
                clearTimeout(this._tapTimeout);
                this._lastTapTime = 0;
                window.dispatchEvent(new CustomEvent('removeBlock'));
                return;
            }

            // Schedule single tap action (allow brief window for double-tap)
            this._lastTapTime = now;
            this._lastTapX = x; this._lastTapY = y;

            this._tapTimeout = setTimeout(() => {
                // Center tap places block
                const cxMin = w * 0.3, cxMax = w * 0.7;
                const cyMin = h * 0.3, cyMax = h * 0.7;
                if (x >= cxMin && x <= cxMax && y >= cyMin && y <= cyMax) {
                    window.dispatchEvent(new CustomEvent('placeBlock'));
                    return;
                }

                // Left half: tap quadrants to toggle movement (tap to start/stop)
                if (x < w * 0.5) {
                    if (y < h * 0.33) {
                        this.keys['KeyW'] = !this.keys['KeyW'];
                    } else if (y > h * 0.66) {
                        this.keys['KeyS'] = !this.keys['KeyS'];
                    } else if (x < w * 0.25) {
                        this.keys['KeyA'] = !this.keys['KeyA'];
                    } else {
                        this.keys['KeyD'] = !this.keys['KeyD'];
                    }
                } else {
                    // Right half: quick look controls by quadrant taps
                    if (y < h * 0.33) {
                        this.camera.rotatePitch(-0.12);
                    } else if (y > h * 0.66) {
                        this.camera.rotatePitch(0.12);
                    } else {
                        if (x > w * 0.75) this.camera.rotateYaw(-0.28);
                        else this.camera.rotateYaw(0.28);
                    }
                }
            }, 260);
        }, { passive: false });

        // Prevent page scrolling while interacting on mobile
        window.addEventListener('touchmove', (e) => {
            if (this.isGameActive) e.preventDefault();
        }, { passive: false });

        const buttons = document.querySelectorAll('.mobile-btn');
        buttons.forEach((button) => {
            const action = button.getAttribute('data-action');
            const handleActionStart = (e) => {
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
            };

            button.addEventListener('touchstart', handleActionStart, { passive: false });
            button.addEventListener('mousedown', handleActionStart);

            const resetMovementKey = () => {
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
            };

            button.addEventListener('touchend', (e) => {
                resetMovementKey();
                e.preventDefault();
            }, { passive: false });

            button.addEventListener('touchcancel', (e) => {
                resetMovementKey();
                e.preventDefault();
            }, { passive: false });

            button.addEventListener('mouseup', resetMovementKey);
            button.addEventListener('mouseleave', resetMovementKey);
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
