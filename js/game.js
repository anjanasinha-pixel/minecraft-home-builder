// Main Game Engine
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.isPaused = false;
        this.isRunning = false;

        // Initialize Three.js
        this.initThreeJS();

        // Initialize game systems
        this.playerManager = new PlayerManager(this.scene);
        this.world = new World(this.scene);
        this.ui = new GameUI();
        this.notificationManager = new NotificationManager();

        // Create players
        this.createPlayers();

        // Camera
        this.currentPlayer = this.playerManager.getPlayer('reyansh');
        this.camera = new GameCamera(this.currentPlayer, this.canvas);

        // Input
        this.inputManager = new InputManager(this.currentPlayer);

        // Game stats
        this.stats = {
            frameCount: 0,
            fps: 0,
            lastTime: performance.now()
        };

        // Setup event listeners
        this.setupEventListeners();

        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start game loop
        this.animate();

        // Hide loading screen after a moment
        setTimeout(() => {
            this.ui.hideLoadingScreen();
        }, 1500);
    }

    initThreeJS() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 200, 500);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

        // Color management
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    }

    createPlayers() {
        // Reyansh (11-year-old, wearing blue jacket)
        const reyansh = this.playerManager.createPlayer(
            'reyansh',
            'Reyansh',
            CONSTANTS.PLAYERS.reyansh.color
        );
        reyansh.position.set(-5, CONSTANTS.GROUND_LEVEL + 2, -10);

        // Anjana (mother)
        const anjana = this.playerManager.createPlayer(
            'anjana',
            'Anjana',
            CONSTANTS.PLAYERS.anjana.color
        );
        anjana.position.set(5, CONSTANTS.GROUND_LEVEL + 2, -10);

        // Update UI with player info
        this.ui.updatePlayerInfo([
            { name: 'Reyansh', color: CONSTANTS.PLAYERS.reyansh.bodyColor },
            { name: 'Anjana', color: CONSTANTS.PLAYERS.anjana.bodyColor }
        ]);
    }

    setupEventListeners() {
        // Game start
        window.addEventListener('startGame', () => {
            this.startGame();
        });

        // Game pause/resume
        window.addEventListener('gamePaused', () => {
            this.pauseGame();
        });

        window.addEventListener('gameResumed', () => {
            this.resumeGame();
        });

        // Return to menu
        window.addEventListener('returnToMenu', () => {
            this.returnToMenu();
        });

        // Block actions
        window.addEventListener('placeBlock', () => {
            if (!this.isPaused && this.isRunning) {
                this.currentPlayer.placeBlock(this.world, this.camera.camera);
            }
        });

        window.addEventListener('removeBlock', () => {
            if (!this.isPaused && this.isRunning) {
                this.currentPlayer.removeBlock(this.world, this.camera.camera);
            }
        });

        // Block selection
        window.addEventListener('selectBlock', (e) => {
            this.currentPlayer.selectBlockType(e.detail.type);
        });

        // Save world
        window.addEventListener('saveWorld', () => {
            this.saveWorld();
        });

        // Switch player (Tab key)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Tab' && this.isRunning && !this.isPaused) {
                e.preventDefault();
                this.switchPlayer();
            }
        });
    }

    startGame() {
        this.isRunning = true;
        this.inputManager.activateGame();
        this.ui.hideMenu();
        this.camera.lock();
        this.ui.showNotification('🎮 Game Started! Build together!');
    }

    pauseGame() {
        this.isPaused = true;
        this.inputManager.deactivateGame();
        this.camera.unlock();
    }

    resumeGame() {
        this.isPaused = false;
        this.inputManager.activateGame();
        this.camera.lock();
    }

    returnToMenu() {
        this.isRunning = false;
        this.isPaused = false;
        this.inputManager.deactivateGame();
        this.camera.unlock();
        this.ui.showMenu();
        this.inputManager.resetInput();
    }

    switchPlayer() {
        const newPlayerId = this.currentPlayer.id === 'reyansh' ? 'anjana' : 'reyansh';
        this.currentPlayer = this.playerManager.getPlayer(newPlayerId);
        this.camera.player = this.currentPlayer;
        this.inputManager.player = this.currentPlayer;
        this.ui.showNotification(`Switched to ${this.currentPlayer.name}!`);
    }

    saveWorld() {
        const worldData = this.world.save();
        localStorage.setItem('minecraftWorld', worldData);
        this.ui.showNotification('✅ World saved!');
    }

    loadWorld() {
        const worldData = localStorage.getItem('minecraftWorld');
        if (worldData) {
            this.world.load(worldData);
            this.ui.showNotification('📂 World loaded!');
        }
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.renderer.setSize(width, height);
        this.camera.resize(width, height);
    }

    update(deltaTime) {
        if (!this.isRunning || this.isPaused) return;

        // Update input
        this.inputManager.update();

        // Update players
        this.playerManager.updateAll(deltaTime, this.world);

        // Update camera
        this.camera.update();

        // Update world rendering
        this.world.renderVisibleBlocks(this.currentPlayer.position);
    }

    render() {
        this.renderer.render(this.scene, this.camera.camera);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Calculate delta time
        const now = performance.now();
        const deltaTime = (now - this.stats.lastTime) / 1000;
        this.stats.lastTime = now;

        // Cap deltaTime to prevent large jumps
        const clampedDeltaTime = Math.min(deltaTime, 0.016);

        // Update and render
        this.update(clampedDeltaTime);
        this.render();

        // Calculate FPS
        this.stats.frameCount++;
        if (now - this.stats.lastTime > 1000) {
            this.stats.fps = this.stats.frameCount;
            this.stats.frameCount = 0;
        }
    }
}

// Initialize game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
    window.gameUI = window.game.ui;

    // Try to load saved world
    setTimeout(() => {
        window.game.loadWorld();
    }, 500);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.game) {
        window.game.saveWorld();
    }
});
