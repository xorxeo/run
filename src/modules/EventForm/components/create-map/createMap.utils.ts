import THREE from './3DMap/index';
import { REQUEST_ELEVATION_URL } from './createMap.consts';
import {
  AreaCoordinates,
  CalculateGeometryReturnData,
  CreateTHREEGeometryBufferProps,
  RequestElevationData,
  ResponseElevationResults,
  GeometryGrid,
  NormalizedCoordinatesType,
  CreateGeometryPropsType,
  CreateGeometryReturnType,
  GeoCoordinates,
  NormalizeCoordinatesProps,
  CreatePolygonFromLineProps,
  DistanceLineCoordinates,
} from './createMap.typings';

// export function addThick(
//   indices: number[],
//   // vertices: NormalizedCoordinatesType
// ) {
//   const filteredIndices = new Set(indices);
//   const indicesArray = Array.from(filteredIndices);
//   console.log('indicesArray', indicesArray)
//   // return vertices.normalizedElevationArray.map((elevation, index) => {
//   //   if (filteredIndices.has(index)) {
//   //     return -1;
//   //   } else {
//   //     return elevation;
//   //   }
//   // });
// }

export const createTHREEGeometryBuffer = ({
  vertices,
  indices,
  normals,
  uvs,
}: CreateTHREEGeometryBufferProps) => {
  // console.log('THREE vertices', vertices)
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.computeVertexNormals();
  // if (normals) {
  //   geometry.setAttribute(
  //     'normal',
  //     new THREE.Float32BufferAttribute(normals, 3)
  //   );
  // }
  if (uvs) {
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  }
  geometry.setIndex(indices);
  // console.log('geometry', geometry);

  return geometry;
};

export async function calculateReliefCoordinates({
  firstCoord,
  lastCoord,
  segments,
  aspectRatio,
}: GeometryGrid) {
  //1 coordinate latitude - Z
  //2 coordinate longitude - X
  let width = 1;
  let depth = 1;

  let gridX, gridZ;
  // console.log('firstCoord, lastCoord', firstCoord, lastCoord);
  if (aspectRatio < 1) {
    // console.log('aspectRatio < 1', aspectRatio < 1);

    depth = width * (1 / aspectRatio);
    gridZ = Math.ceil(segments / aspectRatio);
    gridX = segments;
  } else if (aspectRatio > 1) {
    width = depth * aspectRatio;
    gridX = Math.ceil(segments * aspectRatio);
    gridZ = segments;
  } else {
    gridX = gridZ = segments;
  }
  // console.log('segments, aspectRatio', segments, aspectRatio);
  const widthHalf = width / 2;
  const depthHalf = depth / 2;
  const gridX1 = gridX + 1;
  const gridZ1 = gridZ + 1;
  const segmentWidth = width / gridX;
  const segmentDepth = depth / gridZ;
  const vertices = [] as number[];
  const indices = [] as number[];

  const coords: RequestElevationData = { locations: [] };

  const normals = [];
  const uvs = [];
  let elevationResponse = {} as ResponseElevationResults;

  let edgeIndices = [];

  // calc vertices & uvs & normals & geographic coords
  for (let iZ = gridZ1 - 1; iZ >= 0; iZ--) {
    const z = (gridZ1 - 1 - iZ) * segmentDepth - depthHalf;
    const latitude =
      firstCoord[0] +
      (lastCoord[0] - firstCoord[0]) * ((gridZ1 - 1 - iZ) / (gridZ1 - 1));

    for (let iX = 0; iX < gridX1; iX++) {
      const x = iX * segmentWidth - widthHalf;
      const longitude =
        firstCoord[1] + (lastCoord[1] - firstCoord[1]) * (iX / (gridX1 - 1));

      coords.locations.push({ latitude, longitude });

      vertices.push(x, 0, z);
      uvs.push(iX / gridX);
      uvs.push(1 - (gridZ1 - 1 - iZ) / gridZ);
      normals.push(0, 0, 1);

      if (iZ === gridZ1 - 1 || iZ === 0) {
        edgeIndices.push(vertices.length / 3 - 1);
      }
      if (iX === 0 || iX === gridX1 - 1) {
        edgeIndices.push(vertices.length / 3 - 1);
      }
    }
  }
  // calc indices
  for (let iZ = 0; iZ < gridZ; iZ++) {
    for (let iX = 0; iX < gridX; iX++) {
      const a = iX + gridX1 * iZ;
      const b = iX + 1 + gridX1 * iZ;
      const c = iX + gridX1 * (iZ + 1);
      const d = iX + 1 + gridX1 * (iZ + 1);
      indices.push(a, b, d);
      indices.push(d, c, a);
    }
  }
  const responseElevationY = await requestElevation(coords);

  console.log('vertices', vertices.length / 3);
  console.log('vertices', vertices);
  console.log('indices', indices.length);
  console.log('indices', indices);

  if ('results' in responseElevationY) {
    elevationResponse = responseElevationY;

    const normalizedCoordinates = normalizeCoordinates({
      data: elevationResponse,
      aspectRatio,
    });
    // console.log('edgeIndices ', edgeIndices);
    return {
      coords,
      vertices,
      uvs,
      normals,
      indices,
      elevationResponse,
      normalizedCoordinates,
      edgeIndices,
      gridX1,
      gridZ1,
    };
  } else {
    return responseElevationY; // as Error
  }
}

export const calculateLinesCoordinates = async (
  pointCoordinates: GeoCoordinates[],
  aspectRatio: number,
  areaCoordinates: AreaCoordinates
) => {
  const elevationResponse = await requestElevation({
    locations: pointCoordinates,
  });

  if ('results' in elevationResponse) {
    const normalizedCoordinates = normalizeCoordinates({
      data: elevationResponse,
      aspectRatio,
      areaCoordinates,
    });
    return {
      normalizedCoordinates,
      elevationResponse,
    };
  } else {
    return elevationResponse; // as Error
  }
};

export function createPositionsArray(
  normalizedCoords: NormalizedCoordinatesType
): number[] {
  const positions: number[] = [];

  normalizedCoords.normalizedLatitudeArray.map((latitude, index) => {
    const positionIndex = index * 3;
    positions[positionIndex] = latitude / 3;
    positions[positionIndex + 1] =
      normalizedCoords.normalizedElevationArray[index] / 3;
    positions[positionIndex + 2] =
      normalizedCoords.normalizedLongitudeArray[index] / 3;
  });

  return positions;
}

const requestElevation = async (
  data: RequestElevationData
): Promise<ResponseElevationResults | Error> => {
  const url = REQUEST_ELEVATION_URL;
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify(data),
  };
  let result, fetchError;
  try {
    const response = await fetch(url, fetchOptions);
    result = await response.json();
    return result;
  } catch (error) {
    console.warn('error', error);
    fetchError = error as Error;
    return fetchError;
  }
};

export function normalizeCoordinates({
  data,
  aspectRatio,
  areaCoordinates,
}: NormalizeCoordinatesProps): NormalizedCoordinatesType {
  // console.log('data', data);

  const normalize = (arr: number[]) => {
    let max = Math.max(...arr);
    let min = Math.min(...arr);
    let center = (max + min) / 2;
    let result = arr.map(el => (el - center) / (max - min));

    return result;
  };

  const normalizeXZ = (xArr: number[], zArr: number[], aspectRatio: number) => {
    let xMax: number,
      xMin: number,
      zMax: number,
      zMin: number,
      xCenter: number,
      zCenter: number;
    if (areaCoordinates) {
      xMax = areaCoordinates.lastCoord[1];
      xMin = areaCoordinates.firstCoord[1];
      zMax = areaCoordinates.lastCoord[0];
      zMin = areaCoordinates.firstCoord[0];
      xCenter = (xMax + xMin) / 2;
      zCenter = (zMax + zMin) / 2;
    } else if (!areaCoordinates) {
      xMax = Math.max(...xArr);
      xMin = Math.min(...xArr);
      zMax = Math.max(...zArr);
      zMin = Math.min(...zArr);
      xCenter = (xMax + xMin) / 2;
      zCenter = (zMax + zMin) / 2;
    }

    let normalizedX: number[];
    let normalizedZ: number[];

    if (aspectRatio > 1) {
      normalizedX = xArr.map(
        el => ((el - xCenter) / (xMax - xMin)) * aspectRatio
      );
      normalizedZ = zArr.map(el => (-1 * (el - zCenter)) / (zMax - zMin));
    } else if (aspectRatio < 1) {
      normalizedX = xArr.map(el => (el - xCenter) / (xMax - xMin));
      // console.log('normalizedX', normalizedX);
      normalizedZ = zArr.map(
        el => -1 * ((el - zCenter) / (zMax - zMin)) * (1 / aspectRatio)
      );
      // console.log('normalizedZ', normalizedZ);
    } else {
      normalizedX = xArr.map(el => (el - xCenter) / (xMax - xMin));
      normalizedZ = zArr.map(el => (el - zCenter) / (zMax - zMin));
    }

    return [normalizedX, normalizedZ];
  };

  const normalizeY = (arr: number[]) => {
    let max = 8848;
    // let max = Math.max(...arr);
    let min = Math.min(...arr);
    return arr.map(el => (el - min) / (max - min));
  };

  const normalizedData = (data: ResponseElevationResults) => {
    const latitudeArray: number[] = [];
    const longitudeArray: number[] = [];
    const elevationArray: number[] = [];
    // console.log('data', data.results);

    data.results.forEach((obj, idx) => {
      if (obj.latitude) {
        latitudeArray.push(obj.latitude);
      }

      if (obj.longitude) {
        longitudeArray.push(obj.longitude);
      }

      if (obj.elevation) {
        // console.log('>>>>>>>>>>> obj.elevation', obj.elevation);
        //  console.log('>>>>>>>>>>> obj.elevation + offset', obj.elevation + offset!);
        // offset
        //   ? elevationArray.push((obj.elevation + offset))
        //   :
        elevationArray.push(obj.elevation);
      }
    });

    // console.log('elevationArray', elevationArray.length);

    const [normalizedLatitudeArray, normalizedLongitudeArray] = normalizeXZ(
      longitudeArray,
      latitudeArray,
      aspectRatio
    );
    const normalizedElevationArray = normalizeY(elevationArray);

    return {
      normalizedLatitudeArray,
      normalizedLongitudeArray,
      normalizedElevationArray,
    };
  };
  const normalized = normalizedData(data);
  // console.log('normalized', normalized);
  return normalized;
}

export function updateLinesCoorfinates(
  LineCoordinates: DistanceLineCoordinates[],
  offset: number
) {
 return LineCoordinates.map(line =>
    line.normalizedPointsCoordinates?.normalizedElevationArray.map(
      elevation => (elevation += offset)
    )
  );
}

export function addThickVertices(
  coordinates: NormalizedCoordinatesType,
  width: number,
  depth: number
) {
  const {
    normalizedLatitudeArray,
    normalizedLongitudeArray,
    normalizedElevationArray,
  } = coordinates;
  const vertices = [];
  const indices = [];
  let currentVerticesIndex = normalizedElevationArray.length;
  const verticesLength = normalizedElevationArray.length;

  for (let i = 1; i <= width; i++) {
    vertices.push(
      normalizedLatitudeArray[i - 1],
      -0.1,
      normalizedLongitudeArray[i - 1]
    );
    if (i < width) {
      indices.push(
        i - 1,
        currentVerticesIndex,
        currentVerticesIndex + 1,
        currentVerticesIndex + 1,
        i,
        i - 1
      );
      currentVerticesIndex += 1;
    }
  }

  for (let i = 1; i < depth; i++) {
    vertices.push(
      normalizedLatitudeArray[i * width + width - 1],
      -0.1,
      normalizedLongitudeArray[i * width + width - 1]
    );
    indices.push(
      Number(i * width - 1),
      currentVerticesIndex,
      currentVerticesIndex + 1,
      currentVerticesIndex + 1,
      Number(i * width + width - 1),
      Number(i * width - 1)
    );
    currentVerticesIndex += 1;
  }

  for (let i = 1; i < width; i++) {
    vertices.push(
      normalizedLatitudeArray[Number(verticesLength - i - 1)],
      -0.1,
      normalizedLongitudeArray[Number(verticesLength - i - 1)]
    );
    indices.push(
      verticesLength - i,
      currentVerticesIndex,
      currentVerticesIndex + 1,
      currentVerticesIndex + 1,
      normalizedElevationArray.length - (1 + i),
      verticesLength - 1 * i
    );
    currentVerticesIndex += 1;
  }

  for (let i = 1; i <= depth - 1; i++) {
    if (i < depth - 1) {
      vertices.push(
        normalizedLatitudeArray[Number(verticesLength - (i * width + width))],
        -0.1,
        normalizedLongitudeArray[Number(verticesLength - (i * width + width))]
      );
    }
    if (i === depth - 1) {
      indices.push(
        verticesLength - i * width,
        currentVerticesIndex,
        verticesLength,
        verticesLength,
        verticesLength - (i * width + width),
        verticesLength - i * width
      );
    } else {
      indices.push(
        verticesLength - i * width,
        currentVerticesIndex,
        currentVerticesIndex + 1,
        currentVerticesIndex + 1,
        verticesLength - (i * width + width),
        verticesLength - i * width
      );
      currentVerticesIndex += 1;
    }
  }
  return { vertices, indices };
}

export const createGeometryBufferData = ({
  normalizedCoords,
  vertices,
  indices,
  normals,
  uvs,
  additional,
}: CreateGeometryPropsType): CreateGeometryReturnType => {
  let positions;
  positions = Array.from(vertices);

  // console.log('vertices', vertices);
  // console.log(
  //   'normalizedCoords',
  //   normalizedCoords.normalizedElevationArray.length
  // );

  for (let i = 0; i <= vertices.length - 1; i += 3) {
    positions[i] = normalizedCoords.normalizedLatitudeArray[i / 3];
    positions[i + 1] = normalizedCoords.normalizedElevationArray[i / 3];
    positions[i + 2] = normalizedCoords.normalizedLongitudeArray[i / 3];

    // console.log('i', i);

    if (i == vertices.length - 1) {
      console.log('first', positions[i + 1]);
    }
  }

  if (!additional) {
    positions = positions;
  } else {
    positions = [...positions, ...additional];
  }

  // console.log('positions.length', positions[positions.length - 2]);

  return { /* geometry, */ positions, indices, normals, uvs };
};

export function createMeshFromBufferGeometry(
  geometryBufferData: CreateGeometryReturnType,
  material: THREE.ShaderMaterial | THREE.MeshStandardMaterial
) {
  const { positions, indices, normals, uvs } = geometryBufferData;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.computeVertexNormals();
  if (normals)
    geometry.setAttribute(
      'normal',
      new THREE.Float32BufferAttribute(normals, 3)
    );
  if (uvs)
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  if (indices) geometry.setIndex(indices);

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

export function createBoxMesh({
  width,
  height,
  depth,
}: Record<string, number>) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
  });
  return new THREE.Mesh(geometry, material);
}

export function createPolygonFromLine({
  start,
  end,
  width,
}: CreatePolygonFromLineProps) {
  const angle = Math.atan2(end[0] - start[0], end[1] - start[1]);
  const offsetX = (width / 2) * Math.sin(angle + Math.PI / 2);
  const offsetY = (width / 2) * Math.cos(angle + Math.PI / 2);
  // console.log('angle', angle * (180 / Math.PI));
  // console.log('offsetX, offsetY', offsetX, offsetY);
  // console.log('start', start);
  // console.log('end', end);
  const polygonVertices = [
    [start[0] - offsetX, 0, start[1] + offsetY],

    [start[0] + offsetX, 0, start[1] - offsetY],

    [end[0] + offsetX, 0, end[1] - offsetY],

    [end[0] - offsetX, 0, end[1] + offsetY],
  ];
  const triangleIndices = [
    0,
    1,
    2, // первый треугольник
    0,
    2,
    3, // второй треугольник
  ];
  return { polygonVertices, triangleIndices };
}

export function thickLine(
  coordinates: NormalizedCoordinatesType,
  thick: number,
  offset: number
): CreateGeometryReturnType {
  const length = coordinates.normalizedLatitudeArray.length;
  const z = coordinates.normalizedLongitudeArray;
  const y = coordinates.normalizedElevationArray;
  const x = coordinates.normalizedLatitudeArray;
  const vertices = [];
  const indices = [];
  const normal = (a: number[], b: number[]) => {
    const xC = b[0] - a[0];
    const yC = b[2] - a[2];
    const f = 1 / Math.sqrt(xC ** 2 + yC ** 2);
    // console.log('[-yC * f, xC * f', [-yC * f, xC * f])
    return [-yC * f, xC * f];
  };
  const shift = (p: number[], dir: number[], w: number) => [
    p[0] + dir[0] * w,
    p[1],
    p[2] + dir[1] * w,
  ];
  for (let i = 0; i < length; i++) {
    // console.log('i', i);
    let prevCoord, currentCoord, nextCoord;
    // prevCoord = i >= 0 ? [x[i], y[i], z[i]] : null;
    // currentCoord = [x[i + 1], y[i + 1], z[i + 1]];
    // nextCoord = i < length ? [x[i + 2], y[i + 2], z[i + 2]] : null;
    if (i === 0) {
      currentCoord = [x[i], y[i] * offset, z[i]];
      nextCoord = [x[i + 1], y[i + 1] * offset, z[i + 1]];
      const nc = normal(currentCoord, nextCoord);
      const na = normal(currentCoord, nextCoord);
      const d = [na[0] + nc[0], na[1] + nc[1]];
      const f = (thick * 2) / (d[0] ** 2 + d[1] ** 2);
      vertices.push(
        ...shift(currentCoord, d, f),
        ...shift(currentCoord, d, -f)
      );
      indices.push(0, 1, 3, 3, 2, 0);
    } else if (i > 0 && i < length - 1) {
      prevCoord = [x[i - 1], y[i - 1] * offset, z[i - 1]];
      currentCoord = [x[i], y[i] * offset, z[i]];
      nextCoord = [x[i + 1], y[i + 1] * offset, z[i + 1]];

      const na = normal(prevCoord, currentCoord);
      const nc = normal(currentCoord, nextCoord);
      const d = [na[0] + nc[0], na[1] + nc[1]];
      const f = (thick * 2) / (d[0] ** 2 + d[1] ** 2);
      vertices.push(
        // ...shift(prevCoord, na, thick), // 1
        // ...shift(prevCoord, na, -thick), // 0
        ...shift(currentCoord, d, f), // 3
        ...shift(currentCoord, d, -f) // 2
        // ...shift(nextCoord, nc, thick), // 5
        // ...shift(nextCoord, nc, -thick) // 4
      );
      indices.push(i * 2, i * 2 + 1, i * 2 + 3, i * 2 + 3, i * 2 + 2, i * 2);
    } else if (i === length - 1) {
      prevCoord = [x[i - 1], y[i - 1] * offset, z[i - 1]];
      currentCoord = [x[i], y[i] * offset, z[i]];
      const na = normal(prevCoord, currentCoord);
      const nc = normal(prevCoord, currentCoord);
      const d = [na[0] + nc[0], na[1] + nc[1]];
      const f = (thick * 2) / (d[0] ** 2 + d[1] ** 2);
      vertices.push(
        ...shift(currentCoord, d, f),
        ...shift(currentCoord, d, -f)
      );
      // indices.push(i * 2, i * 2 + 1, i * 2 + 3, i * 2 + 3, i * 2 + 2, i * 2);
    }
    /*
        0, 1, 3, 3, 2, 0,   

        2, 3, 5, 5, 4, 2

        4, 5, 7, 7, 6, 4, 

        6, 7, 9, 9, 8, 6, 
 
   */
  }
  // console.log('vertices, indices', vertices, indices);
  return { positions: vertices, indices };
}

export function findClosest(
  points: NormalizedCoordinatesType,
  array: NormalizedCoordinatesType,
  offset: number
) {
  // console.log('offset', offset);
  const pointsX = points.normalizedLatitudeArray;
  const arrayX = array.normalizedLatitudeArray;
  const pointsZ = points.normalizedLongitudeArray;
  const arrayZ = array.normalizedLongitudeArray;

  const resultX = [];
  const resultZ = [];

  for (let i = 0; i < pointsX.length; i++) {
    // console.log('points', points);
    // console.log('array', array)

    const closestX = arrayX.reduce((prev, curr) => {
      return Math.abs(curr - pointsX[i]) < Math.abs(prev - pointsX[i])
        ? curr
        : prev;
    });
    // console.log('closestNumber', closestX);

    resultX.push(arrayX.findIndex(itemX => itemX === closestX));
  }
  // console.log('X индекс ближайшего числа:', resultX);

  for (let i = 0; i < pointsZ.length; i++) {
    const closestZ = arrayZ.reduce((prev, curr) => {
      return Math.abs(curr - pointsZ[i]) < Math.abs(prev - pointsZ[i])
        ? curr
        : prev;
    });
    resultZ.push(arrayZ.findIndex(itemZ => itemZ === closestZ));
  }
  // console.log('Z индекс ближайшего числа:', resultZ);
}

export function createPolygonsFromPoints1(
  coordinates: NormalizedCoordinatesType,
  width: number
): { vertices: number[]; indices: number[] } {
  const vertices: number[] = [];
  const indices: number[] = [];

  const z = coordinates.normalizedLongitudeArray;
  const y = coordinates.normalizedElevationArray;
  const x = coordinates.normalizedLatitudeArray;

  for (let i = 0; i <= coordinates.normalizedLongitudeArray.length - 1; i++) {
    const xi = x[i];
    const yi = y[i];
    const zi = z[i];
    const xi2 = x[i + 1];
    const yi2 = y[i + 1];
    const zi2 = z[i + 1];

    const xi3 = x[i + 2];
    const yi3 = y[i + 2];
    const zi3 = z[i + 2];

    // console.log('i ', i);
    if (i === 0) {
      const directionX1 = x[i + 1] - x[i];
      const directionZ1 = z[i + 1] - z[i];
      const length1 = Math.sqrt(
        directionX1 * directionX1 + directionZ1 * directionZ1
      );
      // console.log('directionX', directionX1);
      // console.log('directionZ', directionZ1);
      // console.log('length', length);
      const normalizedDirectionX1 = directionX1 / length1;
      const normalizedDirectionZ1 = directionZ1 / length1;

      //  const directionX2 = xi3 - xi2;
      //  const directionZ2 = zi3 - zi2;
      //  const length2 = Math.sqrt(
      //    directionX2 * directionX2 + directionZ2 * directionZ2
      //  );
      //  const normalizedDirectionX2 = directionX2 / length2;
      //  const normalizedDirectionZ2 = directionZ2 / length2;

      // Вычисляем бисектрису
      //  const bisectDirectionX = normalizedDirectionX1 + normalizedDirectionX2;
      //  const bisectDirectionZ = normalizedDirectionZ1 + normalizedDirectionZ2;
      //  const bisectLength = Math.sqrt(
      //    bisectDirectionX * bisectDirectionX +
      //      bisectDirectionZ * bisectDirectionZ
      //  );
      //  const normalizedBisectDirectionX = bisectDirectionX / bisectLength;
      //  const normalizedBisectDirectionZ = bisectDirectionZ / bisectLength;

      const vertex1X = x[i] + (normalizedDirectionX1 * width) / 2;
      const vertex1Z = z[i] + (normalizedDirectionZ1 * width) / 2;
      const vertex1Y = yi;

      const vertex2X = x[i] - (normalizedDirectionX1 * width) / 2;
      const vertex2Z = z[i] - (normalizedDirectionZ1 * width) / 2;
      const vertex2Y = yi;
      console.log(
        'vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, vertex2Z',
        vertex1X,
        vertex1Y,
        vertex1Z,
        vertex2X,
        vertex2Y,
        vertex2Z
      );
      vertices.push(vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, vertex2Z);
    } else if (i === coordinates.normalizedLongitudeArray.length - 1) {
      const directionX1 = x[i] - x[i - 1];
      const directionZ1 = z[i] - z[i - 1];
      const length1 = Math.sqrt(
        directionX1 * directionX1 + directionZ1 * directionZ1
      );
      // console.log('directionX', directionX1);
      // console.log('directionZ', directionZ1);
      // console.log('length', length);
      const normalizedDirectionX1 = directionX1 / length1;
      const normalizedDirectionZ1 = directionZ1 / length1;

      const directionX2 = xi3 - xi2;
      const directionZ2 = zi3 - zi2;
      const length2 = Math.sqrt(
        directionX2 * directionX2 + directionZ2 * directionZ2
      );
      const normalizedDirectionX2 = directionX2 / length2;
      const normalizedDirectionZ2 = directionZ2 / length2;

      // Вычисляем бисектрису
      const bisectDirectionX = normalizedDirectionX1 + normalizedDirectionX2;
      const bisectDirectionZ = normalizedDirectionZ1 + normalizedDirectionZ2;
      const bisectLength = Math.sqrt(
        bisectDirectionX * bisectDirectionX +
          bisectDirectionZ * bisectDirectionZ
      );
      const normalizedBisectDirectionX = bisectDirectionX / bisectLength;
      const normalizedBisectDirectionZ = bisectDirectionZ / bisectLength;

      const vertex1X = x[i] + (normalizedBisectDirectionX * width) / 2;
      const vertex1Z = z[i] + (normalizedBisectDirectionZ * width) / 2;
      const vertex1Y = yi;

      const vertex2X = x[i] - (normalizedBisectDirectionX * width) / 2;
      const vertex2Z = z[i] - (normalizedBisectDirectionZ * width) / 2;
      const vertex2Y = yi;

      vertices.push(vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, vertex2Z);
    } else if (i > 0 && i < coordinates.normalizedLongitudeArray.length) {
      const xi1 = x[i - 1];
      const yi1 = y[i - 1];
      const zi1 = z[i - 1];

      const xi2 = x[i];
      const yi2 = y[i];
      const zi2 = z[i];

      const xi3 = x[i + 1];
      const yi3 = y[i + 1];
      const zi3 = z[i + 1];

      // Вычисляем направления для каждой стороны треугольника
      const directionX1 = xi2 - xi1;
      const directionZ1 = zi2 - zi1;
      const length1 = Math.sqrt(
        directionX1 * directionX1 + directionZ1 * directionZ1
      );
      const normalizedDirectionX1 = directionX1 / length1;
      const normalizedDirectionZ1 = directionZ1 / length1;

      const directionX2 = xi3 - xi2;
      const directionZ2 = zi3 - zi2;
      const length2 = Math.sqrt(
        directionX2 * directionX2 + directionZ2 * directionZ2
      );
      const normalizedDirectionX2 = directionX2 / length2;
      const normalizedDirectionZ2 = directionZ2 / length2;

      // Вычисляем бисектрису
      const bisectDirectionX = normalizedDirectionX1 + normalizedDirectionX2;
      const bisectDirectionZ = normalizedDirectionZ1 + normalizedDirectionZ2;
      const bisectLength = Math.sqrt(
        bisectDirectionX * bisectDirectionX +
          bisectDirectionZ * bisectDirectionZ
      );
      const normalizedBisectDirectionX = bisectDirectionX / bisectLength;
      const normalizedBisectDirectionZ = bisectDirectionZ / bisectLength;

      // Находим координаты вершин полигона
      const vertex1X = xi2 + (normalizedBisectDirectionX * width) / 2;
      const vertex1Y = yi2;
      const vertex1Z = zi2 + (normalizedBisectDirectionZ * width) / 2;

      const vertex2X = xi2 - (normalizedBisectDirectionX * width) / 2;
      const vertex2Y = yi2;
      const vertex2Z = zi2 - (normalizedBisectDirectionZ * width) / 2;
      // if (i === 1) {
      //   console.log('first', directionX1, directionZ1, directionX2, directionZ2);
      //   // console.log(
      //   //   'normalizedBisectDirection>>>>>>>',
      //   //   normalizedBisectDirectionX,
      //   //   normalizedBisectDirectionZ
      //   // );
      //   // console.log('bisectLength', bisectLength);
      //   // console.log('vertex1X', vertex1X);
      //   // console.log('vertex1Z', vertex1Z);
      //   // console.log('vertex2X', vertex2X);
      //   // console.log('vertex2Z', vertex2X);
      // }
      vertices.push(vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, vertex2Z);
    }
    if (i > 0) {
      const prevVertexIndex = (i + 1) * 2;
      const currVertexIndex = i * 2;

      indices.push(prevVertexIndex, prevVertexIndex + 1, currVertexIndex + 1);
      indices.push(currVertexIndex + 1, currVertexIndex, prevVertexIndex);
    } else {
      indices.push(0, 1, 3, 3, 2, 0);
    }
  }
  console.log('indices, vertices', indices, vertices);
  return { vertices, indices };
}

export function calculateOffsets(
  coordinates: NormalizedCoordinatesType,
  width: number
) {
  // console.log('coordinates', coordinates);
  const {
    normalizedLongitudeArray,
    normalizedElevationArray,
    normalizedLatitudeArray,
  } = coordinates;
  const offsets = [];

  const vertices = [];
  const indices = [];

  for (let i = 0; i < normalizedLongitudeArray.length; i++) {
    const currentPoint = {
      x: normalizedLatitudeArray[i],
      z: normalizedLongitudeArray[i],
      y: normalizedElevationArray[i],
    };
    let previousPoint, nextPoint;

    // Если это первая точка, используем следующую точку и текущую
    if (i === 0) {
      previousPoint = {
        x: normalizedLongitudeArray[i],
        z: normalizedLatitudeArray[i],
      };
      nextPoint = {
        x: normalizedLongitudeArray[i + 1],
        z: normalizedLatitudeArray[i + 1],
      };
      // console.log('previousPoint, nextPoint', previousPoint, nextPoint);
    }
    // Если это последняя точка, используем предыдущую точку и текущую
    else if (i === normalizedLongitudeArray.length - 1) {
      console.log('i in last', i);
      previousPoint = {
        x: normalizedLongitudeArray[i - 1],
        z: normalizedLatitudeArray[i - 1],
      };
      nextPoint = {
        x: normalizedLongitudeArray[i],
        z: normalizedLatitudeArray[i],
      };
    }
    // В остальных случаях используем предыдущую и следующую точки
    else if (i > 0 && i < normalizedLongitudeArray.length) {
      previousPoint = {
        x: normalizedLongitudeArray[i - 1],
        z: normalizedLatitudeArray[i - 1],
      };
      nextPoint = {
        x: normalizedLongitudeArray[i + 1],
        z: normalizedLatitudeArray[i + 1],
      };
      // console.log(
      //   'previousPoint, currentPoint, nextPoint',
      //   previousPoint,
      //   currentPoint,
      //   nextPoint
      // );
    }
    if (nextPoint && previousPoint) {
      const direction = {
        x: nextPoint.x - previousPoint.x,
        z: nextPoint.z - previousPoint.z,
      };
      const length = Math.sqrt(
        direction.x * direction.x + direction.z * direction.z
      );
      const normalizedDirection = {
        x: direction.x / length,
        z: direction.z / length,
      };
      const perpendicularVector = {
        x: -normalizedDirection.z,
        z: normalizedDirection.x,
      };

      const offset = {
        latitudeOffset: perpendicularVector.x * width,
        longitudeOffset: perpendicularVector.z * width,
        elevationOffset: 0,
      };

      offsets.push(offset);

      // Добавляем вершины для текущего прямоугольника
      const topLeftVertex = [
        currentPoint.x + offset.longitudeOffset,
        currentPoint.y,
        currentPoint.z + offset.latitudeOffset,
      ];
      const topRightVertex = [
        currentPoint.x - offset.longitudeOffset,
        currentPoint.y,
        currentPoint.z + offset.latitudeOffset,
      ];
      const bottomLeftVertex = [
        currentPoint.x + offset.longitudeOffset,
        currentPoint.y,
        currentPoint.z - offset.latitudeOffset,
      ];
      const bottomRightVertex = [
        currentPoint.x - offset.longitudeOffset,
        currentPoint.y - offset.elevationOffset,
        currentPoint.z - offset.latitudeOffset,
      ];
      if (i === 3) {
        console.log('i', i);
        console.log('direction', direction);
        console.log('offset', offset);
        console.log('normalizedDirection', normalizedDirection);
        console.log(
          'previousPoint, currentPoint, nextPoint',
          previousPoint,
          currentPoint,
          nextPoint
        );
      }
      // Добавляем вершины в массив вершин
      vertices.push(
        ...topLeftVertex,
        // ...topRightVertex
        ...bottomLeftVertex
        // ...bottomRightVertex
      );

      // Добавляем индексы треугольников для текущего прямоугольника
      if (i === 0) {
        indices.push(0, 1, 3, 3, 2, 0);
      } else if (i > 0 && i < normalizedLongitudeArray.length - 1) {
        const prevVertexIndex = (i + 1) * 2;
        const currVertexIndex = i * 2;

        indices.push(prevVertexIndex, prevVertexIndex + 1, currVertexIndex + 1);
        indices.push(currVertexIndex + 1, currVertexIndex, prevVertexIndex);
      }
    }
  }
  console.log('vertices, indices', vertices, indices);
  return { vertices, indices };
}

// export function generatePolygonVertices(coordinates: NormalizedCoordinatesType, width: number): { vertices: number[], triangleIndices: number[] } {
//   const numPoints = coordinates.normalizedLongitudeArray.length;
//   const vertices: number[] = [];
//   const triangleIndices: number[] = [];

//   for (let i = 0; i < numPoints; i++) {
//     const startPointX = coordinates.normalizedLongitudeArray[i];
//     const startPointZ = coordinates.normalizedLatitudeArray[i];
//     const midPointX = coordinates.normalizedLongitudeArray[(i + 1) % numPoints];
//     const midPointZ = coordinates.normalizedLatitudeArray[(i + 1) % numPoints];
//     const endPointX = coordinates.normalizedLongitudeArray[(i + 2) % numPoints];
//     const endPointZ = coordinates.normalizedLatitudeArray[(i + 2) % numPoints];

//     let intersectionX, intersectionZ;
//     if (i === 0) {
//       // Если это первая точка, то находим координаты точки пересечения середин сторон
//       intersectionX = (startPointX + endPointX) / 2;
//       intersectionZ = (startPointZ + endPointZ) / 2;
//     } else if (i === numPoints - 1) {
//       // Если это последняя точка, то находим координаты точки пересечения середин сторон
//       intersectionX = (midPointX + endPointX) / 2;
//       intersectionZ = (midPointZ + endPointZ) / 2;
//     } else {
//       // Если это промежуточная точка, то находим координаты точки пересечения середин сторон
//       intersectionX = (startPointX + endPointX) / 2;
//       intersectionZ = (startPointZ + endPointZ) / 2;
//     }

//     // Находим направление вектора от точки пересечения до середины третьей стороны
//     const directionX = midPointX - intersectionX;
//     const directionZ = midPointZ - intersectionZ;

//     // Находим нормализованное направление вектора
//     const magnitude = Math.sqrt(directionX * directionX + directionZ * directionZ);
//     const normalizedDirectionX = directionX / magnitude;
//     const normalizedDirectionZ = directionZ / magnitude;

//     // Расчет вершин полигона
//     const vertex1X = midPointX + (normalizedDirectionX * width) / 2;
//     const vertex1Z = midPointZ + (normalizedDirectionZ * width) / 2;
//     const vertex1Y = coordinates.normalizedElevationArray[(i + 1) % numPoints];

//     const vertex2X = midPointX - (normalizedDirectionX * width) / 2;
//     const vertex2Z = midPointZ - (normalizedDirectionZ * width) / 2;
//     const vertex2Y = coordinates.normalizedElevationArray[(i + 1) % numPoints];

//     const vertex3X = intersectionX + (normalizedDirectionX * width) / 2;
//     const vertex3Z = intersectionZ + (normalizedDirectionZ * width) / 2;
//     const vertex3Y = coordinates.normalizedElevationArray[i];

//     const vertex4X = intersectionX - (normalizedDirectionX * width) / 2;
//     const vertex4Z = intersectionZ - (normalizedDirectionZ * width) / 2;
//     const vertex4Y = coordinates.normalizedElevationArray[i];

//     // Добавляем вершины в массив vertices
//     vertices.push(vertex1X, vertex1Y, vertex1Z);
//     vertices.push(vertex2X, vertex2Y, vertex2Z);
//     vertices.push(vertex3X, vertex3Y, vertex3Z);
//     vertices.push(vertex4X, vertex4Y, vertex4Z);

//     // Добавляем индексы треугольников в массив triangleIndices
//     const startIndex = i * 4;
//     triangleIndices.push(startIndex, startIndex + 1, startIndex + 2);
//     triangleIndices.push(startIndex + 2, startIndex + 2, startIndex );
//   }
//   console.log('vertices, triangleIndices', vertices, triangleIndices)
//   return { vertices, triangleIndices };
// }

//////////////////////////////////////////////

export function createPolygonsFromPoints(
  coordinates: NormalizedCoordinatesType,
  width: number
): { vertices: number[]; indices: number[] } {
  const vertices: number[] = [];
  const indices: number[] = [];
  const z = coordinates.normalizedLongitudeArray;
  const y = coordinates.normalizedElevationArray;
  const x = coordinates.normalizedLatitudeArray;

  for (let i = 0; i <= coordinates.normalizedLongitudeArray.length - 1; i++) {
    const xi1 = x[i];
    const yi1 = y[i];
    const zi1 = z[i];

    const xi2 = x[i + 1];
    const yi2 = y[i + 1];
    const zi2 = z[i + 1];

    const xi3 = x[i + 2];
    const yi3 = y[i + 2];
    const zi3 = z[i + 2];

    // Вычисляем направления для каждой стороны треугольника
    const directionX1 = xi2 - xi1;
    const directionZ1 = zi2 - zi1;
    const length1 = Math.sqrt(
      directionX1 * directionX1 + directionZ1 * directionZ1
    );
    const normalizedDirectionX1 = directionX1 / length1;
    const normalizedDirectionZ1 = directionZ1 / length1;

    const directionX2 = xi3 - xi2;
    const directionZ2 = zi3 - zi2;
    const length2 = Math.sqrt(
      directionX2 * directionX2 + directionZ2 * directionZ2
    );
    const normalizedDirectionX2 = directionX2 / length2;
    const normalizedDirectionZ2 = directionZ2 / length2;

    // Вычисляем бисектрису
    const bisectDirectionX = normalizedDirectionX1 + normalizedDirectionX2;
    const bisectDirectionZ = normalizedDirectionZ1 + normalizedDirectionZ2;
    const bisectLength = Math.sqrt(
      bisectDirectionX * bisectDirectionX + bisectDirectionZ * bisectDirectionZ
    );
    const normalizedBisectDirectionX = bisectDirectionX / bisectLength;
    const normalizedBisectDirectionZ = bisectDirectionZ / bisectLength;

    // Находим координаты вершин полигона
    const vertex1X = xi2 + (normalizedBisectDirectionX * width) / 2;
    const vertex1Y = yi2;
    const vertex1Z = zi2 + (normalizedBisectDirectionZ * width) / 2;

    const vertex2X = xi2 - (normalizedBisectDirectionX * width) / 2;
    const vertex2Y = yi2;

    const vertex2Z = zi2 - (normalizedBisectDirectionZ * width) / 2;

    // const vertex3X = xi3 + (normalizedBisectDirectionX * width) / 2;
    // const vertex3Y = yi3;
    // const vertex3Z = zi3 + (normalizedBisectDirectionZ * width) / 2;

    // const vertex4X = xi3 - (normalizedBisectDirectionX * width) / 2;
    // const vertex4Y = yi3;
    // const vertex4Z = zi3 - (normalizedBisectDirectionZ * width) / 2;

    // Добавляем вершины в массив вершин
    vertices.push(vertex1X, vertex1Y, vertex1Z);
    vertices.push(vertex2X, vertex2Y, vertex2Z);
    // vertices.push(vertex3X, vertex3Y, vertex3Z);
    // vertices.push(vertex4X, vertex4Y, vertex4Z);

    // Добавляем индексы для создания полигона
    if (i > 0) {
      const prevVertexIndex = (i + 1) * 2;
      const currVertexIndex = i * 2;

      indices.push(prevVertexIndex, prevVertexIndex + 1, currVertexIndex + 1);
      indices.push(currVertexIndex + 1, currVertexIndex, prevVertexIndex);
    } else {
      indices.push(0, 1, 3, 3, 2, 0);
    }
  }
  console.log('vertices, indices', vertices, indices);
  return { vertices, indices };
}

export function subdivide(
  vertices: number[],
  indices: number[]
): { vertices: number[]; indices: number[] } {
  const newVertices: number[] = [...vertices];
  const newIndices: number[] = [...indices];

  const numTriangles = indices.length / 3;

  for (let i = 0; i < numTriangles; i++) {
    const v1Index = indices[i * 3];
    const v2Index = indices[i * 3 + 1];
    const v3Index = indices[i * 3 + 2];

    // Вычислить новые вершины
    const v1 = vertices.slice(v1Index * 3, v1Index * 3 + 3);
    const v2 = vertices.slice(v2Index * 3, v2Index * 3 + 3);
    const v3 = vertices.slice(v3Index * 3, v3Index * 3 + 3);

    const v12 = [(v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2, (v1[2] + v2[2]) / 2];
    const v23 = [(v2[0] + v3[0]) / 2, (v2[1] + v3[1]) / 2, (v2[2] + v3[2]) / 2];
    const v31 = [(v3[0] + v1[0]) / 2, (v3[1] + v1[1]) / 2, (v3[2] + v1[2]) / 2];

    // Добавить новые вершины в массив
    const newVerticesIndices = newVertices.length / 3;
    newVertices.push(...v12, ...v23, ...v31);

    // Обновить индексы треугольников
    const v12Index = newVerticesIndices;
    const v23Index = newVerticesIndices + 1;
    const v31Index = newVerticesIndices + 2;

    newIndices[i * 3 + 1] = v12Index;
    newIndices[i * 3 + 2] = v31Index;

    newIndices.push(v12Index, v2Index, v23Index);
    newIndices.push(v23Index, v3Index, v31Index);
    newIndices.push(v31Index, v12Index, v1Index);
  }

  return {
    vertices: newVertices,
    indices: newIndices,
  };
}

export function calculateSurfaceShape({
  firstCoord,
  lastCoord,
}: AreaCoordinates) {
  // Расчет горизонтального расстояния между точками
  const horizontalDistance = calculateHorizontalDistance(
    firstCoord[0],
    firstCoord[1],
    lastCoord[0],
    lastCoord[1]
  );

  // Расчет вертикального расстояния между точками
  const verticalDistance = calculateVerticalDistance(
    firstCoord[0],
    firstCoord[1],
    lastCoord[0],
    lastCoord[1]
  );

  // Расчет половины длины диагонали
  const halfDiagonalLength = horizontalDistance / 2;

  const widthX = Math.sqrt(
    horizontalDistance ** 2 /
      (1 +
        (lastCoord[1] - firstCoord[1]) ** 2 /
          (lastCoord[0] - firstCoord[0]) ** 2)
  );
  const depthZ = Math.sqrt(horizontalDistance ** 2 - widthX ** 2);
  // Создание прямоугольника с использованием половины длины диагонали и вертикального расстояния
  const surfaceShape = {
    widthX,
    depthZ,
    aspect: widthX / depthZ,
    diagonalLength: horizontalDistance,
    // width: halfDiagonalLength,
    // height: verticalDistance,
    // aspectRatio: halfDiagonalLength / verticalDistance,
  };
  //   console.log('surfaceShape', surfaceShape);
  return surfaceShape;
}

function calculateHorizontalDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const earthRadius = 6_371; // Радиус Земли в метрах

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  console.log('horizontalDistance', distance);
  return distance;
}

function calculateVerticalDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const earthRadius = 6371; // Радиус Земли в километрах

  const dLat = toRadians(lat2 - lat1);

  const distance = earthRadius * dLat;
  //   console.log('verticalDistance', distance);
  return distance;
}

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}
