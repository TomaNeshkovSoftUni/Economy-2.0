const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

let rocket, fins = [], engine;

function createRocket(size) {
    if (rocket) scene.remove(rocket);

    let scale = getScaleFromSize(size);

    const geometry = new THREE.CylinderGeometry(1 * scale, 1 * scale, 5 * scale, 32);
    const material = new THREE.MeshStandardMaterial({ color: "red" });
    rocket = new THREE.Mesh(geometry, material);
    scene.add(rocket);

    updateFins(document.getElementById("finSelector").value, scale);
    createEngine(document.getElementById("engineSelector").value, scale);
}

function getScaleFromSize(size) {
    return size === "small" ? 0.7 : size === "large" ? 1.3 : 1;
}

function createFin(type, scale) {
    const geometry = new THREE.BufferGeometry();
    let vertices;

    if (type === "classic") {
        vertices = new Float32Array([-1, 0, 0, 1, 0, 0, 0, 1.5, -2]);
    } else if (type === "delta") {
        vertices = new Float32Array([-1, 0, 0, 1, 0, 0, 2, 2, -3]);
    } else if (type === "curved") {
        vertices = new Float32Array([-1, 0, 0, 1, 0, 0, 0, 2, -2]);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({ color: "blue", side: THREE.DoubleSide });
    const fin = new THREE.Mesh(geometry, material);

    fin.scale.set(scale, scale, scale);
    return fin;
}

function updateFins(type, scale = 1) {
    fins.forEach(fin => scene.remove(fin));
    fins = [];

    for (let i = 0; i < 3; i++) {
        const fin = createFin(type, scale);
        fin.position.y = (-2.5 * scale);
        fin.rotation.y = (i * Math.PI * 2) / 3;
        scene.add(fin);
        fins.push(fin);
    }
}

function createEngine(type, scale) {
    if (engine) scene.remove(engine);

    let geometry;
    const material = new THREE.MeshStandardMaterial({ color: "gray" });

    if (type === "basic") {
        geometry = new THREE.CylinderGeometry(0.5 * scale, 0.3 * scale, 1 * scale, 16);
    } else if (type === "boost") {
        geometry = new THREE.CylinderGeometry(0.7 * scale, 0.3 * scale, 1.2 * scale, 16);
    } else if (type === "ion") {
        geometry = new THREE.TorusGeometry(0.4 * scale, 0.1 * scale, 16, 100);
    }

    engine = new THREE.Mesh(geometry, material);
    engine.position.y = -3 * scale;

    if (type === "ion") engine.rotation.x = Math.PI / 2;

    scene.add(engine);
}

document.getElementById("finSelector").addEventListener("change", function () {
    updateFins(this.value, getCurrentScale());
});

document.getElementById("sizeSelector").addEventListener("change", function () {
    createRocket(this.value);
});

document.getElementById("engineSelector").addEventListener("change", function () {
    createEngine(this.value, getCurrentScale());
});

function getCurrentScale() {
    return getScaleFromSize(document.getElementById("sizeSelector").value);
}

camera.position.z = 8;
createRocket("medium");

function animate() {
    requestAnimationFrame(animate);
    if (rocket) rocket.rotation.y += 0.01;
    fins.forEach(fin => (fin.rotation.y += 0.01));
    renderer.render(scene, camera);
}
animate();
