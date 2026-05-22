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
        this.vocabList = this.getVocabularyList();
        this.vocabQueue = this.shuffleVocabulary(this.vocabList);

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
            },
            {
                word: 'Affable',
                meaning: 'Friendly, easy to talk to, and pleasant.',
                usage: 'The affable neighbor always welcomed visitors with a smile.'
            },
            {
                word: 'Altruistic',
                meaning: 'Unselfishly concerned with the welfare of others.',
                usage: 'Her altruistic actions helped the whole community.'
            },
            {
                word: 'Benevolent',
                meaning: 'Well meaning and kindly.',
                usage: 'The benevolent leader guided the team with compassion.'
            },
            {
                word: 'Buoyant',
                meaning: 'Cheerful and optimistic.',
                usage: 'Her buoyant spirit lifted everyone in the room.'
            },
            {
                word: 'Courageous',
                meaning: 'Brave and willing to face danger or difficulty.',
                usage: 'The courageous boy rescued the kitten from the tree.'
            },
            {
                word: 'Dauntless',
                meaning: 'Showing fearlessness and determination.',
                usage: 'She remained dauntless during the storm.'
            },
            {
                word: 'Debonair',
                meaning: 'Confident, stylish and charming.',
                usage: 'He looked debonair in his sharp suit.'
            },
            {
                word: 'Diligent',
                meaning: 'Showing care and effort in one’s work or duties.',
                usage: 'The diligent student finished every assignment on time.'
            },
            {
                word: 'Ebullient',
                meaning: 'Overflowing with enthusiasm or excitement.',
                usage: 'Her ebullient laughter filled the café.'
            },
            {
                word: 'Effervescent',
                meaning: 'Vivacious and full of energy.',
                usage: 'He had an effervescent personality that everyone enjoyed.'
            },
            {
                word: 'Empathetic',
                meaning: 'Able to understand and share the feelings of others.',
                usage: 'Her empathetic nature made her a great friend.'
            },
            {
                word: 'Flourish',
                meaning: 'To grow or develop in a healthy or vigorous way.',
                usage: 'The garden began to flourish after the spring rain.'
            },
            {
                word: 'Fortunate',
                meaning: 'Having good luck or favorable circumstances.',
                usage: 'They felt fortunate to find shelter before the storm.'
            },
            {
                word: 'Gallant',
                meaning: 'Brave and noble in spirit.',
                usage: 'The gallant defender protected the weak.'
            },
            {
                word: 'Gracious',
                meaning: 'Courteous, kind, and pleasant.',
                usage: 'She remained gracious even after the competition ended.'
            },
            {
                word: 'Halcyon',
                meaning: 'Calm, peaceful, and happy.',
                usage: 'They remembered the halcyon days of summer with fondness.'
            },
            {
                word: 'Impeccable',
                meaning: 'In accordance with the highest standards; faultless.',
                usage: 'His service at the restaurant was impeccable.'
            },
            {
                word: 'Inspiring',
                meaning: 'Having the effect of inspiring someone to do or feel something.',
                usage: 'Her speech was inspiring and moved everyone to action.'
            },
            {
                word: 'Jubilant',
                meaning: 'Feeling or expressing great happiness and triumph.',
                usage: 'The team was jubilant after winning the championship.'
            },
            {
                word: 'Keen',
                meaning: 'Having or showing eagerness or enthusiasm.',
                usage: 'He was keen to learn new things every day.'
            },
            {
                word: 'Luminous',
                meaning: 'Giving off light; bright or shining.',
                usage: 'The luminous moon lit the night sky.'
            },
            {
                word: 'Magnanimous',
                meaning: 'Very generous or forgiving, especially toward a rival or someone less powerful.',
                usage: 'She was magnanimous in victory and praised her opponent.'
            },
            {
                word: 'Mellifluous',
                meaning: 'Sweet or musical; pleasant to hear.',
                usage: 'The singer’s mellifluous voice calmed the audience.'
            },
            {
                word: 'Optimistic',
                meaning: 'Hopeful and confident about the future.',
                usage: 'He remained optimistic even when the task was hard.'
            },
            {
                word: 'Passionate',
                meaning: 'Showing strong feelings or belief.',
                usage: 'She was passionate about protecting the environment.'
            },
            {
                word: 'Radiant',
                meaning: 'Clearly very happy and full of love or joy.',
                usage: 'Her radiant smile brightened the room.'
            },
            {
                word: 'Serene',
                meaning: 'Calm, peaceful, and untroubled.',
                usage: 'The lake was serene at dawn.'
            },
            {
                word: 'Spirited',
                meaning: 'Full of energy, enthusiasm, and determination.',
                usage: 'The team gave a spirited performance in the final game.'
            },
            {
                word: 'Stellar',
                meaning: 'Outstanding; exceptionally good.',
                usage: 'Her presentation was absolutely stellar.'
            },
            {
                word: 'Tenacious',
                meaning: 'Holding fast; persistent and determined.',
                usage: 'She was tenacious in pursuing her dreams.'
            },
            {
                word: 'Tranquil',
                meaning: 'Free from disturbance; calm.',
                usage: 'The tranquil garden was a perfect place to read.'
            },
            {
                word: 'Uplifting',
                meaning: 'Morally or spiritually elevating; inspiring happiness or hope.',
                usage: 'The story was uplifting and renewed their faith in kindness.'
            },
            {
                word: 'Vibrant',
                meaning: 'Full of energy and enthusiasm.',
                usage: 'The festival atmosphere was vibrant and joyful.'
            },
            {
                word: 'Winsome',
                meaning: 'Attractive or appealing in a fresh, innocent way.',
                usage: 'Her winsome smile made everyone feel welcome.'
            },
            {
                word: 'Zealous',
                meaning: 'Filled with or showing a strong and energetic desire to do something.',
                usage: 'The zealous volunteers worked hard to help the community.'
            }
        ];
    }

    shuffleVocabulary(list) {
        const shuffled = list.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    showVocabulary() {
        this.hideAllMenus();
        if (this.vocabMenu) {
            this.vocabMenu.classList.add('active');
            this.nextVocabularyWord();
        }
    }

    nextVocabularyWord() {
        if (!this.vocabQueue || this.vocabQueue.length === 0) {
            this.vocabQueue = this.shuffleVocabulary(this.vocabList);
        }

        const vocab = this.vocabQueue.shift();
        if (!vocab) return;
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
        const mobileBlockButtons = document.querySelectorAll('.mobile-block-btn');

        const updateActiveBlockButtons = (blockType) => {
            blockButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-block') === blockType));
            mobileBlockButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-block') === blockType));
        };

        const selectBlock = (btn, e) => {
            if (e) e.preventDefault();
            const blockType = btn.getAttribute('data-block');
            updateActiveBlockButtons(blockType);
            window.dispatchEvent(new CustomEvent('selectBlock', { detail: { type: blockType } }));
            this.showNotification(`Selected ${blockType}!`);
        };

        blockButtons.forEach(btn => {
            btn.addEventListener('click', (e) => selectBlock(btn, e));
            btn.addEventListener('touchstart', (e) => selectBlock(btn, e), { passive: false });
        });

        mobileBlockButtons.forEach(btn => {
            btn.addEventListener('click', (e) => selectBlock(btn, e));
            btn.addEventListener('touchstart', (e) => selectBlock(btn, e), { passive: false });
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
