'use client';

import { useCallback, useEffect, useState } from 'react';

import THREE from '../create-map/3DMap/index';

import { Scene3DMap } from './3DMap/3DMapScene';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';

import { MapInit } from '@/modules/EventForm/components/create-map/2DMap/2DMapInit';

import { LoopSubdivision } from 'three-subdivide';
import {
  addDistancesCoordinates,
  selectAreaAspectRatio,
  selectAreaCoordinates,
  selectDistancesLines,
  selectDistancesCoordinates,
  selectReliefCoordinates,
  selectReliefScale,
  storeAreaCoordinates,
  storeReliefCoordinates,
  selectDistanceYoffset,
  
} from '@/app/redux/features/MapCreatorSlice';
import { RenderCoordinates } from '@/modules/EventForm/components/create-map/RenderCoordinates';
import {
  addThickVertices,
  calculateLinesCoordinates,
  calculateOffsets,
  calculateReliefCoordinates,
  createBoxMesh,
  createGeometryBufferData,
  createMeshFromBufferGeometry,
  createPolygonFromLine,
  createPolygonsFromPoints,
  createPolygonsFromPoints1,
  createPositionsArray,
  findClosest,
  normalizeCoordinates,
  thickLine,
} from './createMap.utils';
import {
  CreateGeometryReturnType,
  DistanceLineCoordinates,
  NormalizedCoordinatesType,
} from './createMap.typings';
import { getMaterial } from './materials';
import { MapEditor } from './3DMap/3DMapEditor';
import { divIcon } from 'leaflet';
import { MOCK, POLYS, TRIANGLES } from './createMap.consts';
import { set } from 'zod';

export type Vertices = number[];

export const CreateMap = () => {
  // const [geometryBufferData, setGeometryBufferData] = useState<CalculateGeometryReturnData>();
  const [error, setError] = useState<Error[]>([]);
  const [normalizedCoordinates, setNormalizedCoordinates] =
    useState<NormalizedCoordinatesType>();
  const [reliefMesh, setReliefMesh] = useState<THREE.Mesh | null>(null);
  const [mesh, setMesh] = useState<
    THREE.Mesh<
      THREE.BufferGeometry<THREE.NormalBufferAttributes>,
      THREE.Material | THREE.Material[],
      THREE.Object3DEventMap
    >[]
  >([]);

  const [areaAspectRatio, setAreaAspectRatio] = useState<number | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const [line, setLine] = useState<any>();
  const [additionalBuf, setAdditionalBuf] = useState<{
    vertices: number[];
    indices: number[];
  }>();

  const [buttonClicked, setButtonClicked] = useState(false);

  const dispatch = useAppDispatch();

  const storedAreaCoordinates = useAppSelector(selectAreaCoordinates);
  const storedAreaAspectRatio = useAppSelector(selectAreaAspectRatio);
  const storedReliefCoordinates = useAppSelector(selectReliefCoordinates);
  const currentReliefScaleY = useAppSelector(selectReliefScale);
  const currentDistanceYoffset = useAppSelector(selectDistanceYoffset);
  const storedDistancesLines = useAppSelector(selectDistancesLines);
  const storedDistancesCoordinates = useAppSelector(selectDistancesCoordinates);
  

  const handleSubdivide = (LoopSubdivision: any) => {
    const iterations = 1;

    const params = {
      split: true, // optional, default: true
      uvSmooth: false, // optional, default: false
      preserveEdges: false, // optional, default: false
      flatOnly: false, // optional, default: false
      maxTriangles: Infinity, // optional, default: Infinity
    };
    return (geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>) => {
      console.log('handleSubdivide');
      const newGeometry = LoopSubdivision.modify(geometry, iterations, params);
      return newGeometry;
    };
  };

  const calculatelineCoordinates = useCallback(async () => {
    if (
      storedDistancesLines.length > 0 &&
      areaAspectRatio &&
      storedAreaCoordinates
    ) {
      const lineId = storedDistancesLines[storedDistancesLines.length - 1].id;
      if (
        storedDistancesCoordinates?.find(distance => distance.id === lineId)
      ) {
        console.log('line already calculated');
        return;
      }
      const line = storedDistancesLines.find(
        distance => distance.id === lineId
      );
      const linesCoordinates = await calculateLinesCoordinates(
        line!.pointsCoordinates,
        areaAspectRatio,
        storedAreaCoordinates,
        
      );
    
      if ('elevationResponse' in linesCoordinates) {
        dispatch(
          addDistancesCoordinates({
            id: lineId,
            normalizedPointsCoordinates: linesCoordinates.normalizedCoordinates,
            pointsCoordinatesWithElevations:
              linesCoordinates.elevationResponse.results,
          })
        );
      } else if (!('elevationResponse' in linesCoordinates)) {
        setError(prev => [...prev, linesCoordinates]);
      }
    }
  }, [
    dispatch,
    areaAspectRatio,
    storedAreaCoordinates,
    storedDistancesCoordinates,
    storedDistancesLines,
    ,
  ]);

  const calculateReliefArea = useCallback(async () => {
    if (storedAreaCoordinates && areaAspectRatio) {
      // console.log('twice', !storedReliefCoordinates);
      const relief = await calculateReliefCoordinates({
        aspectRatio: areaAspectRatio,
        firstCoord: storedAreaCoordinates.firstCoord,
        lastCoord: storedAreaCoordinates.lastCoord,
        segments: 5,
      });
      // const relief = MOCK
      if (relief && 'elevationResponse' in relief) {
        // console.log('dispatch relief');

        dispatch(storeReliefCoordinates(relief));
      } else if (relief && !('elevationResponse' in relief)) {
        setError(prev => [...prev, relief]);
      }
    }
  }, [storedAreaCoordinates, areaAspectRatio, dispatch]);

  //SET AREA ASPECT RATIO STATE FROM STORE
  useEffect(() => {
    if (storedAreaAspectRatio) {
      setAreaAspectRatio(storedAreaAspectRatio);
    }
  }, [storedAreaAspectRatio]);

  //calculateReliefArea
  useEffect(() => {
    // get coordinates from store, firebase, fetch and create geometry
    if (!storedReliefCoordinates) {
      // console.log('storedReliefCoordinates', storedReliefCoordinates)
      calculateReliefArea();
    }
    // return () => {
    //   dispatch(storeReliefCoordinates(null));
    // }
  }, [storedReliefCoordinates, storedAreaCoordinates, calculateReliefArea]);

  // calculatelineCoordinates
  useEffect(() => {
    if (
      storedDistancesLines.length > 0 &&
      areaAspectRatio &&
      storedAreaCoordinates
    ) {
      calculatelineCoordinates();
    }
  }, [
    calculatelineCoordinates,
    storedDistancesLines.length,
    areaAspectRatio,
    storedAreaCoordinates,
    dispatch,
  ]);
  
  // useEffect(() => {
  //   if (currentDistanceYoffset) {
  //     dispatch()
  //   }
  // }, [currentDistanceYoffset]);

  useEffect(() => {
    if (storedReliefCoordinates) {
      setWidth(storedReliefCoordinates.gridX1);
      setHeight(storedReliefCoordinates.gridZ1);
    }
  }, [storedReliefCoordinates]);

  //additional buffer
  useEffect(() => {
    if (width && height && storedReliefCoordinates) {
      setAdditionalBuf(
        addThickVertices(
          storedReliefCoordinates?.normalizedCoordinates,
          width,
          height
        )
      );
    }
  }, [width, height, storedReliefCoordinates]);

  useEffect(() => {
    if (storedReliefCoordinates && additionalBuf) {
      // console.log('additionalBuf', additionalBuf)
      const buffer = createGeometryBufferData({
        indices: [
          ...storedReliefCoordinates.indices /*...additionalBuf.indices*/,
        ],
        normalizedCoords: storedReliefCoordinates.normalizedCoordinates,
        normals: storedReliefCoordinates.normals,
        uvs: storedReliefCoordinates.uvs,
        vertices: storedReliefCoordinates.vertices,
        // additional: additionalBuf.vertices,
      });
      if (buffer) {
        console.log('buffer', buffer);
        setReliefMesh(
          createMeshFromBufferGeometry(buffer, getMaterial().SHADER)
        );
        // const box = createBoxMesh({ width: 1, height: 1, depth: 1 });
        // setMesh(prev => [...prev, box]);
      }
    }
  }, [storedReliefCoordinates, additionalBuf]);

  // useEffect(() => {
  //   if (storedReliefCoordinates && width && height) {
  //     console.log('width, height', width, height);
  //     const q = addThickVertices(
  //       storedReliefCoordinates?.normalizedCoordinates,
  //       width,
  //       height
  //     );
  //     if (q) {
  //       const geometry = new THREE.BufferGeometry();
  //       geometry.setAttribute(
  //         'position',
  //         new THREE.Float32BufferAttribute(q.vertices.flat(), 3)
  //       );
  //       geometry.computeVertexNormals();
  //       geometry.setIndex(q.indices);
  //       const material = new THREE.MeshBasicMaterial({
  //         color: 0x000000,
  //         wireframe: true,
  //       });
  //       const mesh = new THREE.Mesh(geometry, material);
  //       setMesh(prev => [...prev, mesh]);
  //     }
  //   }
  // }, [storedReliefCoordinates, width, height]);

  useEffect(() => {
    if (storedDistancesCoordinates && storedDistancesCoordinates.length > 0) {
      setMesh(prev => {
        const newMeshes = storedDistancesCoordinates.map(
          ({ normalizedPointsCoordinates }) => {
            return createMeshFromBufferGeometry(
              thickLine(normalizedPointsCoordinates!, 0.01, 1),
              getMaterial().STANDART
            );
          }
        );
        return newMeshes;
      });
    }
  }, [storedDistancesCoordinates]);

  useEffect(() => {
    if (
      storedDistancesCoordinates &&
      storedDistancesCoordinates.length > 0 &&
      storedReliefCoordinates
    ) {
      findClosest(
        storedDistancesCoordinates[0].normalizedPointsCoordinates!,
        storedReliefCoordinates.normalizedCoordinates,
        storedReliefCoordinates.gridX1
      );
    }
  }, [
    storedDistancesCoordinates,
    storedReliefCoordinates?.normalizedCoordinates.normalizedLatitudeArray,
    storedReliefCoordinates,
  ]);

  return (
    <>
      <MapInit
        // initialMapViewCoordinates={{ lat: 54.015815, lng: 58.299545 }} />
        initialMapViewCoordinates={{ lat: 40.121054, lng: 49.404758 }}
      />
      <div id="3dContainer" className="w-full h-full ">
        {reliefMesh && areaAspectRatio && (
          <>
            <MapEditor
            // toggleHelper={}
            />
            <Scene3DMap
              containerId="3dContainer"
              reliefMesh={reliefMesh}
              reliefScale={currentReliefScaleY}
              meshs={mesh}
              subdivideHandler={handleSubdivide(LoopSubdivision)}
              subdivideState={buttonClicked}
              currentDistanceYoffset={currentDistanceYoffset}
            />
          </>
        )}
        {error.length > 0 &&
          error.map(error => <div key={error.name}>{error.message}</div>)}
      </div>
      {/* <button
        onClick={() => {
          dispatch(storeAreaCoordinates(null));
          setAreaAspectRatio(null);
        }}
      >
        set null
      </button>

      <button
        onClick={() => {
          // console.log('buttonClicked', buttonClicked);
          setButtonClicked(prevState => !prevState);
        }}
      >
        subdivide
      </button> */}
    </>
  );
};

//
