import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const RobotModel = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const clock = new THREE.Clock();
    let model: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      25,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    currentMount.appendChild(renderer.domElement);

    // --- Luces ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      '/robot.glb',
      (gltf) => {
        model = gltf.scene;
        model.scale.set(1.3, 1.3, 1.3);
        model.position.y = -1.5;
        model.rotation.y = -Math.PI / 2;
        scene.add(model);

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.timeScale = 0.4;
          action.play();
        }

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const meshChild = child as THREE.Mesh;
            if (
              meshChild.material &&
              'emissiveIntensity' in meshChild.material
            ) {
              (
                meshChild.material as THREE.MeshStandardMaterial
              ).emissiveIntensity = 0;
            }
          }
        });

        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the model:', error);
        setIsLoading(false);
      }
    );

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      const deltaTime = clock.getDelta();

      if (mixer) mixer.update(deltaTime);

      if (model) {
        model.rotation.y = -Math.PI / 2 + mouseX * 0.5;
        model.rotation.x += (-mouseY * 0.5 - model.rotation.x) * 0.05;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isLoading && (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
        }}
      />
    </div>
  );
};

export default RobotModel;
