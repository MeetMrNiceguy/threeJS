import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import init from './init';
import './style.css';

const { sizes, camera, scene, canvas, controls, renderer } = init();
camera.position.set(0, 2, 5);

// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(10, 10),
//   new THREE.MeshBasicMaterial({
//     color: 'white',
//     metalness: 0,
//     roughness: 0.5
//   }),
// );
// floor.receiveShadow = true;
// floor.rotation.x = -Math.PI * 0.5;
// floor.position.y = -1;
// scene.add(floor);

// Создаем направленный свет
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
 
// Настраиваем свойства теней
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 1000;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
 
// Добавляем направленный свет к сцене
scene.add(directionalLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const loader = new GLTFLoader();
const loadedModels = {}; // Object to store loaded models
const loadedTextures = {}; // Object to store loaded textures

let path = './models/onemore.glb';
let texturePath = './textures/';

loader.load(path, (gltf) => {
  const model = gltf.scene.children[0];
  scene.add(model);

  const buttons = document.querySelectorAll('button');

  const models = {
    naves: 1,
    stol: 2,
    furnit1: 3,
    furnit2: 4,
    bottle: 6
  };

  const textures = {
    texture1: 'texture1.jpg',
    texture2: 'texture2.jpg',
  };

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const id = this.id;
      if (loadedModels.hasOwnProperty(id)) {
        // If the model is already loaded, remove the child from the scene
        const child = loadedModels[id];
        scene.remove(child);
        delete loadedModels[id];
      } else {
        if (models.hasOwnProperty(id)) {
          const childIndex = models[id];
          loader.load(path, (gltf) => {
            const newChild = gltf.scene.children[childIndex];
            scene.add(newChild);
            loadedModels[id] = newChild;
          });
        }
      }
      console.log(id);
    });
  });

  // Function to apply texture to all objects in the scene
  function applyTexture(texture) {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.material.map = texture;
        object.material.needsUpdate = true;
      }
    });
  }

  // Load textures
  for (const key in textures) {
    if (textures.hasOwnProperty(key)) {
      const textureFile = textures[key];
      const texture = new THREE.TextureLoader().load(texturePath + textureFile);
      loadedTextures[key] = texture;
    }
  }

  // Button click event handler for changing textures
  const textureButtons = document.querySelectorAll('.texture-button');
  textureButtons.forEach(button => {
    button.addEventListener('click', function() {
      const textureId = this.id;
      if (loadedTextures.hasOwnProperty(textureId)) {
        const texture = loadedTextures[textureId];
        applyTexture(texture);
      }
    });
  });
});

// const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
// dirLight.position.set(-8, 12, 8);
// dirLight.castShadow = true;
// dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
// scene.add(dirLight);

// const loader = new GLTFLoader();
// let currentModel = null;
// let modelChildren = [];

// function updateButtonsCount(currentScene) {
//   const sceneChildren = currentScene.children;
//   const buttonsContainer = document.getElementById('buttonsContainer');
//   buttonsContainer.innerHTML = '';
//   modelChildren = [];

//   for (let i = 0; i < sceneChildren.length; i++) {
//     const child = sceneChildren[i];
//     const button = document.createElement('button');
//     button.className = 'activebut';
//     button.id = 'button' + i;
//     button.textContent = 'Показать дополнительно: ' + child.name;
//     buttonsContainer.appendChild(button);
//     button.addEventListener('click', () => loadChildModel(child));
//     modelChildren.push(child);
//   }
// }

// function loadChildModel(child) {
//   if (currentModel === child) {
//     deleteModel();
//   } else {
//     const path = child.userData.path;

//     if (path) {
//       deleteModel();
//       loadModel(path);
//     } else {
//       console.log("Путь к модели не найден");
//     }
//   }
// }

// function loadModel(path) {
//   if (currentModel) {
//     deleteModel();
//   }
//   const dotIndex = path.lastIndexOf('.');
//   if (dotIndex !== -1) {
//     const extension = path.substring(dotIndex + 1).toLowerCase();
//     if (extension === 'glb' || extension === 'gltf') {
//       loader.load(
//         path,
//         function (gltf) {
//           const model = gltf.scene;
//           if (model.children.length > 0) {
//             const child = model.children[0].clone();
//             scene.add(child);
//             currentModel = child;
//             renderer.render(scene, camera); 
//           }
//           model.traverse(function (child) {
//             if (child.isMesh) {
//               child.userData.path = path;
//             }
//           });
//           updateButtonsCount(model);
//           console.log("Модель успешно загружена");
//           renderer.render(scene, camera);

//         },
//         function (xhr) {
//           console.log((xhr.loaded / xhr.total) * 100 + "% загружено");
//         },
//         function (error) {
//           console.log("Ошибка загрузки модели:", error);
//         }
//       );
//     } else {
//       console.log("Неподдерживаемое расширение файла модели");
//     }
//   } else {
//     console.log("Неверный путь к файлу модели");
//   }
// }
// function deleteModel() {
//   if (currentModel) {
//     scene.remove(currentModel);
//     currentModel.traverse((object) =>{
//       if (object.isMesh) {
//         object.geometry.dispose();
//         object.material.dispose();
//       }
//     });
//     currentModel = null;
//     updateButtonsCount(scene);
//     console.log("Модель успешно удалена");
//   }
// }

// function buttonClick(event) {
//   const button = event.target;
//   const id = button.id;
//   const deleteButton = document.getElementById('deleteButton');
//   deleteButton.addEventListener('click', deleteModel);

//   const models = {
//     modelM: './models/Mka.glb',
//     naves: './models/tester.gltf',
//     stol: './models/modelM.glb'
//   };

//   if (models.hasOwnProperty(id)) {
//     const path = models[id];
//     loadModel(path);
//   } else {
//     console.log("Модель не найдена для данного id");
//   }
// }

// const buttons = document.querySelectorAll('.activebut');
// buttons.forEach((button) => {
//   button.addEventListener('click', buttonClick);
// });

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

/* Базовые обпаботчики событий длы поддержки ресайза */
window.addEventListener('resize', () => {
  // Обновляем размеры
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Обновляем соотношение сторон камеры
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Обновляем renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});

canvas.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
