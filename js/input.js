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

        // Mobile HUD elements for feedback
        this.movementHud = document.getElementById('movement-hud');
        this.movementToggles = {
            KeyW: document.getElementById('mh-forward'),
            KeyA: document.getElementById('mh-left'),
            KeyS: document.getElementById('mh-back'),
            KeyD: document.getElementById('mh-right')
        };
        this.tapZonesEl = document.getElementById('tap-zones');
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

        const isTouchOnMobileUI = (target) => {
            return target && target.closest && target.closest('.mobile-controls, .mobile-block-picker, .mobile-tutorial-overlay, .menu') !== null;
        };

        const handleTouchEnd = (e) => {
            if (!this.isGameActive || !e.changedTouches || e.changedTouches.length === 0) return;
            if (isTouchOnMobileUI(e.target)) return;

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
                this._vibrate(50);
                this._showTapIndicator(x, y, 'remove');
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
                    this._vibrate([20]);
                    this._showTapIndicator(x, y, 'place');
                    return;
                }

                // Left half: tap quadrants to toggle movement (tap to start/stop)
                if (x < w * 0.5) {
                    if (y < h * 0.33) {
                        this.keys['KeyW'] = !this.keys['KeyW'];
                        this._vibrate(20);
                    } else if (y > h * 0.66) {
                        this.keys['KeyS'] = !this.keys['KeyS'];
                        this._vibrate(20);
                    } else if (x < w * 0.25) {
                        this.keys['KeyA'] = !this.keys['KeyA'];
                        this._vibrate(20);
                    } else {
                        this.keys['KeyD'] = !this.keys['KeyD'];
                        this._vibrate(20);
                    }
                    this._updateMovementHud();
                } else {
                    if (y < h * 0.33) {
                        this.camera.rotatePitch(-0.12);
                        this._vibrate(10);
                    } else if (y > h * 0.66) {
                        this.camera.rotatePitch(0.12);
                        this._vibrate(10);
                    } else {
                        if (x > w * 0.75) this.camera.rotateYaw(-0.28);
                        else this.camera.rotateYaw(0.28);
                        this._vibrate(10);
                    }
                }
            }, 260);
        };

        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: false });
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
                this._vibrate(50);
                this._showTapIndicator(x, y, 'remove');
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
                    this._vibrate([20]);
                    this._showTapIndicator(x, y, 'place');
                    return;
                }

                // Left half: tap quadrants to toggle movement (tap to start/stop)
                if (x < w * 0.5) {
                    if (y < h * 0.33) {
                        this.keys['KeyW'] = !this.keys['KeyW'];
                        this._vibrate(20);
                    } else if (y > h * 0.66) {
                        this.keys['KeyS'] = !this.keys['KeyS'];
                        this._vibrate(20);
                    } else if (x < w * 0.25) {
                        this.keys['KeyA'] = !this.keys['KeyA'];
                        this._vibrate(20);
                    } else {
                        this.keys['KeyD'] = !this.keys['KeyD'];
                        this._vibrate(20);
                    }
                    this._updateMovementHud();
                } else {
                    // Right half: quick look controls by quadrant taps
                    if (y < h * 0.33) {
                        this.camera.rotatePitch(-0.12);
                        this._vibrate(10);
                    } else if (y > h * 0.66) {
                        this.camera.rotatePitch(0.12);
                        this._vibrate(10);
                    } else {
                        if (x > w * 0.75) this.camera.rotateYaw(-0.28);
                        else this.camera.rotateYaw(0.28);
                        this._vibrate(10);
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
                        this._updateMovementHud();
                        break;
                    case 'move-backward':
                        this.keys['KeyS'] = true;
                        this._updateMovementHud();
                        break;
                    case 'move-left':
                        this.keys['KeyA'] = true;
                        this._updateMovementHud();
                        break;
                    case 'move-right':
                        this.keys['KeyD'] = true;
                        this._updateMovementHud();
                        break;
                    case 'place-block':
                        window.dispatchEvent(new CustomEvent('placeBlock'));
                        this._vibrate([20]);
                        // center indicator near middle of screen
                        const rect = canvas.getBoundingClientRect();
                        this._showTapIndicator(rect.left + rect.width/2, rect.top + rect.height/2, 'place');
                        break;
                    case 'remove-block':
                        window.dispatchEvent(new CustomEvent('removeBlock'));
                        this._vibrate(50);
                        const r2 = canvas.getBoundingClientRect();
                        this._showTapIndicator(r2.left + r2.width/2, r2.top + r2.height/2, 'remove');
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
                this._updateMovementHud();
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

    _vibrate(pattern) {
        try {
            if (navigator && navigator.vibrate) {
                navigator.vibrate(pattern);
            }
        } catch (e) {
            // ignore if unavailable
        }
    }

    _updateMovementHud() {
        if (!this.movementToggles) return;
        Object.keys(this.movementToggles).forEach((key) => {
            const el = this.movementToggles[key];
            if (!el) return;
            if (this.keys[key]) el.classList.add('active');
            else el.classList.remove('active');
        });
    }

    _showTapIndicator(clientX, clientY, type) {
        const el = document.createElement('div');
        el.className = 'tap-indicator';
        if (type === 'remove') el.style.background = 'rgba(255,80,80,0.14)';
        if (type === 'place') el.style.background = 'rgba(80,255,120,0.12)';
        el.style.left = (clientX) + 'px';
        el.style.top = (clientY) + 'px';
        document.body.appendChild(el);
        // force reflow then show
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 260);
        }, 420);
    }
}
