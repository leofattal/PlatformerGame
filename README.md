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
├── index.html              # Main HTML file
├── prd.md                  # Product Requirements Document
├── README.md               # This file
├── DEPLOYMENT.md           # Deployment guide
├── DEPLOY_NOW.md          # Quick deployment steps
├── vercel.json             # Vercel configuration
├── package.json            # Project metadata
└── js/
    ├── main.js             # Entry point and initialization
    ├── game.js             # Main game loop and state management
    ├── player.js           # Player character (Nova) logic
    ├── level.js            # Level data and rendering
    ├── physics.js          # Physics engine and collision detection
    ├── input.js            # Input handling
    ├── audio.js            # Sound effects system
    ├── particles.js        # Particle effects
    ├── collectibles.js     # Coins and collectibles
    ├── enemies.js          # Enemy AI and behavior
    └── utils.js            # Constants and utility functions
```

## Features Implemented

### ✅ Phase 1: Core Gameplay (Completed!)

**Movement & Physics:**
- [x] Player character (Nova) with smooth movement
- [x] Run and sprint mechanics
- [x] Variable height jumping
- [x] Gravity and physics system with rise/fall multipliers
- [x] Tile-based collision detection (AABB)
- [x] Coyote time (100ms grace period for edge jumps)
- [x] Jump buffering (150ms pre-input window)
- [x] Camera following with smooth lerp

**Collectibles & Scoring:**
- [x] Animated coins (small and large)
- [x] Coin collection with bobbing animation
- [x] Spinning coin effect
- [x] 1-Up system (every 100 coins)
- [x] Score tracking

**Enemies:**
- [x] Bounce Blobs (can be jumped on)
- [x] Spike Shells (cannot be jumped on)
- [x] Enemy AI with patrol patterns
- [x] Enemy defeat mechanics
- [x] Player damage and knockback
- [x] Invincibility frames (1.5s)

**Visual Effects:**
- [x] Particle system with multiple effects
- [x] Jump dust particles
- [x] Landing dust clouds
- [x] Coin collect sparkles
- [x] Enemy defeat explosions
- [x] Death particle effect

**Audio:**
- [x] Web Audio API sound system
- [x] Jump sound effect
- [x] Landing sound
- [x] Coin collect chime
- [x] Enemy defeat sound
- [x] Damage/hurt sound
- [x] Death sound
- [x] 1-Up jingle

**UI & Screens:**
- [x] Full HUD (health hearts, lives, coins, score)
- [x] Pause screen (ESC)
- [x] Game Over screen with stats
- [x] Level Complete screen
- [x] Restart functionality

**Technical:**
- [x] 60 FPS game loop
- [x] Pixel-perfect rendering (320x180 scaled 3x)
- [x] Optimized collision detection
- [x] Object pooling for particles

### 🚧 Coming Next (Phase 2)

- [ ] World map system
- [ ] Multiple levels (World 1: Grassland Grove)
- [ ] Power-ups (Fire Flower, Ice Crystal)
- [ ] Advanced abilities (double jump, dash, wall jump)
- [ ] Boss battle
- [ ] Background music
- [ ] Secret areas
- [ ] Star fragments collectibles

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
