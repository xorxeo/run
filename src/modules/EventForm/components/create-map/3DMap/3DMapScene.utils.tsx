import * as THREE from 'three';

import { geoMercator } from 'd3-geo';

export type PlaneGeoProps = {
  width?: number;
  depth?: number;
  widthSegments?: number;
  depthSegments?: number;
  verticesDef?: number[];
  firstCoord?: number[];
  lastCoord?: number[];
};

type UseRaycasterProps = {
  camera: THREE.PerspectiveCamera;
  meshs: THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.Material | THREE.Material[],
    THREE.Object3DEventMap
  >[];
};

export const rayCaster = ({ camera, meshs }: UseRaycasterProps) => {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function getPointerPosition(event: MouseEvent) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    // console.log('width, height', width, height);
    // const pointer = new THREE.Vector2();
    const { clientX, clientY } = event;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    // console.log('rect', rect)
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    return pointer;
  }

  function getIntersectWithMesh() {
    for (const mesh of meshs) {
      // const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObject(mesh);
    }
  }

  // Функция для изменения цвета пересекающихся вершин
  // const changeVertexColors = (
  //   intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]
  // ) => {
  //   if (intersects.length > 0) {
  //     const intersect = intersects[0];
  //     const face = intersect.face;
  //     const geometry = (intersect.object as THREE.Mesh)
  //       .geometry as THREE.BufferGeometry;
  //     if (geometry && geometry.isBufferGeometry) {
  //       // Создание или получение массива цветов
  //       if (!geometry.attributes.color) {
  //         const colors = new Float32Array(
  //           geometry.attributes.position.count * 3
  //         );
  //         geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  //       }

  //       const colors = geometry.attributes.color;

  //       // Назначение цветов вершинам
  //       const color = new THREE.Color(
  //         Math.random(),
  //         Math.random(),
  //         Math.random()
  //       );

  //       if (face) {
  //         colors.setXYZ(face.a, color.r, color.g, color.b);
  //         colors.setXYZ(face.b, color.r, color.g, color.b);
  //         colors.setXYZ(face.c, color.r, color.g, color.b);

  //         colors.needsUpdate = true;
  //         console.log('face, colors', face, colors);
  //       }
  //     }
  //   }
  // };

  // Функция для выделения рёбер пересекающегося треугольника
  const highlightEdges = (intersects: THREE.Intersection[]) => {
    const q = [] as THREE.Line[];
    if (intersects.length > 0) {
      const intersect = intersects[0];
      const face = intersect.face;
      const geometry = (intersect.object as THREE.Mesh)
        .geometry as THREE.BufferGeometry;

      if (geometry && geometry.isBufferGeometry && face) {
        // Получаем позиции вершин
        const positions = geometry.attributes.position;
        const vA = new THREE.Vector3().fromBufferAttribute(positions, face.a);
        const vB = new THREE.Vector3().fromBufferAttribute(positions, face.b);
        const vC = new THREE.Vector3().fromBufferAttribute(positions, face.c);

        // Создаем материал для линий
        const lineMaterial = new THREE.MeshStandardMaterial({ color: 'red' });

        // Создаем геометрию для линий и добавляем их к сцене
        const edges = [
          [vA, vB],
          [vB, vC],
          [vC, vA],
        ];

        edges.forEach(edge => {
          const edgeGeometry = new THREE.BufferGeometry().setFromPoints(edge);
          const edgeLine = new THREE.Line(edgeGeometry, lineMaterial);
          q.push(edgeLine);
        });
console.log('q', q)
        return q;
      }
    }
  };

  const handler = (event: MouseEvent) => {
    getPointerPosition(event);
    const intersect = getIntersectWithMesh();
    if (intersect && intersect.length > 0) {
      console.log('intersect', intersect[0].faceIndex);
      //   console.log('intersect in chsnge colors', intersect);
      //   changeVertexColors(intersect);
      // return highlightEdges(intersect);
    }
    // return intersect;
  };

  return handler;
};

// Функция для перевода координат объекта из градусов в метры
// export function normalizaCoordinates(
//   data: ElevationResponseResults,
//   aspectRatio: number
// ): NormalizedCoordinatesType {
//   const convertedData = [];
//   // console.log('data.results.length', data.results);
//   // for (let i = 0; i < data.results.length; i++) {
//   //   const point = data.results[i];
//   //   const latitudeInMeters = degreesToMeters(point.latitude);
//   //   const longitudeInMeters = degreesToMeters(point.longitude);

//   //   convertedData.push({
//   //     latitude: latitudeInMeters,
//   //     longitude: longitudeInMeters,
//   //     elevation: point.elevation + 6371000,
//   //   });
//   // }

//   // console.log('BEFORE NORMALIZE data', data);

//   const normalize = (arr: number[]) => {
//     let max = Math.max(...arr);
//     let min = Math.min(...arr);
//     let center = (max + min) / 2;
//     let result = arr.map(el => (el - center) / (max - min));

//     return result;
//   };

//   const normalizeXZ = (xArr: number[], zArr: number[], aspectRatio: number) => {
//     const xMax = Math.max(...xArr);
//     const xMin = Math.min(...xArr);
//     const xCenter = (xMax + xMin) / 2;
//     const zMax = Math.max(...zArr);
//     const zMin = Math.min(...zArr);
//     const zCenter = (zMax + zMin) / 2;

//     let normalizedX: number[];
//     let normalizedZ: number[];

//     if (aspectRatio > 1) {
//       normalizedX = xArr.map(
//         el => ((el - xCenter) / (xMax - xMin)) * aspectRatio
//       );
//       normalizedZ = zArr.map(el => (el - zCenter) / (zMax - zMin));
//     } else if (aspectRatio < 1) {
//       normalizedX = xArr.map(el => (el - xCenter) / (xMax - xMin));
//       normalizedZ = zArr.map(
//         el => (el - zCenter) / (zMax - zMin) / aspectRatio
//       );
//     } else {
//       normalizedX = xArr.map(el => (el - xCenter) / (xMax - xMin));
//       normalizedZ = zArr.map(el => (el - zCenter) / (zMax - zMin));
//     }

//     return [normalizedX, normalizedZ];
//   };

//   const normalizeY = (arr: number[]) => {
//     let max = Math.max(...arr);
//     let min = Math.min(...arr);
//     return arr.map(el => (el - min) / (max - min));
//   };

//   const normalizedData = (data: ElevationResponseResults) => {
//     const latitudeArray: number[] = [];
//     const longitudeArray: number[] = [];
//     const elevationArray: number[] = [];
//     // console.log('data', data);
//     data.results.forEach(obj => {
//       if (obj.latitude) {
//         latitudeArray.push(obj.latitude);
//       }

//       if (obj.longitude) {
//         longitudeArray.push(obj.longitude);
//       }

//       if (obj.elevation) {
//         elevationArray.push(obj.elevation);
//       }
//     });
//     // const normalizedLatitudeArray = normalize(latitudeArray);
//     // const normalizedLongitudeArray = normalize(longitudeArray);
//     const [normalizedLatitudeArray, normalizedLongitudeArray] = normalizeXZ(
//       longitudeArray,
//       latitudeArray,
//       aspectRatio
//     );
//     const normalizedElevationArray = normalizeY(elevationArray);
//     // console.log('normalizedLatitudeArray', normalizedLatitudeArray);
//     // console.log('normalizedLongitudeArray', normalizedLongitudeArray);
//     // console.log('elevationArray', elevationArray)
//     // console.log('normalizedElevationArray', normalizedElevationArray);

//     return {
//       normalizedLatitudeArray,
//       normalizedLongitudeArray,
//       normalizedElevationArray,
//     };
//   };
//   const normalized = normalizedData(data);
//   // console.log('normalized', normalized);
//   return normalized;
// }
