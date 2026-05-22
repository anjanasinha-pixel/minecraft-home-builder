// UI System
class GameUI {
    constructor() {
        this.mainMenu = document.getElementById('main-menu');
        this.tutorialMenu = document.getElementById('tutorial-menu');
        this.pauseMenu = document.getElementById('pause-menu');
        this.settingsMenu = document.getElementById('settings-menu');
        this.loadingScreen = document.getElementById('loading-screen');
        this.notification = document.getElementById('notification');
        this.hud = document.getElementById('hud');
        this.settingsNameInput = document.getElementById('settings-name');
        this.settingsLocationText = document.getElementById('settings-location-text');
        this.settingsLastAccess = document.getElementById('settings-last-access');
        this.settingsAccessUser = document.getElementById('settings-access-user');
        this.settingsLogList = document.getElementById('usage-log-list');
        this.vocabMenu = document.getElementById('vocabulary-menu');
        this.vocabWordElem = document.getElementById('vocab-word');
        this.vocabMeaningElem = document.getElementById('vocab-meaning');
        this.vocabUsageElem = document.getElementById('vocab-usage');

        this.currentUser = localStorage.getItem('gameUserName') || 'Guest';
        this.currentLocation = localStorage.getItem('gameUserLocation') || 'Unknown';
        this.usageLog = this.loadUsageLog();

        this.setupMenuButtons();
        this.setupBlockSelector();
        this.setupUsageLogging();
        this.renderSettings();

        this.trackUsage('App Opened', { location: this.currentLocation });
    }

    getVocabularyList() {
        return [
            {
                word: 'Serendipity',
                meaning: 'The occurrence of events by chance in a happy or beneficial way.',
                usage: 'Finding the perfect shell on the beach was pure serendipity.'
            },
            {
                word: 'Eloquent',
                meaning: 'Fluent or persuasive in speaking or writing.',
                usage: 'Her eloquent speech moved the entire audience.'
            },
            {
                word: 'Resilient',
                meaning: 'Able to withstand or recover quickly from difficult conditions.',
                usage: 'The resilient plants survived the harsh winter.'
            },
            {
                word: 'Intricate',
                meaning: 'Very complicated or detailed.',
                usage: 'The artist created an intricate pattern on the vase.'
            },
            {
                word: 'Vivid',
                meaning: 'Producing powerful feelings or strong, clear images in the mind.',
                usage: 'He described the memory in vivid detail.'
            },
            {
                word: 'Astonish',
                meaning: 'To surprise or impress someone greatly.',
                usage: 'The magician’s final trick never failed to astonish the crowd.'
            },
            {
                word: 'Curious',
                meaning: 'Eager to know or learn something.',
                usage: 'The curious child asked many questions about the stars.'
            },
            {
                word: 'Brilliant',
                meaning: 'Exceptionally clever or talented.',
                usage: 'She had a brilliant idea for solving the problem.'
            },
            {
                word: 'Harmony',
                meaning: 'The combination of simultaneously sounded musical notes to produce a pleasing effect.',
                usage: 'The choir sang in perfect harmony.'
            },
            {
                word: 'Enchanting',
                meaning: 'Delightfully charming or attractive.',
                usage: 'The garden looked enchanting at sunset.'
            }
        ];
    }

    showVocabulary() {
        this.hideAllMenus();
        if (this.vocabMenu) {
            this.vocabMenu.classList.add('active');
            this.nextVocabularyWord();
        }
    }

    nextVocabularyWord() {
        const vocabList = this.getVocabularyList();
        const index = Math.floor(Math.random() * vocabList.length);
        const vocab = vocabList[index];
        if (this.vocabWordElem) this.vocabWordElem.textContent = vocab.word;
        if (this.vocabMeaningElem) this.vocabMeaningElem.textContent = `Meaning: ${vocab.meaning}`;
        if (this.vocabUsageElem) this.vocabUsageElem.textContent = `Usage: ${vocab.usage}`;
        this.trackUsage('Vocabulary Viewed', { word: vocab.word });
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
            this.showSettings();
        });

        // Settings Save
        document.getElementById('settings-save-btn').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('settings-location-btn').addEventListener('click', () => {
            this.requestLocation();
        });

        document.getElementById('settings-back-btn').addEventListener('click', () => {
            this.showMenu();
        });

        // Vocabulary
        document.getElementById('vocabulary-btn').addEventListener('click', () => {
            this.showVocabulary();
        });
        document.getElementById('vocab-next-btn').addEventListener('click', () => {
            this.nextVocabularyWord();
        });
        document.getElementById('vocab-back-btn').addEventListener('click', () => {
            this.showMenu();
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
            const selectBlock = (e) => {
                e.preventDefault();
                blockButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const blockType = btn.getAttribute('data-block');
                window.dispatchEvent(new CustomEvent('selectBlock', { detail: { type: blockType } }));
                this.showNotification(`Selected ${blockType}!`);
            };

            btn.addEventListener('click', selectBlock);
            btn.addEventListener('touchstart', selectBlock, { passive: false });
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

        window.addEventListener('selectBlock', (e) => {
            const selectedType = e.detail.type;
            blockButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-block') === selectedType));
        });
    }

    hideLoadingScreen() {
        this.loadingScreen.style.display = 'none';
    }

    showMenu() {
        this.mainMenu.classList.add('active');
        this.pauseMenu.classList.remove('active');
        this.tutorialMenu.classList.remove('active');
        this.settingsMenu.classList.remove('active');
    }

    hideMenu() {
        this.mainMenu.classList.remove('active');
        this.pauseMenu.classList.remove('active');
        this.tutorialMenu.classList.remove('active');
        this.settingsMenu.classList.remove('active');
    }

    showTutorial() {
        this.hideAllMenus();
        this.tutorialMenu.classList.add('active');
    }

    showSettings() {
        this.hideAllMenus();
        this.settingsMenu.classList.add('active');
        this.renderSettings();
    }

    hideAllMenus() {
        this.mainMenu.classList.remove('active');
        this.pauseMenu.classList.remove('active');
        this.tutorialMenu.classList.remove('active');
        this.settingsMenu.classList.remove('active');
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

    saveSettings() {
        const name = this.settingsNameInput.value.trim() || 'Guest';
        this.currentUser = name;
        localStorage.setItem('gameUserName', name);
        this.showNotification(`Saved name: ${name}`);
        this.trackUsage('Settings Updated', { user: name, location: this.currentLocation });
        this.renderSettings();
    }

    requestLocation() {
        if (!navigator.geolocation) {
            this.showNotification('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const locText = `Lat ${position.coords.latitude.toFixed(4)}, Lon ${position.coords.longitude.toFixed(4)}`;
            this.currentLocation = locText;
            localStorage.setItem('gameUserLocation', locText);
            this.showNotification('Location saved.');
            this.trackUsage('Location Retrieved', { user: this.currentUser, location: locText });
            this.renderSettings();
        }, (error) => {
            this.showNotification(`Location error: ${error.message}`);
        });
    }

    loadUsageLog() {
        try {
            const raw = localStorage.getItem('gameUsageLog');
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            return [];
        }
    }

    saveUsageLog() {
        localStorage.setItem('gameUsageLog', JSON.stringify(this.usageLog.slice(-50)));
    }

    trackUsage(eventType, details = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            event: eventType,
            user: this.currentUser,
            location: this.currentLocation,
            details
        };
        this.usageLog.push(entry);
        this.saveUsageLog();
        this.renderSettings();
    }

    setupUsageLogging() {
        window.addEventListener('startGame', () => this.trackUsage('Game Started'));
        window.addEventListener('placeBlock', () => this.trackUsage('Block Placed'));
        window.addEventListener('removeBlock', () => this.trackUsage('Block Removed'));
        window.addEventListener('saveWorld', () => this.trackUsage('World Saved'));
        window.addEventListener('switchPlayerTouch', () => this.trackUsage('Player Switched'));
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    renderSettings() {
        this.settingsNameInput.value = this.currentUser;
        this.settingsLocationText.textContent = `Location: ${this.currentLocation}`;

        const lastEntry = this.usageLog[this.usageLog.length - 1];
        this.settingsLastAccess.textContent = lastEntry ? `Last access: ${this.formatTimestamp(lastEntry.timestamp)}` : 'Last access: unknown';
        this.settingsAccessUser.textContent = lastEntry ? `Last user: ${lastEntry.user}` : 'Last user: unknown';

        if (this.settingsLogList) {
            this.settingsLogList.innerHTML = '';
            const recent = this.usageLog.slice(-10).reverse();
            if (recent.length === 0) {
                this.settingsLogList.innerHTML = '<p>No usage records yet.</p>';
            } else {
                recent.forEach(entry => {
                    const item = document.createElement('div');
                    item.className = 'usage-log-entry';
                    item.innerHTML = `<strong>${this.formatTimestamp(entry.timestamp)}</strong><br>${entry.event} by <strong>${entry.user}</strong> at <em>${entry.location}</em>`;
                    this.settingsLogList.appendChild(item);
                });
            }
        }
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
