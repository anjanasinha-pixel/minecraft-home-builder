// World System
class World {
    constructor(scene) {
        this.scene = scene;
        this.blockMap = new BlockMap();
        this.meshes = new Map();
        this.visibleChunks = new Set();
        this.loadedChunks = new Set();
        this.chunkSize = CONSTANTS.CHUNK_SIZE;
        
        this.initializeWorld();
        this.createEnvironment();
    }

    initializeWorld() {
        // Generate terrain
        this.generateTerrain();
        this.buildInitialStructure();
    }

    generateTerrain() {
        const groundLevel = CONSTANTS.GROUND_LEVEL;
        const size = CONSTANTS.WORLD_SIZE;

        // Create grass and dirt ground
        for (let x = -size / 2; x < size / 2; x++) {
            for (let z = -size / 2; z < size / 2; z++) {
                for (let y = 0; y < groundLevel; y++) {
                    if (y === groundLevel - 1) {
                        this.blockMap.setBlock(x, y, z, 'grass');
                    } else if (y >= groundLevel - 4) {
                        this.blockMap.setBlock(x, y, z, 'dirt');
                    } else {
                        this.blockMap.setBlock(x, y, z, 'stone');
                    }
                }
            }
        }

        // Add some sand near edges for decoration
        for (let x = -size / 2; x < -size / 2 + 5; x++) {
            for (let z = -size / 2; z < size / 2; z++) {
                this.blockMap.setBlock(x, groundLevel - 1, z, 'sand');
            }
        }
    }

    buildInitialStructure() {
        const x = -10;
        const y = CONSTANTS.GROUND_LEVEL;
        const z = 0;

        // Build a simple starting house
        // Foundation
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                this.blockMap.setBlock(x + i, y, z + j, 'stone');
            }
        }

        // Walls
        for (let i = 0; i < 6; i++) {
            this.blockMap.setBlock(x + i, y + 1, z, 'brick');
            this.blockMap.setBlock(x + i, y + 1, z + 5, 'brick');
            this.blockMap.setBlock(x, y + 1, z + i, 'brick');
            this.blockMap.setBlock(x + 5, y + 1, z + i, 'brick');
        }

        for (let i = 0; i < 6; i++) {
            this.blockMap.setBlock(x + i, y + 2, z, 'brick');
            this.blockMap.setBlock(x + i, y + 2, z + 5, 'brick');
            this.blockMap.setBlock(x, y + 2, z + i, 'brick');
            this.blockMap.setBlock(x + 5, y + 2, z + i, 'brick');
        }

        // Door opening (remove blocks)
        this.blockMap.removeBlock(x + 1, y + 1, z);

        // Roof
        for (let i = 0; i < 6; i++) {
            this.blockMap.setBlock(x + i, y + 3, z, 'wood');
            this.blockMap.setBlock(x + i, y + 3, z + 5, 'wood');
        }

        // Add interior furniture with sand
        this.blockMap.setBlock(x + 2, y + 1, z + 2, 'sand');
        this.blockMap.setBlock(x + 3, y + 1, z + 2, 'sand');
        this.blockMap.setBlock(x + 2, y + 1, z + 3, 'wood');
    }

    createEnvironment() {
        // Add lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(50, 50, 50);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.left = -100;
        light.shadow.camera.right = 100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        light.shadow.camera.far = 500;
        this.scene.add(light);

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Sky
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
    }

    addBlock(x, y, z, type) {
        this.blockMap.setBlock(x, y, z, type);
        this.updateBlockMesh(x, y, z);
        return true;
    }

    removeBlock(x, y, z) {
        this.blockMap.removeBlock(x, y, z);
        this.removeMesh(x, y, z);
        return true;
    }

    updateBlockMesh(x, y, z) {
        const key = `${x},${y},${z}`;
        const block = this.blockMap.getBlock(x, y, z);

        // Remove old mesh
        if (this.meshes.has(key)) {
            const oldMesh = this.meshes.get(key);
            this.scene.remove(oldMesh);
            oldMesh.geometry.dispose();
            oldMesh.material.dispose();
        }

        if (block.type !== 'air') {
            // Create and add new mesh
            const mesh = BlockMesh.createBlockMesh(block);
            this.meshes.set(key, mesh);
            this.scene.add(mesh);
        }
    }

    removeMesh(x, y, z) {
        const key = `${x},${y},${z}`;
        if (this.meshes.has(key)) {
            const mesh = this.meshes.get(key);
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            this.meshes.delete(key);
        }
    }

    renderVisibleBlocks(cameraPosition) {
        const renderDistance = CONSTANTS.RENDER_DISTANCE;
        const blocks = this.blockMap.getNearbyBlocks(
            Math.round(cameraPosition.x),
            Math.round(cameraPosition.y),
            Math.round(cameraPosition.z),
            renderDistance
        );

        blocks.forEach(block => {
            const key = block.getKey();
            if (!this.meshes.has(key)) {
                this.updateBlockMesh(block.x, block.y, block.z);
            }
        });

        // Remove blocks outside render distance
        const toRemove = [];
        this.meshes.forEach((mesh, key) => {
            const [x, y, z] = key.split(',').map(Number);
            const distance = Math.sqrt(
                Math.pow(x - cameraPosition.x, 2) +
                Math.pow(y - cameraPosition.y, 2) +
                Math.pow(z - cameraPosition.z, 2)
            );
            if (distance > renderDistance * 1.5) {
                toRemove.push(key);
            }
        });

        toRemove.forEach(key => {
            const mesh = this.meshes.get(key);
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            this.meshes.delete(key);
        });
    }

    getBlockAtPosition(position) {
        const x = Math.round(position.x);
        const y = Math.round(position.y);
        const z = Math.round(position.z);
        return this.blockMap.getBlock(x, y, z);
    }

    castRay(origin, direction, maxDistance = 100) {
        const raycaster = new THREE.Raycaster(origin, direction, 0, maxDistance);
        const intersects = raycaster.intersectObjects(Array.from(this.meshes.values()));

        if (intersects.length > 0) {
            return intersects[0];
        }
        return null;
    }

    save() {
        return this.blockMap.save();
    }

    load(data) {
        this.blockMap.load(data);
        // Refresh all meshes
        this.meshes.forEach((mesh) => {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
        this.meshes.clear();
    }

    getStats() {
        return {
            blockCount: this.blockMap.getBlockCount(),
            meshCount: this.meshes.size
        };
    }
}
