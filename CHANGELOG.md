# Changelog

All notable changes to Adventure Quest will be documented in this file.

## [0.2.0] - 2025-12-29

### Added

#### Collectibles System
- **Coins**: Small (1 coin, 10 points) and Large (5 coins, 50 points)
- **Animated Coins**: Bobbing animation and spinning effect
- **1-Up System**: Gain extra life every 100 coins collected
- **Particle Effects**: Sparkle effect when collecting coins

#### Enemy System
- **Bounce Blobs**: Green enemies that patrol and can be defeated by jumping on them
- **Spike Shells**: Red spiky enemies that cannot be jumped on
- **Enemy AI**: Simple patrol patterns with configurable patrol distances
- **Enemy Physics**: Enemies affected by gravity and collision
- **Defeat Mechanics**: Jump on Bounce Blobs to defeat and earn 100 points
- **Damage System**: Contact with enemies deals damage with knockback effect

#### Particle Effects
- **Jump Dust**: Small dust cloud when jumping
- **Landing Dust**: Larger dust effect when landing
- **Coin Sparkles**: Golden particles when collecting coins
- **Enemy Defeat**: Explosion effect when defeating enemies
- **Death Effect**: Red particle burst when player dies

#### Audio System
- **Web Audio API**: Procedurally generated sound effects
- **Jump Sound**: Upward tone when jumping
- **Landing Sound**: Soft thud when landing
- **Coin Collect**: Ascending 3-note chime (C-E-G)
- **Enemy Defeat**: Descending tone sequence
- **Damage Sound**: Low harsh tone
- **Death Sound**: Descending dramatic sequence
- **1-Up Jingle**: Victory fanfare for extra life
- **Pause Sound**: Simple beep

#### Game Screens
- **Game Over Screen**: Shows final score and coin count
- **Level Complete Screen**: Victory screen with stats
- **Enhanced Pause Screen**: Cleaner UI

#### Level Content
- **15 Coins**: Strategically placed throughout the level
- **4 Enemies**: Mix of Bounce Blobs and Spike Shells
- **Large Coins**: Special high-value coins in challenging locations

#### Technical Improvements
- **Invincibility Frames**: 1.5 seconds after taking damage
- **Visual Feedback**: Player flashes when invincible
- **Better Death Handling**: 1-second delay before respawn
- **Improved Collision**: Separate top/side collision detection for enemies
- **State Management**: Game over and level complete states

### Changed
- **Player Health**: Now properly tracked with visual hearts in HUD
- **Lives System**: Properly decrements and triggers game over
- **Score System**: Points from coins and enemy defeats
- **Camera**: Smoother following with improved lerp

### Fixed
- **Physics**: Corrected gravity application timing
- **Collision**: Fixed edge cases in tile collision
- **Animation**: Fixed player animation frame timing
- **Respawn**: Proper respawn with particle clearing

## [0.1.0] - 2025-12-29

### Added
- Initial game foundation
- Player character (Nova) with movement
- Run and sprint mechanics
- Variable height jumping
- Physics engine with gravity
- Tile-based collision detection
- Coyote time and jump buffering
- Camera system with smooth following
- Basic HUD (lives, coins, score, health)
- Pause functionality
- Test level with platforms
- Pixel-perfect rendering (320x180 @ 3x scale)

---

## Version Numbers

Format: [Major].[Minor].[Patch]

- **Major**: Significant changes, new worlds, major features
- **Minor**: New features, enemies, collectibles, levels
- **Patch**: Bug fixes, balance changes, minor improvements
