
import * as THREE from 'three'; 
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

type VertexHelperProps = {
  camera: THREE.PerspectiveCamera;
  mesh: THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.Material | THREE.Material[],
    THREE.Object3DEventMap
  >;
  mode: number;
  size: number;
  color: any;
};

type VertexIndexProps = {
  mesh: THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.ShaderMaterial | THREE.MeshStandardMaterial,
    THREE.Object3DEventMap
  >;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  font: Font;
};

export const vertexFaceNumbersHelper = ({
  camera,
  mesh,
  mode,
  size,
  color,
}: VertexHelperProps) => {
  // mode: 0 nothing, 1 vertex, 2 face, 3 vertex & face

  const positionCount = mesh.geometry.attributes.position.count;
  const faceCount = mesh.geometry.index!.array.length / 3;

  const vertexNumbers: THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.Material | THREE.Material[],
    THREE.Object3DEventMap
  >[] = [];
  const faceNumbers: THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.Material | THREE.Material[],
    THREE.Object3DEventMap
  >[] = [];
  const materialDigits = new THREE.LineBasicMaterial({ color: color });
  const geometryDigit = [];
  const digit: any = [];
  const digitPositions = [];
  //@ts-ignore
  let d100, d10, d1; // digits

  const coordDigit = []; // design of the digits
  coordDigit[0] = [0, 0, 0, 9, 6, 9, 6, 0, 0, 0];
  coordDigit[1] = [0, 6, 3, 9, 3, 0];
  coordDigit[2] = [0, 9, 6, 9, 6, 6, 0, 0, 6, 0];
  coordDigit[3] = [0, 9, 6, 9, 6, 5, 3, 5, 6, 5, 6, 0, 0, 0];
  coordDigit[4] = [0, 9, 0, 5, 6, 5, 3, 5, 3, 6, 3, 0];
  coordDigit[5] = [6, 9, 0, 9, 0, 5, 6, 5, 6, 0, 0, 0];
  coordDigit[6] = [6, 9, 0, 9, 0, 0, 6, 0, 6, 5, 0, 5];
  coordDigit[7] = [0, 9, 6, 9, 6, 6, 0, 0];
  coordDigit[8] = [0, 0, 0, 9, 6, 9, 6, 5, 0, 5, 6, 5, 6, 0, 0, 0];
  coordDigit[9] = [6, 5, 0, 5, 0, 9, 6, 9, 6, 0, 0, 0];

  for (let i = 0; i < 10; i++) {
    geometryDigit[i] = new THREE.BufferGeometry();

    digitPositions[i] = new Float32Array((coordDigit[i].length / 2) * 3);
    geometryDigit[i].setAttribute(
      'position',
      new THREE.BufferAttribute(digitPositions[i], 3)
    );

    for (let j = 0; j < coordDigit[i].length / 2; j++) {
      digitPositions[i][j * 3] = 0.1 * size * coordDigit[i][2 * j];
      digitPositions[i][j * 3 + 1] = 0.1 * size * coordDigit[i][2 * j + 1];
      digitPositions[i][j * 3 + 2] = 0;
    }

    digit[i] = new THREE.Line(geometryDigit[i], materialDigits);
  }

  // ......................................................

  const posArray = mesh.geometry.attributes.position.array;
  const indArray = mesh.geometry.index!.array;

  let x, y, z;

  if (mode === 1 || mode === 3) {
    for (let i = 0; i < positionCount; i++) {
      // number on board, up to three digits are pinned there

      const board = new THREE.Mesh(new THREE.BufferGeometry());

      numbering(board, i); // numbering the vertices, hundreds ...

      vertexNumbers.push(board); // place the table in the vertex numbering data field
      mesh.add(vertexNumbers[i]);
    }

    for (let n = 0; n < vertexNumbers.length; n++) {
      const n3 = 3 * n;
      vertexNumbers[n].position.set(
        posArray[n3],
        posArray[n3 + 1],
        posArray[n3 + 2]
      );
    }
  }

  if (mode === 2 || mode === 3) {
    for (let i = 0; i < faceCount; i++) {
      // number on board, up to three digits are pinned there

      const board = new THREE.Mesh(new THREE.BufferGeometry());

      numbering(board, i); // numbering the faces, hundreds ...

      faceNumbers.push(board); // place the table in the face numbering data field
      mesh.add(faceNumbers[i]);
    }

    for (let n = 0; n < faceNumbers.length; n++) {
      const n3 = 3 * n;

      x = 0;
      x += posArray[indArray[n3] * 3];
      x += posArray[indArray[n3 + 1] * 3];
      x += posArray[indArray[n3 + 2] * 3];
      x /= 3;

      y = 0;
      y += posArray[indArray[n3] * 3 + 1];
      y += posArray[indArray[n3 + 1] * 3 + 1];
      y += posArray[indArray[n3 + 2] * 3 + 1];
      y /= 3;

      z = 0;
      z += posArray[indArray[n3] * 3 + 2];
      z += posArray[indArray[n3 + 1] * 3 + 2];
      z += posArray[indArray[n3 + 2] * 3 + 2];
      z /= 3;

      faceNumbers[n].position.set(x, y, z);
    }
  }

  function numbering(
    board: THREE.Mesh<
      THREE.BufferGeometry<THREE.NormalBufferAttributes>,
      THREE.Material | THREE.Material[],
      THREE.Object3DEventMap
    >,
    i: any
  ) {
    const d = i.toString();
    const n = d.length;

    if (n === 3) {
      d100 = digit[d[0]].clone(); // digit for hundreds
      board.add(d100); //  on the board ...
      d100.position.x = -8 * 0.1 * size; // ... move slightly to the left

      d10 = digit[d[1]].clone(); // digit for tenth
      board.add(d10); //  on the board

      d1 = digit[d[2]].clone(); // digit
      board.add(d1); //  on the board ...
    } else if (n === 2) {
      d10 = digit[d[0]].clone(); // digit for tenth
      board.add(d10); //  on the board

      d1 = digit[d[1]].clone(); // digit
      board.add(d1); //  on the board ...
    } else if (n === 1) {
      d1 = digit[d[0]].clone(); // digit
      board.add(d1); //  on the board ...
    }

    d1!.position.x = 8 * 0.1 * size; // ... move slightly to the right
  }

  function update() {
    if (mode === 1 || mode === 3) {
      for (let n = 0; n < vertexNumbers.length; n++) {
        vertexNumbers[n].lookAt(camera.position);
      }
    }

    if (mode === 2 || mode === 3) {
      for (let n = 0; n < faceNumbers.length; n++) {
        faceNumbers[n].lookAt(camera.position);
      }
    }
  }

  return { update };
};

function vertexIndexTextGeometry({ mesh, camera, font, scene }: VertexIndexProps) {
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const geometry = mesh.geometry;
  const indexAttribute = geometry.index;
  // const vertexIndices = [];
  const positionAttribute = geometry.attributes.position;
  if (indexAttribute && font && scene && camera) {
    for (let i = 0; i < indexAttribute.count; i += 3) {
      const vertexIndices = [
        indexAttribute.array[i],
        indexAttribute.array[i + 1],
        indexAttribute.array[i + 2],
      ];

      vertexIndices.forEach(vertexIndex => {
        const vertexPosition = new THREE.Vector3();
        vertexPosition.fromBufferAttribute(positionAttribute, vertexIndex);

        const textGeometry = new TextGeometry(vertexIndex.toString(), {
          font: font,
          size: 0.02,
          height: 0.1,
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.copy(vertexPosition);
        scene.add(textMesh);

        textMesh.lookAt(camera.position);
      });
    }
  }
}
