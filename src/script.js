import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

/**
 * Base
 */

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();
const matcap1Texture = textureLoader.load("textures/matcaps/1.png");
const matcap2Texture = textureLoader.load("textures/matcaps/2.png");
const matcap3Texture = textureLoader.load("textures/matcaps/3.png");
const matcap4Texture = textureLoader.load("textures/matcaps/4.png");
const matcap5Texture = textureLoader.load("textures/matcaps/5.png");

/**
 * Parameters
 */

const parameters = {
  texture: matcap1Texture,
  font: null,
  size: 0.5,
  height: 0.5,
  curveSegments: 5,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.02,
  bevelOffset: 0,
  bevelSegments: 4,
  sphereRadius: 0.4,
  boxSize: 0.6,
  donutSize: 0.3,
  noOfItems: 300,
};

/**
 * Materials
 */

const material = new THREE.MeshMatcapMaterial({
  matcap: parameters.texture,
});

/**
 * Shapes
 */

// Helpers

const randomizeObjectPosition = (object) => {
  object.position.x = (Math.random() - 0.5) * 20;
  object.position.y = (Math.random() - 0.5) * 20;
  object.position.z = (Math.random() - 0.5) * 20;
};

const randomizeObjectRotation = (object) => {
  object.rotation.x = (Math.random() - 0.5) * Math.PI;
  object.rotation.y = (Math.random() - 0.5) * Math.PI;
};

const randomizeObjectScale = (object) => {
  const scale = Math.random();
  object.scale.set(scale, scale, scale);
};

// Spheres

const spheres = [];

const createSpheres = () => {
  for (let sphere of spheres) {
    scene.remove(sphere);
  }

  const sphereGeometry = new THREE.SphereGeometry(
    parameters.sphereRadius,
    20,
    45
  );

  for (let i = 0; i < Math.floor(parameters.noOfItems / 3); i++) {
    const sphere = new THREE.Mesh(sphereGeometry, material);
    spheres.push(sphere);
    randomizeObjectPosition(sphere);
    randomizeObjectRotation(sphere);
    randomizeObjectScale(sphere);
    scene.add(sphere);
  }
};

// Donuts

const donuts = [];

const createDonuts = () => {
  for (let donut of donuts) {
    scene.remove(donut);
  }

  const donutGeometry = new THREE.TorusGeometry(
    parameters.donutSize,
    parameters.donutSize * 0.5,
    20,
    45
  );

  for (let i = 0; i < Math.floor(parameters.noOfItems / 3); i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donuts.push(donut);
    randomizeObjectPosition(donut);
    randomizeObjectRotation(donut);
    randomizeObjectScale(donut);
    scene.add(donut);
  }
};

// Boxes

const boxes = [];

const createBoxes = () => {
  for (let box of boxes) {
    scene.remove(box);
  }

  const boxGeometry = new THREE.BoxGeometry(
    parameters.boxSize,
    parameters.boxSize,
    parameters.boxSize
  );

  for (let i = 0; i < Math.floor(parameters.noOfItems / 3); i++) {
    const box = new THREE.Mesh(boxGeometry, material);
    boxes.push(box);
    randomizeObjectPosition(box);
    randomizeObjectRotation(box);
    randomizeObjectScale(box);
    scene.add(box);
  }
};

const createAllShapes = () => {
  createSpheres();
  createBoxes();
  createDonuts();
};

/**
 * Fonts
 */
const fontLoader = new FontLoader();
let text;

const createText = () => {
  if (text) {
    scene.remove(text);
  }
  const textGeometry = new TextGeometry("HELLO WORLD :) \nI'm Vinay Kumar", {
    font: parameters.font,
    size: parameters.size,
    height: parameters.height,
    curveSegments: parameters.curveSegments,
    bevelEnabled: parameters.bevelEnabled,
    bevelThickness: parameters.bevelThickness,
    bevelSize: parameters.bevelSize,
    bevelOffset: parameters.bevelOffset,
    bevelSegments: parameters.bevelSegments,
  });
  textGeometry.center(); // * it centers the geometry, according to the bounding box. Equivalent of what we did above.
  text = new THREE.Mesh(textGeometry, material);

  scene.add(text);
};

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  parameters.font = font;
  createText();
  createAllShapes();
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0.5;
camera.position.y = -1;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const tick = () => {
  //Update according to parameters change
  material.matcap = parameters.texture;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
