import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

const gui = new dat.GUI();
const world = {
    plane: {
        width: 400,
        height: 400,
        widthSegments: 50, 
        heightSegments: 50,
    }
};
gui.add(world.plane, 'height', 1, 1000).onChange(() => {
    generetePlane();
});
gui.add(world.plane, 'width', 1, 1000).onChange(() => {
    generetePlane();
});
gui.add(world.plane, 'widthSegments', 1, 200).onChange(() => {
    generetePlane();
});
gui.add(world.plane, 'heightSegments', 1, 200).onChange(() => {
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

    const colors = [];
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
        colors.push(0, 0.19, 0.4);
    }



    planeMesh.geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
}

const raycastser = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;



const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const control = new OrbitControls(camera, renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(400, 400, 50, 50);
const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

//vertice position randomisation
let array = [];
array = planeMesh.geometry.attributes.position.array;
const randomValues = [];
for (let i = 0; i < array.length; i++){

    if (i % 3 === 0) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];
    
        array[i] = x + (Math.random() - 0.5)*3;
        array[i + 1] = y + (Math.random() - 0.5)*3;
        array[i + 2] = z + (Math.random()-0.5)*3;
    }

    randomValues.push(Math.random()-0.5);
}


planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array;

planeMesh.geometry.attributes.position.randomValues = randomValues;


//color attribute addition
const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
    colors.push(0, 0.19, 0.4);
}



planeMesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
);






const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);

const backlight = new THREE.DirectionalLight(0xffffff, 1);
backlight.position.set(0, 0, -1);
scene.add(backlight);



const mouse = {
    x: undefined, 
    y: undefined
}

addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth)*2 -1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
})

let frame = 0;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    frame += 0.01;

    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position
    for (let i = 0; i < array.length; i += 3){
        
        //x
        array[i] = originalPosition[i] +
            Math.cos(frame + randomValues[i]) * 0.01;
        
        //y
        array[i+1] = originalPosition[i+1] +
            Math.sin(frame + randomValues[i+1]) * 0.01;

        
        
    }

    planeMesh.geometry.attributes.position.needsUpdate = true; 



    raycastser.setFromCamera(mouse, camera);
    const intersects = raycastser.intersectObject(planeMesh);
    
    if (intersects.length > 0) {
        const { color } = intersects[0].object.geometry.attributes;
        
        //vertice 1
        color.setX(intersects[0].face.a, 0.1);
        color.setY(intersects[0].face.a, 0.5);
        color.setZ(intersects[0].face.a, 1);

        //vertice 2
        color.setX(intersects[0].face.b, 0.1);
        color.setY(intersects[0].face.b, 0.5);
        color.setZ(intersects[0].face.b, 1);

        //vertice 3
        color.setX(intersects[0].face.c, 0.1);
        color.setY(intersects[0].face.c, 0.5);
        color.setZ(intersects[0].face.c, 1);

        color.needsUpdate = true;

        const initialColor = {
            r: 0,
            g: .19,
            b: .4
        };

        const hoverColor = {
            r: 0.1,
            g: .5,
            b: 1
        };

        gsap.to(hoverColor, {
            r:initialColor.r,
            g:initialColor.g,
            b: initialColor.b,
            onUpdate: () => {
                //vertice 1
                color.setX(intersects[0].face.a, hoverColor.r);
                color.setY(intersects[0].face.a, hoverColor.g);
                color.setZ(intersects[0].face.a, hoverColor.b);

                //vertice 2
                color.setX(intersects[0].face.b, hoverColor.r);
                color.setY(intersects[0].face.b, hoverColor.g);
                color.setZ(intersects[0].face.b, hoverColor.b);

                //vertice 3
                color.setX(intersects[0].face.c,hoverColor.r);
                color.setY(intersects[0].face.c, hoverColor.g);
                color.setZ(intersects[0].face.c, hoverColor.b);

                color.needsUpdate = true;
            }
        });
    }
   
};

animate();