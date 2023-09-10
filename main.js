import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 30);

renderer.render( scene, camera);

const loader = new THREE.TextureLoader();
const globeTexture = loader.load('Albedo.jpeg');


// 3D地球モデルの作成
const globeGeometry = new THREE.SphereGeometry(15, 32, 32);  // 半径、幅のセグメント数、高さのセグメント数
const globeMaterial = new THREE.MeshBasicMaterial({ map: globeTexture });
const globe = new THREE.Mesh(globeGeometry, globeMaterial);

// 地球をシーンに追加
scene.add(globe);


const controls = new OrbitControls(camera, renderer.domElement);

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', function(e) {
  mouse.x = (e.clientX / this.window.innerWidth) * 2 - 1;
  mouse.x = (e.clientY / this.window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

window.addEventListener('click', function(e) {
  const sphereGeometry = new THREE.SphereGeometry(0.125, 30, 30);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFEA00,
    metalness: 0,
    roughness: 0
  });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphereMesh);
  sphereMesh.position.copy(intersectionPoint);
});





function addStar() {
  const globeGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const globeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff})
  const star = new THREE.Mesh(globeGeometry, globeMaterial);

  const [x, y, z] = Array(3).fill().map(() => 
  THREE.MathUtils.randFloatSpread( 100 ));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('black.jpg')
scene.background = spaceTexture;

function animate() {
  requestAnimationFrame(animate);

  globe.rotation.x += 0.0001;
  globe.rotation.y += 0.0001;
  globe.rotation.z += 0.0001;

  controls.update();

  renderer.render(scene, camera);
}

renderer.render(scene, camera);

animate()



