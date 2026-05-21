// Player System
class Player {
    constructor(id, name, color, scene) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.scene = scene;

        // Position and velocity
        this.position = new THREE.Vector3(0, CONSTANTS.GROUND_LEVEL + 2, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);

        // Movement
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.isJumping = false;
        this.isOnGround = false;

        // Animation
        this.walkAnimationTime = 0;
        this.armSwing = 0;

        // Body mesh
        this.bodyMesh = null;
        this.createBodyMesh();

        // Camera offset (first person)
        this.cameraOffset = new THREE.Vector3(0, CONSTANTS.PLAYER_HEIGHT * 0.7, 0);

        // Selected block type
        this.selectedBlockType = CONSTANTS.DEFAULT_BLOCK;
    }

    createBodyMesh() {
        // Create a composite mesh for the player body
        const group = new THREE.Group();

        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: CONSTANTS.PLAYERS[this.id].skinColor || 0xd4a574,
            metalness: 0.1,
            roughness: 0.8
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0.4;
        head.castShadow = true;
        head.receiveShadow = true;
        group.add(head);

        // Hair
        const hairGeometry = new THREE.SphereGeometry(0.27, 32, 32);
        const hairMaterial = new THREE.MeshStandardMaterial({
            color: CONSTANTS.PLAYERS[this.id].hairColor || 0x1a1a1a,
            metalness: 0,
            roughness: 1
        });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 0.48;
        hair.scale.y = 0.8;
        hair.castShadow = true;
        group.add(hair);

        // Body
        const bodyGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: CONSTANTS.PLAYERS[this.id].bodyColor || 0x4A90E2,
            metalness: 0.2,
            roughness: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.1;
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);

        // Left arm
        const armGeometry = new THREE.BoxGeometry(0.15, 0.4, 0.15);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: CONSTANTS.PLAYERS[this.id].skinColor || 0xd4a574,
            metalness: 0.1,
            roughness: 0.8
        });
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.25, 0.2, 0);
        leftArm.castShadow = true;
        group.add(leftArm);

        // Right arm
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.25, 0.2, 0);
        rightArm.castShadow = true;
        group.add(rightArm);

        // Left leg
        const legGeometry = new THREE.BoxGeometry(0.15, 0.4, 0.15);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            metalness: 0.2,
            roughness: 0.8
        });
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.15, -0.3, 0);
        leftLeg.castShadow = true;
        group.add(leftLeg);

        // Right leg
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.15, -0.3, 0);
        rightLeg.castShadow = true;
        group.add(rightLeg);

        // Eyes (for character)
        const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            metalness: 0.5,
            roughness: 0.3
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.08, 0.48, 0.23);
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.08, 0.48, 0.23);
        group.add(rightEye);

        // Smile (placeholder)
        const mouthGeometry = new THREE.TorusGeometry(0.05, 0.02, 8, 6, Math.PI);
        const mouthMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            metalness: 0,
            roughness: 1
        });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, 0.35, 0.25);
        mouth.rotation.x = Math.PI;
        mouth.scale.x = 0.6;
        group.add(mouth);

        group.scale.set(1, 1, 1);
        this.scene.add(group);
        this.bodyMesh = group;
    }

    update(deltaTime, world) {
        // Handle movement
        this.updateMovement(deltaTime);

        // Apply gravity
        this.velocity.y += CONSTANTS.GRAVITY * deltaTime;

        // Update position
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        // Ground collision
        const groundBlock = world.getBlockAtPosition(this.position);
        if (groundBlock.type !== 'air') {
            this.position.y = Math.max(this.position.y, CONSTANTS.GROUND_LEVEL + 1);
            this.velocity.y = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }

        // Boundary checking
        const halfSize = CONSTANTS.WORLD_SIZE / 2;
        this.position.x = Math.max(-halfSize, Math.min(halfSize, this.position.x));
        this.position.z = Math.max(-halfSize, Math.min(halfSize, this.position.z));

        // Update mesh position
        if (this.bodyMesh) {
            this.bodyMesh.position.copy(this.position);
        }

        // Update animation
        this.updateAnimation(deltaTime);
    }

    updateMovement(deltaTime) {
        const moveDirection = new THREE.Vector3(0, 0, 0);

        if (this.moveForward) moveDirection.z -= 1;
        if (this.moveBackward) moveDirection.z += 1;
        if (this.moveLeft) moveDirection.x -= 1;
        if (this.moveRight) moveDirection.x += 1;

        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            this.velocity.x = moveDirection.x * CONSTANTS.PLAYER_SPEED;
            this.velocity.z = moveDirection.z * CONSTANTS.PLAYER_SPEED;
        } else {
            this.velocity.x *= 0.95;
            this.velocity.z *= 0.95;
        }
    }

    updateAnimation(deltaTime) {
        // Walking animation
        const speed = Math.sqrt(
            this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z
        );

        if (speed > 0.01) {
            this.walkAnimationTime += deltaTime * speed * 5;
            const arms = this.bodyMesh.children.filter(
                (child, index) => index >= 3 && index <= 4
            );
            if (arms[0]) {
                arms[0].rotation.z = Math.sin(this.walkAnimationTime) * 0.4;
            }
            if (arms[1]) {
                arms[1].rotation.z = -Math.sin(this.walkAnimationTime) * 0.4;
            }
        }
    }

    jump() {
        if (this.isOnGround) {
            this.velocity.y = Math.sqrt(2 * Math.abs(CONSTANTS.GRAVITY) * 1.5);
            this.isOnGround = false;
        }
    }

    placeBlock(world, camera) {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(camera.quaternion);
        
        const raycaster = new THREE.Raycaster(camera.position, direction, 0, 10);
        const intersection = world.castRay(
            camera.position,
            direction,
            10
        );

        if (intersection) {
            const point = intersection.point;
            const normal = intersection.face.normal;
            
            // Calculate new block position
            const newPos = new THREE.Vector3();
            newPos.copy(normal);
            newPos.multiplyScalar(0.5);
            newPos.add(point);
            
            const x = Math.round(newPos.x);
            const y = Math.round(newPos.y);
            const z = Math.round(newPos.z);
            
            world.addBlock(x, y, z, this.selectedBlockType);
            this.showNotification(`Placed ${this.selectedBlockType} block!`);
        }
    }

    removeBlock(world, camera) {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(camera.quaternion);
        
        const intersection = world.castRay(
            camera.position,
            direction,
            10
        );

        if (intersection) {
            const point = intersection.point;
            const x = Math.round(point.x);
            const y = Math.round(point.y);
            const z = Math.round(point.z);
            
            world.removeBlock(x, y, z);
            this.showNotification(`Removed block!`);
        }
    }

    selectBlockType(blockType) {
        this.selectedBlockType = blockType;
        this.showNotification(`Selected ${blockType}!`);
    }

    showNotification(message) {
        // Will be handled by UI system
        window.dispatchEvent(new CustomEvent('playerNotification', { detail: { message } }));
    }

    dispose() {
        if (this.bodyMesh) {
            this.scene.remove(this.bodyMesh);
            this.bodyMesh.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
    }
}

// Player Manager
class PlayerManager {
    constructor(scene) {
        this.scene = scene;
        this.players = new Map();
    }

    createPlayer(id, name, color) {
        const player = new Player(id, name, color, this.scene);
        this.players.set(id, player);
        return player;
    }

    getPlayer(id) {
        return this.players.get(id);
    }

    updateAll(deltaTime, world) {
        this.players.forEach(player => {
            player.update(deltaTime, world);
        });
    }

    dispose() {
        this.players.forEach(player => {
            player.dispose();
        });
        this.players.clear();
    }
}
