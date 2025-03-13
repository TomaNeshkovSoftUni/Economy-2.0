const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

let rocket, fins = [];

function createRocket(size) {
    if (rocket) scene.remove(rocket);

    let scale;
    if (size === "small") scale = 0.7;
    else if (size === "large") scale = 1.3;
    else scale = 1; // Medium (default)

    const geometry = new THREE.CylinderGeometry(1 * scale, 1 * scale, 5 * scale, 32);
    const material = new THREE.MeshStandardMaterial({ color: "red" });
    rocket = new THREE.Mesh(geometry, material);
    scene.add(rocket);

    updateFins(document.getElementById("finSelector").value, scale);
}

function createFin(type, scale) {
    const geometry = new THREE.BufferGeometry();
    let vertices;

    if (type === "classic") {
        vertices = new Float32Array([
            -1, 0, 0,
             1, 0, 0,
             0, 1.5, -2
        ]);
    } else if (type === "delta") {
        vertices = new Float32Array([
            -1, 0, 0,
             1, 0, 0,
             2, 2, -3
        ]);
    } else if (type === "curved") {
        vertices = new Float32Array([
            -1, 0, 0,
             1, 0, 0,
             0, 2, -2
        ]);
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

document.getElementById("finSelector").addEventListener("change", function () {
    updateFins(this.value, getCurrentScale());
});

document.getElementById("sizeSelector").addEventListener("change", function () {
    createRocket(this.value);
});

function getCurrentScale() {
    const size = document.getElementById("sizeSelector").value;
    return size === "small" ? 0.7 : size === "large" ? 1.3 : 1;
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
