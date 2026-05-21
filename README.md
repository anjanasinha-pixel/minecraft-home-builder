# 🏠 Build Home Together - Minecraft Game

A fun, kid-friendly collaborative Minecraft-inspired building game for Anjana and Reyansh! This web-based game allows two players to work together to build an amazing home in a shared virtual world.

## 🎮 Features

- **3D Building System**: Place and remove blocks to create structures
- **Multiple Block Types**: Dirt, Grass, Wood, Stone, Sand, Brick, and more
- **Animated Avatars**: Custom character models based on Anjana and Reyansh
- **Co-op Gameplay**: Switch between players (Tab key) to play as either character
- **Dynamic Lighting**: Real-time shadows and ambient lighting for immersive experience
- **Save System**: Automatically saves your world progress
- **Kid-Friendly UI**: Colorful, intuitive interface designed for 11-year-olds
- **Smooth Physics**: Realistic gravity and collision detection

## 🕹️ How to Play

### Starting the Game

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)
2. Click "Start Game" button
3. Click on the game canvas to lock your pointer and begin playing

### Controls

| Key | Action |
|-----|--------|
| **W / ↑** | Move Forward |
| **S / ↓** | Move Backward |
| **A / ←** | Move Left |
| **D / →** | Move Right |
| **Space** | Jump |
| **Left Click** | Place Block |
| **Right Click** | Remove Block |
| **1-6** | Select Block Type (1=Dirt, 2=Grass, 3=Wood, 4=Stone, 5=Sand, 6=Brick) |
| **Tab** | Switch to Next Player |
| **ESC** | Pause/Unpause Game |
| **E** | Rotate View |

### Block Types

- 🟤 **Dirt** - Basic building block
- 🟩 **Grass** - Natural terrain
- 🟫 **Wood** - Wooden structures
- ⬜ **Stone** - Durable building material
- 🟨 **Sand** - Desert-like material
- 🧱 **Brick** - Red brick for nice buildings

## 👥 Characters

### Reyansh (11-year-old)
- Blue jacket and glasses
- Light skin tone
- Dark hair
- Friendly and energetic

### Anjana (Mother)
- Pink/mauve jacket
- Brown hair
- Supportive and creative

## 🌍 World Features

- **Large Building Area**: 64x64 block world to explore and build
- **Starting House**: A pre-built starter home to modify and improve
- **Terrain**: Natural grass and dirt terrain with sand decorations
- **Dynamic Rendering**: Only nearby blocks are rendered for performance
- **Persistent Storage**: Your world is automatically saved in browser storage

## 🎯 Building Tips

1. **Start with the Foundation**: Build a solid base before adding walls
2. **Use Different Block Types**: Mix and match blocks for interesting designs
3. **Think Vertically**: Build up to create multi-story structures
4. **Cooperate**: Take turns or work together to design rooms
5. **Save Often**: The game auto-saves, but you can manually save from the pause menu

## 📱 System Requirements

- Modern web browser with WebGL support (Chrome, Firefox, Edge, Safari)
- Hardware acceleration enabled for best performance
- At least 200MB free RAM
- Mouse/trackpad for camera control

## 💾 Saving and Loading

- **Auto-Save**: Your world is automatically saved every time you play
- **Manual Save**: Press ESC to pause, then click "Save World"
- **Load Previous World**: Your world loads automatically on page reload
- **Browser Storage**: Worlds are stored in browser's local storage (usually 5-50MB limit)

## 🐛 Troubleshooting

**Game won't start**: Make sure JavaScript is enabled and you're using a modern browser

**Pointer lock not working**: Click on the game canvas and make sure your browser allows pointer lock

**Performance issues**: Reduce render distance or close other browser tabs

**Can't place blocks**: Make sure you're looking at an existing block and click in front of it

**Saved world disappeared**: Try checking browser's clear history/cache settings

## 🎓 Educational Value

This game teaches:
- **Spatial reasoning**: Understanding 3D coordinates and placement
- **Problem-solving**: Planning and executing building designs
- **Cooperation**: Working together toward a shared goal
- **Creativity**: Designing and building original structures
- **Patience**: Taking time to build complex projects

## 📚 Technical Details

**Built with:**
- Three.js - 3D graphics engine
- WebGL - Hardware-accelerated graphics
- JavaScript ES6+ - Modern game logic
- HTML5 & CSS3 - Interface and styling

**Performance:**
- Optimized rendering with frustum culling
- Dynamic mesh generation only for visible blocks
- Efficient collision detection
- Target: 60 FPS on modern devices

## 🎨 Customization

You can easily customize the game by modifying:
- `js/constants.js` - World size, player stats, block types
- `styles.css` - Colors, fonts, UI styling
- `index.html` - Menu text and layout

## 🚀 Future Ideas

- Add more block types (glass, water, lava)
- Crafting system for creating new items
- Survival mode with resources to gather
- Day/night cycle
- Weather effects
- More complex structures and items
- Multiplayer over network
- Mobile touch controls

## 📝 License

This game is created for Anjana and Reyansh with ❤️

Enjoy building together! 🏗️

---

**Tips for Parents/Guardians:**
- Encourage creativity and problem-solving
- Play together to bond over shared achievements
- The game is 100% safe and runs entirely in the browser
- No internet connection required after initial load
- No ads, tracking, or personal data collection
