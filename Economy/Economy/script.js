
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

const rocketGeometry = new THREE.CylinderGeometry(1, 1, 5, 32);
const rocketMaterial = new THREE.MeshStandardMaterial({ color: "red" });
const rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
scene.add(rocket);


function createFin(type) {
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
    return new THREE.Mesh(geometry, material);
}


let fins = [];
function updateFins(type) {
    fins.forEach(fin => scene.remove(fin));
    fins = [];

    for (let i = 0; i < 3; i++) {
        const fin = createFin(type);
        fin.position.y = -2.5;
        fin.rotation.y = (i * Math.PI * 2) / 3;
        scene.add(fin);
        fins.push(fin);
    }
}


updateFins("classic");


document.getElementById("finSelector").addEventListener("change", function () {
    updateFins(this.value);
});


camera.position.z = 8;


function animate() {
    requestAnimationFrame(animate);
    rocket.rotation.y += 0.01;
    fins.forEach(fin => (fin.rotation.y += 0.01));
    renderer.render(scene, camera);
}
animate();
