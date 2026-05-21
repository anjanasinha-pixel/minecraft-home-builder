// Block System
class Block {
    constructor(type, x, y, z) {
        this.type = type || 'air';
        this.x = x;
        this.y = y;
        this.z = z;
        this.data = CONSTANTS.BLOCK_TYPES[this.type];
    }

    getKey() {
        return `${this.x},${this.y},${this.z}`;
    }

    static fromKey(key, type) {
        const [x, y, z] = key.split(',').map(Number);
        return new Block(type, x, y, z);
    }
}

// Block Storage and Management
class BlockMap {
    constructor() {
        this.blocks = new Map();
    }

    setBlock(x, y, z, type) {
        const key = `${x},${y},${z}`;
        if (type === 'air') {
            this.blocks.delete(key);
        } else {
            this.blocks.set(key, new Block(type, x, y, z));
        }
    }

    getBlock(x, y, z) {
        const key = `${x},${y},${z}`;
        return this.blocks.get(key) || new Block('air', x, y, z);
    }

    hasBlock(x, y, z) {
        const key = `${x},${y},${z}`;
        return this.blocks.has(key);
    }

    removeBlock(x, y, z) {
        const key = `${x},${y},${z}`;
        this.blocks.delete(key);
    }

    getNearbyBlocks(x, y, z, range) {
        const nearby = [];
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                for (let dz = -range; dz <= range; dz++) {
                    const block = this.getBlock(x + dx, y + dy, z + dz);
                    if (block.type !== 'air') {
                        nearby.push(block);
                    }
                }
            }
        }
        return nearby;
    }

    clear() {
        this.blocks.clear();
    }

    save() {
        const data = [];
        this.blocks.forEach((block, key) => {
            data.push({ key, type: block.type });
        });
        return JSON.stringify(data);
    }

    load(jsonData) {
        this.clear();
        try {
            const data = JSON.parse(jsonData);
            data.forEach(item => {
                const [x, y, z] = item.key.split(',').map(Number);
                this.setBlock(x, y, z, item.type);
            });
        } catch (e) {
            console.error('Error loading blocks:', e);
        }
    }

    getBlockCount() {
        return this.blocks.size;
    }

    getAllBlocks() {
        return Array.from(this.blocks.values());
    }
}

// 3D Block Mesh Generator
class BlockMesh {
    static createBlockMesh(block) {
        const geometry = new THREE.BoxGeometry(
            CONSTANTS.BLOCK_SIZE,
            CONSTANTS.BLOCK_SIZE,
            CONSTANTS.BLOCK_SIZE
        );

        const color = new THREE.Color(block.data.color);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.3,
            roughness: 0.8
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(block.x, block.y, block.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    static createBlockOutline(position) {
        const geometry = new THREE.BoxGeometry(
            CONSTANTS.BLOCK_SIZE + 0.05,
            CONSTANTS.BLOCK_SIZE + 0.05,
            CONSTANTS.BLOCK_SIZE + 0.05
        );

        const material = new THREE.LineBasicMaterial({
            color: 0xFFD700,
            linewidth: 3
        });

        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, material);
        line.position.copy(position);

        return line;
    }

    static createWater(block) {
        const geometry = new THREE.BoxGeometry(
            CONSTANTS.BLOCK_SIZE,
            CONSTANTS.BLOCK_SIZE,
            CONSTANTS.BLOCK_SIZE
        );

        const material = new THREE.MeshStandardMaterial({
            color: 0x4166F5,
            metalness: 0.5,
            roughness: 0.3,
            transparent: true,
            opacity: 0.7
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(block.x, block.y, block.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }
}
