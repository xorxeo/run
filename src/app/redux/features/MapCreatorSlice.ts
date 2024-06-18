import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import L from '../../../modules/EventForm/components/create-map/2DMap/index';
import { MutableRefObject, Reducer } from 'react';
import { RootState } from '../store';
import {
  AreaCoordinates,
  CalculateGeometryReturnData,
  DistanceLine,
  DistanceLineCoordinates,
  GeoCoordinates,
  GeoCoordinatesWithElevation,
  NormalizedCoordinatesType,
} from '@/modules/EventForm/components/create-map/createMap.typings';
import {
  AREA,
  ASPECT,
} from '@/modules/EventForm/components/create-map/createMap.consts';
import { LineMarkers } from '@/modules/EventForm/components/create-map/2DMap/2DMap.typings';
import { Vector3 } from 'three';

type UpdateLine = {
  lineIndex: number;
  pointIndex: MutableRefObject<number | null>;
  newCoordinates: L.LatLng;
};

type InitialState = {
  mapState: L.Map | null;
  areaCoordinates: AreaCoordinates | null;
  areaAspectRatio: number | null;
  reliefCoordinates: CalculateGeometryReturnData | null;
  reliefScaleY: number;
  distanceYoffset: number;
  distancesLines: DistanceLine[];
  distancesCoordinates: DistanceLineCoordinates[];

};

const initialState: InitialState = {
  mapState: null,
  areaCoordinates: null,
  // areaCoordinates: AREA,
  areaAspectRatio: null,
  // areaAspectRatio: ASPECT,
  reliefCoordinates: null,
  reliefScaleY: 1,
  distanceYoffset: 0,
  distancesLines: [] as DistanceLine[],
  distancesCoordinates: [] as DistanceLineCoordinates[],

};

export type MapCreatorActions = typeof MapCreatorSlice.caseReducers;

export type MapCreatorState = Reducer<InitialState, PayloadAction<any>>;

export const MapCreatorSlice = createSlice({
  name: 'MapCreator',
  initialState,
  reducers: {
    storeMapState: (state, action) => {
      state.mapState = action.payload;
    },
    storeAreaCoordinates: (
      state,
      action: PayloadAction<AreaCoordinates | null>
    ) => {
      state.areaCoordinates = action.payload;
    },
    storeAreaAspectRatio: (state, action: PayloadAction<number>) => {
      state.areaAspectRatio = action.payload;
    },
    storeReliefCoordinates: (
      state,
      action: PayloadAction<CalculateGeometryReturnData | null>
    ) => {
      state.reliefCoordinates = action.payload;
    },
    reliefScaleYIncrement: state => {
      state.reliefScaleY += 1;
    },
    reliefScaleYDecrement: state => {
      state.reliefScaleY -= 1;
    },
    addDistanceLine: (state, action: PayloadAction<DistanceLine>) => {
      //@ts-ignore
      state.distancesLines.push(action.payload);
    },
    addDistancesCoordinates: (
      state,
      action: PayloadAction<DistanceLineCoordinates>
    ) => {
      state.distancesCoordinates.push(action.payload);
    },
    updateLines: (state, action: PayloadAction<DistanceLine[]>) => {
      // const { lineIndex, pointIndex, newCoordinates } = action.payload;
      // console.log('action.payload', action.payload);
      // state.distancesLines[lineIndex].pointsCoordinates[
      //   pointIndex.current!
      // ].latitude = newCoordinates.lat;
      // state.distancesLines[lineIndex].pointsCoordinates[
      //   pointIndex.current!
      // ].longitude = newCoordinates.lng;
      state.distancesLines = action.payload;
    },
    incrementYoffset: state => {
      state.distanceYoffset += 0.1;
    },
    decrementYoffset: state => {
      state.distanceYoffset -= 0.1;
    },
    update: state => {
      state.distancesCoordinates.forEach(dist => {
        if (dist.normalizedPointsCoordinates) {
          dist.normalizedPointsCoordinates.normalizedElevationArray =
            dist.normalizedPointsCoordinates.normalizedElevationArray.map(
              elevation => elevation + state.distanceYoffset
            );
        }
      });
    },
    
  },
});

export const {
  storeMapState,
  storeAreaCoordinates,
  storeAreaAspectRatio,
  storeReliefCoordinates,
  reliefScaleYIncrement,
  reliefScaleYDecrement,
  addDistanceLine,
  addDistancesCoordinates,
  updateLines,
  incrementYoffset,
  decrementYoffset,
  update,
} = MapCreatorSlice.actions;

export const selectAreaCoordinates = (state: RootState) => {
  return state.MapCreator.areaCoordinates;
};
export const selectMapState = (state: RootState) => {
  return state.MapCreator.mapState;
};
export const selectAreaAspectRatio = (state: RootState) => {
  return state.MapCreator.areaAspectRatio;
};
export const selectReliefCoordinates = (state: RootState) => {
  return state.MapCreator.reliefCoordinates;
};
export const selectReliefScale = (state: RootState) => {
  return state.MapCreator.reliefScaleY;
};
export const selectDistancesLines = (state: RootState) => {
  return state.MapCreator.distancesLines;
};
export const selectDistancesCoordinates = (state: RootState) => {
  return state.MapCreator.distancesCoordinates;
};
export const selectDistanceYoffset = (state: RootState) => {
  return state.MapCreator.distanceYoffset;
};


export const MapCreatorReducer = MapCreatorSlice.reducer;
