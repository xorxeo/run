import { LineMarkers } from "./2DMap/2DMap.typings";

export type CreateTHREEGeometryBufferProps = {
  vertices: number[];
  indices: number[];
  normals?: number[];
  uvs?: number[];
};

export type AreaCoordinates = {
  firstCoord: number[];
  lastCoord: number[];
};

export type CalculateGeometryReturnData = {
  vertices: number[];
  coords: RequestElevationData;
  indices: number[];
  uvs: number[];
  normals: number[];
  elevationResponse: ResponseElevationResults | Error;
  normalizedCoordinates: NormalizedCoordinatesType;
  edgeIndices?: number[];
  gridX1: number;
  gridZ1: number;
};
export type GeometryGrid = {
  segments: number;
  depthSegments?: number;
  firstCoord: number[];
  lastCoord: number[];
  aspectRatio: number;
};

export type ResponseElevationResults = {
  results: GeoCoordinatesWithElevation[];
};

export type GeoCoordinatesWithElevation = {
  latitude: number;
  longitude: number;
  elevation: number;
};

export type RequestElevationData = {
  locations: GeoCoordinates[];
};

export type GeoCoordinates = {
  latitude: number;
  longitude: number;
};

export type NormalizedCoordinatesType = {
  normalizedLongitudeArray: number[];
  normalizedElevationArray: number[];
  normalizedLatitudeArray: number[];
};

export type CreateGeometryPropsType = {
  normalizedCoords: NormalizedCoordinatesType;
  vertices: number[];
  indices: number[];
  normals: number[];
  uvs: number[];
  additional?: number[];
};

export type CreateGeometryReturnType = {
  positions: number[];
  indices?: number[];
  normals?: number[];
  uvs?: number[];
  
};

export type NormalizeCoordinatesProps = {
  data: ResponseElevationResults;
  aspectRatio: number;
  areaCoordinates?: AreaCoordinates;
  offset?: number;
};

export type PointCoordinates = {
  lat: number;
  lng: number;
};

export type DistanceLine = {
  id: string;
  pointsCoordinates: GeoCoordinates[];
  color: string;
  // markers: L.Marker<any>[]
};

export type DistanceLineCoordinates = Pick<DistanceLine, 'id'> & {
  pointsCoordinatesWithElevations?: GeoCoordinatesWithElevation[];
  normalizedPointsCoordinates?: NormalizedCoordinatesType;
};

export type CreatePolygonFromLineProps = {
    start: number[];
    end: number[];
    width: number;
}