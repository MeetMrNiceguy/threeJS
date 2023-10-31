import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene; // Объявление глобальной переменной scene

const init = () => {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  scene = new THREE.Scene(); // Инициализация глобальной переменной scene
  const canvas = document.querySelector('.canvas');
  canvas.style.marginTop = "80px";
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setClearColor(0xf5f5cc);
  renderer.render(scene, camera);

  return { sizes, scene, canvas, camera, renderer, controls };
};
export { scene };
export default init;