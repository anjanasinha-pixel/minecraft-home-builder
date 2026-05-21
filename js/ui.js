// UI System
class GameUI {
    constructor() {
        this.mainMenu = document.getElementById('main-menu');
        this.tutorialMenu = document.getElementById('tutorial-menu');
        this.pauseMenu = document.getElementById('pause-menu');
        this.loadingScreen = document.getElementById('loading-screen');
        this.notification = document.getElementById('notification');
        this.hud = document.getElementById('hud');

        this.setupMenuButtons();
        this.setupBlockSelector();
    }

    setupMenuButtons() {
        // Start Game
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });

        // Tutorial
        document.getElementById('tutorial-btn').addEventListener('click', () => {
            this.showTutorial();
        });

        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showNotification('Settings coming soon!');
        });

        // Tutorial Back
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            this.showMenu();
        });

        // Pause Menu
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.resumeGame();
        });

        document.getElementById('save-world-btn').addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('saveWorld'));
        });

        document.getElementById('return-to-menu-btn').addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('returnToMenu'));
        });

        // ESC to toggle pause
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && !this.mainMenu.classList.contains('active')) {
                if (this.pauseMenu.classList.contains('active')) {
                    this.resumeGame();
                } else {
                    this.pauseGame();
                }
            }
        });
    }

    setupBlockSelector() {
        const blockButtons = document.querySelectorAll('.block-btn');
        blockButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                blockButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                // Dispatch event
                const blockType = btn.getAttribute('data-block');
                window.dispatchEvent(new CustomEvent('selectBlock', { detail: { type: blockType } }));
                this.showNotification(`Selected ${blockType}!`);
            });
        });

        // Keyboard shortcuts for blocks
        const blockMap = {
            '1': 'dirt',
            '2': 'grass',
            '3': 'wood',
            '4': 'stone',
            '5': 'sand',
            '6': 'brick'
        };

        document.addEventListener('keydown', (e) => {
            if (blockMap[e.key]) {
                window.dispatchEvent(new CustomEvent('selectBlock', { detail: { type: blockMap[e.key] } }));
                
                // Update UI
                blockButtons.forEach(b => {
                    if (b.getAttribute('data-block') === blockMap[e.key]) {
                        blockButtons.forEach(btn => btn.classList.remove('active'));
                        b.classList.add('active');
                    }
                });
                this.showNotification(`Selected ${blockMap[e.key]}!`);
            }
        });
    }

    hideLoadingScreen() {
        this.loadingScreen.style.display = 'none';
    }

    showMenu() {
        this.mainMenu.classList.add('active');
        this.pauseMenu.classList.remove('active');
        this.tutorialMenu.classList.remove('active');
    }

    hideMenu() {
        this.mainMenu.classList.remove('active');
        this.pauseMenu.classList.remove('active');
        this.tutorialMenu.classList.remove('active');
    }

    showTutorial() {
        this.mainMenu.classList.remove('active');
        this.tutorialMenu.classList.add('active');
    }

    pauseGame() {
        this.pauseMenu.classList.add('active');
        window.dispatchEvent(new Event('gamePaused'));
    }

    resumeGame() {
        this.pauseMenu.classList.remove('active');
        window.dispatchEvent(new Event('gameResumed'));
    }

    startGame() {
        this.hideMenu();
        this.hideLoadingScreen();
        window.dispatchEvent(new Event('startGame'));
    }

    showNotification(message, duration = 3000) {
        this.notification.textContent = message;
        this.notification.classList.add('show');

        setTimeout(() => {
            this.notification.classList.remove('show');
        }, duration);
    }

    updatePlayerInfo(players) {
        players.forEach((player, index) => {
            const playerInfo = document.getElementById(`player${index + 1}-info`);
            const playerAvatar = document.getElementById(`player${index + 1}-avatar`);
            
            if (playerInfo) {
                playerInfo.style.borderColor = player.color;
            }
            if (playerAvatar) {
                playerAvatar.style.backgroundColor = player.color;
            }
        });
    }

    updateStats(stats) {
        // Can be extended to show world stats
    }

    toggleHUD(show) {
        this.hud.style.display = show ? 'block' : 'none';
    }
}

// Notification Manager
class NotificationManager {
    constructor() {
        window.addEventListener('playerNotification', (e) => {
            const ui = window.gameUI;
            if (ui) {
                ui.showNotification(e.detail.message);
            }
        });
    }
}
