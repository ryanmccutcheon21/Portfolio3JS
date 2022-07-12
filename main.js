import './style.css'
import * as THREE from 'three';
// add orbit controls that allow to move around the scene
// using a mouse
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene(); // container


// what human eye sees
// first arg is Field of View
// second arg is aspect ratio
// third & 4 are the view frustrum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


// make the magic happen 
// tell it which dom element to use
// the canvas we set in the index.html
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg')
});


// set renderer px ratio to the same as the window
renderer.setPixelRatio(window.devicePixelRatio);

// make it a full-screen canvas 
renderer.setSize(window.innerWidth, window.innerHeight);

// move camera from center of scene along the z axis
camera.position.setZ(30);


// add an object to the scene
// three basic steps
// 1st you need a Geometry
// the {x,y,z} points that makeup a shape
// three.js has built-in geometries for certain objects
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

// step 2
// create Material
// the wrapping paper for an object
// three.js has built-in materials
// can write custom shaders with WebGL
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
// this material doesn't require a light source


// step 3
// create a Mesh
// combines geometry with the material
const torus = new THREE.Mesh(geometry, material);

// Now add this object created in const torus to the scene
// scene.add(torus);

// add lighting
// see three.js docs for built-in lighting
// point light emits light in all direction to the scene
const pointLight = new THREE.PointLight(0xffffff);
// position light away from center by setting its xyz vals
pointLight.position.set(5, 5, 5);
// add light to the scene
// scene.add(pointLight);
// notice how it shows inside of donut shape
// can change light position to 20, 20, 20
// to scale it back and show the outside of the object

// can use ambient light to act a kind of a flood light
// and light the whole scene
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);
// lights everything in scene equally

// light helper will show us the position of the point light
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

// grid helper draws a 2d grid along the scene
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// instantiate orbit controls
// pass it the camera and renderer.domElement
// will listen to DOM events on the mouse and update
// the camera position accordingly
// call controls.update() in animate function loop to
// make sure this is updated in the UI
const controls = new OrbitControls(camera, renderer.domElement);


// randomly generate a bunch of objects to the scene
// this example will be a bumch of stars to simulate
// outer space
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // randomly generate xyz posittion for each star
  // makes array with 3 values and maps them to the
  //  to the three.js random float spread function
  // which is a helper function that randomly generates
  // a number between -100 & 100
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  // set position of star with these numbers
  star.position.set(x, y, z);

  // add stars to the scene
  scene.add(star);
}

// How many stars to add to the scene
// creates array with 200 values
// calls the addStar function on each value
Array(200).fill().forEach(addStar);


// giving the scene a background
const spaceTexture = new THREE.TextureLoader().load('shot-by-cerqueira-0o_GEzyargo-unsplash.jpg')
scene.background = spaceTexture;


// call the render method passing scene and camera as args
// renderer.render(scene, camera);
// Instead of calling this over and over
// we'll create a function that will rerender
// over and over
function animate() {
  // requestAnimationFrame is in the browser
  // tells the browser you want to perform an animation
  requestAnimationFrame(animate);

  // rotates it along x axis 0.01 for every
  // animation frame
  torus.rotation.x += 0.01;

  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();


  // whenever browser repaints the screen, it will call
  // the render method to update the UI
  renderer.render(scene, camera);
}

// call the function
animate();



// Avatar
// Texture Mapping
// Creates the astronaut cube

const avTexture = new THREE.TextureLoader().load('niketh-vellanki-QkSN_8XcXwQ-unsplash.jpg');
const av = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: avTexture })
);

scene.add(av);



// Moon
const moonTexture = new THREE.TextureLoader().load
  ('scott-webb-TOmVNJZN1AA-unsplash.jpg');
// get bump texture to make it look more realistic
// by having light bounce off
const normalTexture = new THREE.TextureLoader().load('velizar-ivanov-6i7m3VlzwuM-unsplash.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  // takes image and wraps it around the sphere
  // looks like the moon
  // I used cool red background to make a red moon
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
)

scene.add(moon);


// Make animation everytime user scrolls
moon.position.z = 30;
moon.position.setX(-10);

function moveCamera() {
  // 1st need to calculate where the user is currently
  // scrolled to using this 
  const t = document.body.getBoundingClientRect().top;
  // rotate the moon and avatar
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  av.rotation.y += 0.01;
  av.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

// fires function everytime a user scrolls
document.body.onscroll = moveCamera;