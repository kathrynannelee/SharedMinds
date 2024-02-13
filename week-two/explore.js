import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
//for more modern version of orbit control user importmap https://stackoverflow.com/questions/75250424/threejs-orbitcontrol-import-version-from-cdn

const inputBox = document.createElement('input');
const canvas = document.getElementById('myCanvas');
inputBox.setAttribute('type', 'text');
inputBox.setAttribute('id', 'inputBox');
inputBox.setAttribute('placeholder', 'Enter thoughts here!');
inputBox.style.position = 'absolute';
inputBox.style.left = '50%';
inputBox.style.top = '50%';
inputBox.style.transform = 'translate(-50%, -50%)';
inputBox.style.zIndex = '100';
inputBox.style.fontSize = '30px';
inputBox.style.fontFamily = 'Arial';
document.body.appendChild(inputBox);

inputBox.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const inputValue = inputBox.value;
        const ctx = canvas.getContext('2d');
        ctx.font = '30px Arial';
        const inputBoxRect = inputBox.getBoundingClientRect();
        const x = inputBoxRect.left;
        const y = inputBoxRect.top;
        ctx.fillStyle = 'black';
        ctx.fillText(inputValue, x, y);
        inputBox.value = '';
    }
});

document.addEventListener('mousedown', (event) => {
    inputBox.style.left = event.clientX + 'px';
    inputBox.style.top = event.clientY + 'px';
});

let camera3D, scene, renderer, cube;
let controls;

function init3D() {
    scene = new THREE.Scene();
    camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
     
    // function createMaterial() {
    //     const material = new THREE.MeshPhongMaterial({
    //       side: THREE.DoubleSide,
    //     });
       
    //     const hue = Math.random();
    //     const saturation = 1;
    //     const luminance = .5;
    //     material.color.setHSL(hue, saturation, luminance);
       
    //     return material;
    //   }
    // const mesh = new THREE.Mesh(geometry, createMaterial());
    // addObject(x, y, mesh);
    // {
    //     const width = 8;
    //     const height = 8;
    //     const depth = 8;
    //     addSolidGeometry(-2, -2, new THREE.BoxGeometry(width, height, depth));
    // }
    // scene.add(mesh);

    let bgGeometery = new THREE.SphereGeometry(950, 60, 40);
    // let bgGeometery = new THREE.CylinderGeometry(725, 725, 1000, 10, 10, true)
    bgGeometery.scale(-1, 1, 1);
    // has to be power of 2 like (4096 x 2048) or(8192x4096).  i think it goes upside down because texture is not right size
    let panotexture = new THREE.TextureLoader().load("central-park.jpeg");
    // var material = new THREE.MeshBasicMaterial({ map: panotexture, transparent: true,   alphaTest: 0.02,opacity: 0.3});
    let backMaterial = new THREE.MeshBasicMaterial({ map: panotexture });

    let back = new THREE.Mesh(bgGeometery, backMaterial);
    scene.add(back);

    controls = new OrbitControls(camera3D, renderer.domElement);
    camera3D.position.z = 5;
    animate();
}

function animate() {
    controls.update();
    renderer.render(scene, camera3D);
    requestAnimationFrame(animate);
}
init3D();