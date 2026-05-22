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
        if (canvas) {
            this.activeTouches = new Map();

            const setMovementKeys = (moveX, moveY) => {
                const threshold = 12;
                this.keys['KeyW'] = moveY < -threshold;
                this.keys['KeyS'] = moveY > threshold;
                this.keys['KeyA'] = moveX < -threshold;
                this.keys['KeyD'] = moveX > threshold;
            };

            const resetMovementKeys = () => {
                this.keys['KeyW'] = false;
                this.keys['KeyS'] = false;
                this.keys['KeyA'] = false;
                this.keys['KeyD'] = false;
            };

            const releaseTouch = (touch) => {
                const touchData = this.activeTouches.get(touch.identifier);
                if (!touchData) return;

                if (touchData.type === 'look') {
                    const distance = Math.hypot(touch.clientX - touchData.startX, touch.clientY - touchData.startY);
                    const duration = performance.now() - touchData.startTime;
                    if (!touchData.moved && duration < 350 && distance < 12) {
                        window.dispatchEvent(new CustomEvent('placeBlock'));
                    }
                } else {
                    resetMovementKeys();
                }

                this.activeTouches.delete(touch.identifier);
            };

            canvas.addEventListener('touchstart', (e) => {
                if (!this.isGameActive) return;
                for (const touch of Array.from(e.changedTouches)) {
                    this.activeTouches.set(touch.identifier, {
                        id: touch.identifier,
                        startX: touch.clientX,
                        startY: touch.clientY,
                        lastX: touch.clientX,
                        lastY: touch.clientY,
                        startTime: performance.now(),
                        type: touch.clientX <= canvas.clientWidth * 0.5 ? 'move' : 'look',
                        moved: false
                    });
                }
                e.preventDefault();
            }, { passive: false });

            canvas.addEventListener('touchmove', (e) => {
                if (!this.isGameActive || !this.camera) return;
                for (const touch of Array.from(e.changedTouches)) {
                    const touchData = this.activeTouches.get(touch.identifier);
                    if (!touchData) continue;

                    const deltaX = touch.clientX - touchData.lastX;
                    const deltaY = touch.clientY - touchData.lastY;
                    const distance = Math.hypot(touch.clientX - touchData.startX, touch.clientY - touchData.startY);
                    if (distance > 8) {
                        touchData.moved = true;
                    }

                    if (touchData.type === 'look') {
                        this.camera.rotateYaw(-deltaX * 0.008);
                        this.camera.rotatePitch(-deltaY * 0.006);
                    } else {
                        const moveX = touch.clientX - touchData.startX;
                        const moveY = touch.clientY - touchData.startY;
                        setMovementKeys(moveX, moveY);
                    }

                    touchData.lastX = touch.clientX;
                    touchData.lastY = touch.clientY;
                    this.activeTouches.set(touch.identifier, touchData);
                }
                e.preventDefault();
            }, { passive: false });

            canvas.addEventListener('touchend', (e) => {
                if (!this.isGameActive) return;
                for (const touch of Array.from(e.changedTouches)) {
                    releaseTouch(touch);
                }
                e.preventDefault();
            }, { passive: false });

            canvas.addEventListener('touchcancel', (e) => {
                for (const touch of Array.from(e.changedTouches)) {
                    releaseTouch(touch);
                }
                e.preventDefault();
            }, { passive: false });

            window.addEventListener('touchmove', (e) => {
                if (this.isGameActive) {
                    e.preventDefault();
                }
            }, { passive: false });
        }

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
