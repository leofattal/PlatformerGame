// Level System
class Level {
    constructor(levelData) {
        this.data = levelData;
        this.width = levelData.width;
        this.height = levelData.height;
        this.tiles = levelData.tiles;

        this.widthInPixels = this.width * GAME_CONFIG.TILE_SIZE;
        this.heightInPixels = this.height * GAME_CONFIG.TILE_SIZE;

        // Tile types
        this.TILE_EMPTY = 0;
        this.TILE_GROUND = 1;
        this.TILE_BRICK = 2;
        this.TILE_QUESTION = 3;
    }

    /**
     * Check if a tile at given coordinates is solid
     */
    isSolidTile(tileX, tileY) {
        if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) {
            return false;
        }

        const tileType = this.tiles[tileY][tileX];
        return tileType !== this.TILE_EMPTY;
    }

    /**
     * Get tile at pixel coordinates
     */
    getTileAtPixel(pixelX, pixelY) {
        const tilePos = Utils.pixelToTile(pixelX, pixelY);
        return this.getTile(tilePos.x, tilePos.y);
    }

    /**
     * Get tile at tile coordinates
     */
    getTile(tileX, tileY) {
        if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) {
            return this.TILE_EMPTY;
        }
        return this.tiles[tileY][tileX];
    }

    /**
     * Render the level
     */
    render(ctx, camera) {
        // Calculate visible tile range
        const startTileX = Math.max(0, Math.floor(camera.x / GAME_CONFIG.TILE_SIZE));
        const endTileX = Math.min(this.width, Math.ceil((camera.x + camera.width) / GAME_CONFIG.TILE_SIZE));
        const startTileY = Math.max(0, Math.floor(camera.y / GAME_CONFIG.TILE_SIZE));
        const endTileY = Math.min(this.height, Math.ceil((camera.y + camera.height) / GAME_CONFIG.TILE_SIZE));

        // Render tiles
        for (let tileY = startTileY; tileY < endTileY; tileY++) {
            for (let tileX = startTileX; tileX < endTileX; tileX++) {
                const tileType = this.tiles[tileY][tileX];
                if (tileType !== this.TILE_EMPTY) {
                    this.renderTile(ctx, tileX, tileY, tileType, camera);
                }
            }
        }
    }

    /**
     * Render a single tile
     */
    renderTile(ctx, tileX, tileY, tileType, camera) {
        const pixelX = tileX * GAME_CONFIG.TILE_SIZE - camera.x;
        const pixelY = tileY * GAME_CONFIG.TILE_SIZE - camera.y;
        const size = GAME_CONFIG.TILE_SIZE;

        ctx.save();

        switch (tileType) {
            case this.TILE_GROUND:
                // Grass block
                // Grass top
                ctx.fillStyle = '#7EC850';
                ctx.fillRect(pixelX, pixelY, size, 4);

                // Dirt
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(pixelX, pixelY + 4, size, size - 4);

                // Add some texture
                ctx.fillStyle = '#654321';
                ctx.fillRect(pixelX + 2, pixelY + 6, 2, 2);
                ctx.fillRect(pixelX + 8, pixelY + 8, 2, 2);
                ctx.fillRect(pixelX + 12, pixelY + 11, 2, 2);
                break;

            case this.TILE_BRICK:
                // Brick block
                ctx.fillStyle = '#CD853F';
                ctx.fillRect(pixelX, pixelY, size, size);

                // Brick pattern
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 1;

                // Horizontal lines
                ctx.beginPath();
                ctx.moveTo(pixelX, pixelY + 8);
                ctx.lineTo(pixelX + size, pixelY + 8);
                ctx.stroke();

                // Vertical lines (staggered)
                ctx.beginPath();
                ctx.moveTo(pixelX + 8, pixelY);
                ctx.lineTo(pixelX + 8, pixelY + 8);
                ctx.moveTo(pixelX + 8, pixelY + 8);
                ctx.lineTo(pixelX + 8, pixelY + size);
                ctx.stroke();

                // Border
                ctx.strokeStyle = '#A0522D';
                ctx.strokeRect(pixelX, pixelY, size, size);
                break;

            case this.TILE_QUESTION:
                // Question block (golden)
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(pixelX, pixelY, size, size);

                // Question mark
                ctx.fillStyle = '#000000';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('?', pixelX + size / 2, pixelY + size / 2);

                // Border
                ctx.strokeStyle = '#B8860B';
                ctx.strokeRect(pixelX, pixelY, size, size);
                break;
        }

        ctx.restore();
    }
}

// Test Level Data
const TestLevel = {
    width: 40,
    height: 15,
    tiles: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // Collectibles (coins)
    coins: [
        // Starting area coins
        { x: 64, y: 180, type: 'small' },
        { x: 80, y: 180, type: 'small' },
        { x: 96, y: 180, type: 'small' },
        { x: 112, y: 180, type: 'small' },
        // Above first platform
        { x: 160, y: 112, type: 'small' },
        { x: 176, y: 96, type: 'small' },
        { x: 192, y: 112, type: 'small' },
        // Question block area
        { x: 176, y: 80, type: 'large' },
        // Second platform area
        { x: 320, y: 128, type: 'small' },
        { x: 336, y: 128, type: 'small' },
        { x: 352, y: 128, type: 'small' },
        // Third platform
        { x: 432, y: 96, type: 'large' },
        // High up coins
        { x: 528, y: 144, type: 'small' },
        { x: 544, y: 144, type: 'small' },
        { x: 560, y: 144, type: 'small' }
    ],
    // Enemies
    enemies: [
        // First enemy
        { x: 200, y: 192, type: 'bounceBlob' },
        // Second enemy
        { x: 300, y: 192, type: 'spikeShell' },
        // Third enemy on platform
        { x: 400, y: 192, type: 'bounceBlob' },
        // Harder enemy
        { x: 500, y: 192, type: 'spikeShell' }
    ]
};
