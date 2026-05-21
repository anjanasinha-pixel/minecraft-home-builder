// Game Constants
const CONSTANTS = {
    // World settings
    WORLD_SIZE: 64,
    CHUNK_SIZE: 16,
    GROUND_LEVEL: 10,
    MAX_HEIGHT: 20,
    
    // Block settings
    BLOCK_SIZE: 1,
    RENDER_DISTANCE: 8,
    
    // Player settings
    PLAYER_SPEED: 0.15,
    PLAYER_JUMP_FORCE: 0.5,
    PLAYER_HEIGHT: 1.7,
    PLAYER_WIDTH: 0.6,
    
    // Camera settings
    CAMERA_FOV: 75,
    CAMERA_NEAR: 0.1,
    CAMERA_FAR: 1000,
    
    // Physics
    GRAVITY: -9.82,
    FRICTION: 0.3,
    
    // Block types
    BLOCK_TYPES: {
        air: { name: 'Air', color: 0x87CEEB, texture: null },
        dirt: { name: 'Dirt', color: 0x8B4513, texture: '🟤' },
        grass: { name: 'Grass', color: 0x228B22, texture: '🟩' },
        wood: { name: 'Wood', color: 0xA0522D, texture: '🟫' },
        stone: { name: 'Stone', color: 0x808080, texture: '⬜' },
        sand: { name: 'Sand', color: 0xFFD700, texture: '🟨' },
        brick: { name: 'Brick', color: 0xDC143C, texture: '🧱' },
        water: { name: 'Water', color: 0x4166F5, texture: '💧' },
        glass: { name: 'Glass', color: 0xB0E0E6, texture: '🔷' }
    },
    
    // Player settings
    PLAYERS: {
        reyansh: {
            name: 'Reyansh',
            color: 0x87CEEB,
            bodyColor: '#4A90E2',
            skinColor: '#d4a574',
            hairColor: '#1a1a1a'
        },
        anjana: {
            name: 'Anjana',
            color: 0xFFB6C1,
            bodyColor: '#E89BAD',
            skinColor: '#d4a574',
            hairColor: '#6B4423'
        }
    },
    
    // UI
    BLOCK_SELECTOR_TYPES: ['dirt', 'grass', 'wood', 'stone', 'sand', 'brick'],
    DEFAULT_BLOCK: 'dirt',
    
    // Animation speeds
    WALK_ANIMATION_SPEED: 0.08,
    JUMP_ANIMATION_SPEED: 0.3,
};

Object.freeze(CONSTANTS);
