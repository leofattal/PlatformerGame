# Adventure Quest - 2D Platformer Game

A classic-inspired 2D side-scrolling platformer built with HTML5 Canvas and JavaScript.

## Getting Started

### Quick Start

1. Open `index.html` in a modern web browser
2. Or run a local server:
   ```bash
   python3 -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`

### Controls

- **Arrow Keys** or **WASD**: Move left/right, crouch
- **SPACE**: Jump (hold for higher jump)
- **SHIFT**: Sprint
- **ESC**: Pause game
- **R**: Restart level

## Project Structure

```
PlatformerGame/
├── index.html           # Main HTML file
├── prd.md              # Product Requirements Document
├── README.md           # This file
└── js/
    ├── main.js         # Entry point and initialization
    ├── game.js         # Main game loop and state management
    ├── player.js       # Player character (Nova) logic
    ├── level.js        # Level data and rendering
    ├── physics.js      # Physics engine and collision detection
    ├── input.js        # Input handling
    └── utils.js        # Constants and utility functions
```

## Features Implemented

### ✅ Phase 1: Core Gameplay (Current)

- [x] Player character with smooth movement
- [x] Run and sprint mechanics
- [x] Variable height jumping
- [x] Gravity and physics system
- [x] Tile-based collision detection
- [x] Coyote time (grace period for edge jumps)
- [x] Jump buffering (pre-input)
- [x] Camera following with smoothing
- [x] Basic HUD (health, lives, coins, score)
- [x] Pause functionality
- [x] Pixel-perfect rendering (320x180 scaled 3x)

### 🚧 Coming Next

- [ ] Collectibles (coins, power-ups)
- [ ] Enemies with AI
- [ ] Sound effects and music
- [ ] Multiple levels
- [ ] World map system
- [ ] Boss battles
- [ ] Advanced abilities (double jump, dash, wall jump)
- [ ] Particle effects
- [ ] Better animations

## Game Architecture

### Game Loop
The game runs at 60 FPS with a fixed timestep for consistent physics:
1. **Input** → Process keyboard input
2. **Update** → Update player, physics, game state
3. **Render** → Draw level, player, HUD
4. **Repeat** → Request next animation frame

### Physics System
- **Gravity**: Applied every frame with different multipliers for rising vs falling
- **Collision Detection**: AABB (Axis-Aligned Bounding Box) for entities, tile-based for environment
- **Movement**: Acceleration/deceleration curves for responsive feel
- **Air Control**: 75% movement control while airborne

### Player Movement Values (from PRD)
- Run Speed: 6 tiles/second
- Sprint Speed: 8 tiles/second
- Jump Velocity: 12 units/second
- Gravity: 32 units/second² (with multipliers)
- Coyote Time: 100ms
- Jump Buffer: 150ms

## Development Phases

Based on the PRD, the development is planned in 5 phases:

1. **Prototype** (Current) - Core movement, test level, basic collision
2. **Vertical Slice** - Complete World 1 with polish
3. **Content Production** - Worlds 2-5, enemies, bosses
4. **Polish & Testing** - Bug fixes, balance, optimization
5. **Launch Preparation** - Platform builds, marketing

## Technical Details

- **Resolution**: 320x180 native (16:9), scaled 3x to 960x540
- **Tile Size**: 16x16 pixels
- **Rendering**: HTML5 Canvas 2D with pixel-perfect scaling
- **Physics**: Custom physics engine with fixed timestep
- **Performance Target**: 60 FPS

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support

## 🚀 Deployment

### Deploy to Vercel

This project is ready for production deployment to Vercel:

**Quick Deploy:**
```bash
npm install -g vercel
vercel --prod
```

**Or via GitHub:**
1. Push to GitHub: `git push origin main`
2. Import to Vercel dashboard
3. Auto-deploy on every commit

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Production Ready

- ✅ Vercel configuration included
- ✅ Cache headers optimized
- ✅ Zero build step required (static files)
- ✅ 60 FPS performance target
- ✅ Mobile responsive

## License

See PRD for full project details and design specifications.
