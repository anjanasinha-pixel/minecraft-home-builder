// Camera System
class GameCamera {
    constructor(player, canvas) {
        this.player = player;
        this.canvas = canvas;

        // Create camera
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(
            CONSTANTS.CAMERA_FOV,
            width / height,
            CONSTANTS.CAMERA_NEAR,
            CONSTANTS.CAMERA_FAR
        );

        // Mouse lock
        this.isLocked = false;
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.pi2 = Math.PI / 2;

        this.setupMouseControls();
    }

    setupMouseControls() {
        document.addEventListener('pointerlockchange', () => {
            this.isLocked = document.pointerLockElement !== null;
        });

        this.canvas.addEventListener('click', () => {
            this.canvas.requestPointerLock();
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isLocked) {
                this.onMouseMove(e);
            }
        });
    }

    onMouseMove(event) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        this.euler.setFromQuaternion(this.camera.quaternion);
        this.euler.rotateY(-movementX * 0.002);
        this.euler.rotateX(-movementY * 0.002);

        this.euler.x = Math.max(-this.pi2, Math.min(this.pi2, this.euler.x));

        this.camera.quaternion.setFromEuler(this.euler);
    }

    update() {
        // Position camera at player's head position
        const cameraPosition = this.player.position.clone();
        cameraPosition.add(this.player.cameraOffset);
        
        this.camera.position.copy(cameraPosition);
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    getDirection() {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        return direction;
    }

    getCameraFront() {
        return this.getDirection();
    }

    unlock() {
        document.exitPointerLock();
    }

    lock() {
        this.canvas.requestPointerLock();
    }
}
