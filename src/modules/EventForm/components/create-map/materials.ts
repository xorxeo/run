import { MeshMaterialType } from './3DMap/3DMapScene.typings';
import THREE from './3DMap/index';

export const getMaterial = () => {
  const SHADER = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
    fragmentShader: `
        varying vec2 vUv;
        void main() {
          float gray = .8 - vUv.x;
          gl_FragColor = vec4(gray, gray, gray, 1.0);
        }
      `,
    
  });
  SHADER.side = THREE.DoubleSide;

  const STANDART = new THREE.MeshStandardMaterial({
    color: 'green', // Цвет материала
    // roughness: 0.3, // Грубость поверхности (0 - гладкая, 1 - шероховатая)
    // metalness: 0.6, // Металличность материала (0 - неметаллический, 1 - металлический)
    // wireframe: true,
    // vertexColors: true,
  });
  STANDART.side = THREE.DoubleSide;

  const ENVIRONMENT = new THREE.ShaderMaterial({
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    void main() {
      float gray = 1.0 - vUv.y;
      gl_FragColor = vec4(gray, gray, gray, 1.0);
    }
  `,
  });
  ENVIRONMENT.side = THREE.BackSide;

  return { SHADER, STANDART, ENVIRONMENT };
};
