'use client';

import THREE from './index';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';

import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { vertexFaceNumbersHelper } from '../../VertexHelper';
import { ThreeSceneProps } from './3DMapScene.typings';
import { getMaterial } from '../materials';
import { point } from 'leaflet';
import { rayCaster } from './3DMapScene.utils';
import { set } from 'zod';

export const Scene3DMap: FC<ThreeSceneProps> = ({
  containerId,
  reliefMesh,
  reliefScale,
  meshs,
  subdivideHandler,
  subdivideState,
  currentDistanceYoffset,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();

  const [container, setContainer] = useState<HTMLElement>();
  const [scene, setScene] = useState<THREE.Scene>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [{ width, height }, setSize] = useState({ width: 400, height: 400 });
  const [orbitControls, setOrbitControls] = useState<OrbitControls>();

  const [font, setFont] = useState<Font>();

  const [intersects, setIntersects] =
    useState<THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]>();

  const [meshArray, setMeshArray] = useState<THREE.Mesh[]>();

  const [material, setMaterial] = useState<THREE.ShaderMaterial>();

  // const [vertices, setVertices] = useState<Float32Array>();
  const [planeGeo, setPlaneGeo] = useState<
    THREE.BufferGeometry<THREE.NormalBufferAttributes> | undefined
  >();

  const [subDivBuffer, setSubDivbuffer] =
    useState<THREE.BufferGeometry<THREE.NormalBufferAttributes> | null>(null);

  const [vertexHelper, setVertexHelper] = useState<{ update: () => void }[]>(
    []
  );

  const handlerResizeContainer = useCallback(() => {
    if (camera && rendererRef.current && canvasRef.current && container) {
      // Update sizes
      const { clientWidth, clientHeight } = container;
      // Update camera
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      // Update renderer
      rendererRef.current.setSize(clientWidth, clientHeight);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }, [camera, container]);

  const [highlight, setHighlight] = useState<THREE.Line[]>([]);

  // SET SIZES
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (container) {
      setContainer(container);
      setSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    }
    return () => {
      window.removeEventListener('resize', handlerResizeContainer);
    };
  }, [containerId, handlerResizeContainer]);

  //RESIZE LISTENERS
  useEffect(() => {
    window.addEventListener('resize', handlerResizeContainer);
    return () => {
      window.removeEventListener('resize', handlerResizeContainer);
    };
  }, [handlerResizeContainer]);

  // SCENE && RAYCASTER
  useEffect(() => {
    const scenery = new THREE.Scene();

    setScene(scenery);

    setFont(new FontLoader().parse(helvetiker));
  }, []);

  // ENVIRONMENT & LIGHTS
  useEffect(() => {
    if (scene) {
      // Создаем геометрию и меш с материалом
      const geometryEnv = new THREE.SphereGeometry(12, 32, 32);
      const sphereMesh = new THREE.Mesh(geometryEnv, getMaterial().ENVIRONMENT);
      // scene.add(sphere);

      // Lights
      // Ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);

      // console.log('scene', scene);
      scene.add(ambientLight, sphereMesh);
    }

    // const light = new THREE.DirectionalLight(0xffffff, 0.5);
    // light.position.set(0, 0, 2);
    // scenery.add(light);

    // const helper = new THREE.DirectionalLightHelper(light, 2); // Размер хелпера
    // scenery.add(helper);

    // // Hemisphere light
    // const skyColor = 0x00bfff; // Set the sky color
    // const groundColor = 0xffffff; // Set the ground color
    // const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, 1); // Set the sky and ground colors and intensity
    // scenery.add(hemisphereLight);
  }, [scene]);

  // CREATE && SET MATERIAL FOR MAIN MESH
  useEffect(() => {
    if (scene && reliefMesh && !subDivBuffer) {
      // // console.log('planeGeo.uv', normals)
      // const shaderMaterial = new THREE.ShaderMaterial({
      //   vertexShader: `
      //   varying vec2 vUv;
      //   void main() {
      //     vUv = uv;
      //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      //   }
      // `,
      //   fragmentShader: `
      //   varying vec2 vUv;
      //   void main() {
      //     float gray = .8 - vUv.x;
      //     gl_FragColor = vec4(gray, gray, gray, 1.0);
      //   }
      // `,
      // });
      // shaderMaterial.side = THREE.DoubleSide;

      // const shaderMaterial = new THREE.MeshStandardMaterial({
      //   color: 0x808080, // Цвет материала
      //   roughness: 0.3, // Грубость поверхности (0 - гладкая, 1 - шероховатая)
      //   metalness: 0.6, // Металличность материала (0 - неметаллический, 1 - металлический)
      //   wireframe: true,
      // });
      // setMaterial(shaderMaterial);

      // const mesh = new THREE.Mesh(planeGeo, shaderMaterial);
      // mesh.scale.set(1, 1.5, 1);
      reliefMesh.scale.set(1, reliefScale, 1);
      scene.add(reliefMesh);
      // const normalsHelper = new VertexNormalsHelper(mesh[0], 1, 0xff0000);
      // scene.add(normalsHelper);
    }
    return () => {
      if (scene) scene.remove(reliefMesh);
    };
  }, [scene, reliefMesh, subDivBuffer]);

  useEffect(() => {
    console.log('meshs', meshs, currentDistanceYoffset);
    if (scene && meshs && meshs?.length > 0) {
      for (const mesh of meshs) {
        scene.add(mesh);
        mesh.position.set(0, currentDistanceYoffset, 0);
      }
    }
    return () => {
      if (scene && meshs && meshs?.length > 0) {
        for (const mesh of meshs) {
          // console.log('remove')
          scene?.remove(mesh);
        }
      }
    };
  }, [scene, meshs, currentDistanceYoffset]);

  // useEffect(() => {
  //   if (highlight) {
  //     for (const m of highlight) {
  //       scene?.add(m);
  //     }
  //   }
  // }, [scene, highlight]);
  //SUBDIVIDE
  // useEffect(() => {
  //   if (subDivBuffer && scene && mesh) {
  //     scene.remove(mesh);
  //     const newMesh = new THREE.Mesh(subDivBuffer, material);
  //     // newMesh.scale.set(1, 0.5, 1);
  //     setMesh(newMesh);
  //     scene.add(newMesh);
  //   }
  // }, [subDivBuffer]);

  useEffect(() => {
    if (subdivideState) {
      console.log('subdivideState', subdivideState);
      const q = subdivideHandler(planeGeo);
      q.computeVertexNormals();
      console.log('q', q);
      setSubDivbuffer(q);
    }
  }, [subdivideState]);

  // LISTEN RESIZE WINDOW
  useEffect(() => {
    handlerResizeContainer();
    // console.log('width, height', width, height)
  }, [height, width, camera, rendererRef.current]);

  //CAMERA && ORBIT CONTROL && AXES HELPER
  useEffect(() => {
    if (scene && canvasRef.current) {
      const perspectiveCamera = new THREE.PerspectiveCamera();
      perspectiveCamera.fov = 50;
      perspectiveCamera.aspect = width / height;
      perspectiveCamera.near = 0.1;
      perspectiveCamera.far = 100;
      perspectiveCamera.position.x = 0;
      perspectiveCamera.position.y = 0;
      perspectiveCamera.position.z = 3.5;
      perspectiveCamera.updateProjectionMatrix();

      setCamera(perspectiveCamera);
      scene.add(perspectiveCamera);

      const controls = new OrbitControls(perspectiveCamera, canvasRef.current);
      setOrbitControls(controls);

      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
    }
  }, [scene]);

  //WEBGL RENDERER
  useEffect(() => {
    if (canvasRef.current) {
      const webGLRenderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
      });
      webGLRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      webGLRenderer.setClearColor(0x000000, 1);

      rendererRef.current = webGLRenderer;
    }
  }, [canvasRef.current, width, height]);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setSize(width, height);
    }
  }, [width, height]);

  useEffect(() => {
    if (
      rendererRef.current &&
      scene &&
      camera &&
      // vertexHelper ISSUE  -  не рендерится сцена без меша, который ждет vertexHelper
      vertexHelper &&
      orbitControls
    ) {
      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // mesh.rotation.y = 0.2 * elapsedTime;
        // if (mousePosition.current.mouseX > 0) {
        //   mesh.rotation.y =
        //     mousePosition.current.mouseX * (elapsedTime * 0.0009);
        //   mesh.rotation.x =
        //     mousePosition.current.mouseY * (elapsedTime * 0.0009);
        // }
        // // update the picking ray with the camera and pointer position
        // raycaster.setFromCamera(pointer, camera);

        // // calculate objects intersecting the picking ray
        // setIntersects(raycaster.intersectObjects(meshs));

        // Render

        vertexHelper.map(help => help.update());

        rendererRef.current?.render(scene, camera);
        orbitControls?.update();
        window.requestAnimationFrame(tick);
      };

      tick();
    }
  }, [scene, camera, orbitControls, vertexHelper]);

  // CHANGING relief scale Y from Map Editor
  useEffect(() => {
    reliefMesh.scale.set(1, reliefScale, 1);

    // meshs?.map(mesh => mesh.scale.set(1, reliefScale, 1));
  }, [reliefScale]);

  //SET RAYCASTER LISTENER ON CANVAS REF
  useEffect(() => {
    if (canvasRef.current && camera && meshs) {
      console.log('ffffff');
      canvasRef.current.addEventListener('click', e => {
        const q = rayCaster({ camera, meshs })(e);
        // if (q) {
        //   for (let elem of q) {
        //     console.log('elem', elem);
        //     setHighlight(prev => [...prev, elem]);
        //     // scene?.add(elem);
        //   }
        // }
      });
    }
  }, [camera, meshs, scene]);

  // useEffect(() => {
  //   if (intersects && intersects.length > 0 && meshs) {
  //     const faceIndex = intersects[0].faceIndex;
  //     console.log('faceIndex', faceIndex);
  //     const geometry = meshs[0].geometry;
  //     if (geometry && faceIndex! >= 0) {
  //       const vertexIndices = [
  //         geometry.index!.array[faceIndex! * 3],
  //         geometry.index!.array[faceIndex! * 3 + 1],
  //         geometry.index!.array[faceIndex! * 3 + 2],
  //       ];
  //       console.log(vertexIndices);
  //       console.log('intersects', intersects);
  //     }
  //   }
  // }, [intersects, meshs]);

  //VERTEX HELPER
  // useEffect(() => {
  //   // console.log('reliefMesh', reliefMesh)
  //   if (meshs && meshs?.length > 0 && camera) {
  //     const q = meshs?.map(item =>
  //       vertexFaceNumbersHelper({
  //         camera,
  //         mesh: item,
  //         color: 0x0022ee,
  //         mode: 1,
  //         size: 0.05,
  //       })
  //     );
  //     setVertexHelper(q);
  //   }
  // }, [camera, meshs]);

  //RELIEF HELPERS
  useEffect(() => {
    if (reliefMesh && camera) {
      const q = vertexFaceNumbersHelper({
        camera,
        mesh: reliefMesh,
        color: 0x000000,
        mode: 1,
        size: 0.02,
      });
      setVertexHelper(prev => [...prev, q]);
    }
  }, [reliefMesh, camera]);

  //LOG INTERSECTS
  // useEffect(() => {
  //   if (mesh && intersects && intersects.length > 0) {
  //     const faceIndex = intersects[0].faceIndex;
  //     console.log('faceIndex', faceIndex);
  //     const geometry = mesh.geometry;
  //     if (geometry && faceIndex! >= 0) {
  //       const vertexIndices = [
  //         geometry.index!.array[faceIndex! * 3],
  //         geometry.index!.array[faceIndex! * 3 + 1],
  //         geometry.index!.array[faceIndex! * 3 + 2],
  //       ];
  //       console.log(vertexIndices);
  //       console.log('intersects', intersects);
  //     }
  //   }
  // }, [mesh, intersects]);
  return (
    <canvas
      className="rounded-lg bg-gray-400  "
      // style={{
      //   position: 'fixed',
      //   top: 0,
      //   bottom: 0,
      //   left: 0,
      //   right: 0,
      // }}
      ref={canvasRef}
    />
  );
};
