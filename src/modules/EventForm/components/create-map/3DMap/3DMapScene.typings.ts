import THREE from './index';

export type MeshType =
  | THREE.Mesh<
      THREE.BufferGeometry<THREE.NormalBufferAttributes>,
      THREE.ShaderMaterial | THREE.MeshStandardMaterial,
      THREE.Object3DEventMap
    >
  | THREE.Mesh<
      THREE.BoxGeometry,
      THREE.ShaderMaterial | THREE.MeshStandardMaterial,
      THREE.Object3DEventMap
    >;

export type MeshMaterialType =
  | THREE.MeshBasicMaterial
  | THREE.MeshPhongMaterial
  | THREE.MeshStandardMaterial
  | THREE.ShaderMaterial;

export type ThreeSceneProps = {
  containerId: string;
  reliefMesh: THREE.Mesh;
  reliefScale: number;
  meshs?: THREE.Mesh[];
  subdivideHandler: (
    subdivisionModifier: any
  ) => THREE.BufferGeometry<THREE.NormalBufferAttributes>;
  subdivideState?: boolean;
  currentDistanceYoffset: number;
};
