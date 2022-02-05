import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const gui = new dat.GUI();
const world = {
    plane: {
        width: 10,
        height: 10,
        widthSegments: 10, 
        heightSegments: 10,
    }
};
gui.add(world.plane, 'height', 1, 50).onChange(() => {
    generetePlane();
});
gui.add(world.plane, 'width', 1, 20).onChange(() => {
    generetePlane();
});
gui.add(world.plane, 'widthSegments', 1, 50).onChange(() => {
    generetePlane();
});
gui.add(world.plane, 'heightSegments', 1, 50).onChange(() => {
    generetePlane();
});

function generetePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments
    );
    
    let array = [];
    array = planeMesh.geometry.attributes.position.array;
    
    for (let i = 0; i < array.length; i += 3){
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];
    
        array[i + 2] = z + Math.random();
    }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;



const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const control = new OrbitControls(camera, renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

let array = [];
array = planeMesh.geometry.attributes.position.array;

for (let i = 0; i < array.length; i += 3){
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random();
}



const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backlight = new THREE.DirectionalLight(0xffffff, 1);
backlight.position.set(0, 0, -1);
scene.add(backlight);


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // planeMesh.rotation.x += 0.01;
   
};

animate();
