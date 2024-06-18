import React, { MutableRefObject } from 'react';
import { FIGURE_TYPE } from './2DMap.consts';
import { DistanceLine } from '../createMap.typings';
import { DomEvent } from '@yandex/ymaps3-types';

export type PolyLineRef = {
  pointID: string;
  pointCoordinates: L.LatLng;
};

export type InsertMarkerProps = {
  latLng: L.LatLng;
  markersLayer: MutableRefObject<L.LayerGroup<any> | null>;
  // markerDragingHandler: (marker: L.Marker<any>, idx: number) => void;
  figureRef: MutableRefObject<L.Polyline | null>;
};

export type LineMarkers = {
  lineID: string;
  markersArray: L.Marker<any>[];
};

export type InitialMapViewCoordinatesType = {
  lat: number;
  lng: number;
};

export type MapPropsType = {
  initialMapViewCoordinates: InitialMapViewCoordinatesType;
};

export interface ICreateCustomControl extends L.ControlOptions {
  element: string;
  title?: string;
  className: string;
  styles?: string;
  onClick?: L.DomEvent.EventHandlerFn;
  parentContainer?: L.Control;
  children?: HTMLElement[] | HTMLImageElement[];
  focusIn?: L.DomEvent.EventHandlerFn;
  focusOut?: L.DomEvent.EventHandlerFn;
  // ref: MutableRefObject<HTMLElement>
}

export type LineCoordinates = {
  lat: number;
  lng: number;
};

export type DrawFigureProps = {
  figureID?: string;
  figure: FIGURE_TYPE;
  figureRef: React.MutableRefObject<L.Polyline<any, any> | null>;
  color: string;
  weight: number;
  currentLatlng: L.LatLng;
  layerRef: MutableRefObject<L.LayerGroup<any> | null>;
  lineConstraints?: L.LatLngBounds;
  markersRef?: MutableRefObject<LineMarkers | null>;
  markersLayer?: MutableRefObject<L.LayerGroup<any> | null>;
  markerDragingHandler?: (marker: L.Marker<any>) => void;
};

export type CreateControlContainerProps = {
  title?: string;
  className: string;
  styles?: string;
};

export type DrawLineMarkersByIdProps = {
  activeLineIndex: number;
  linesArray: (DistanceLine[] | (void));
  markersLayer: MutableRefObject<L.LayerGroup<any> | null>;
  markerDragStartHandler: (marker: L.Marker<any>, index: number, lines: DistanceLine[]) => void;
  markerDragHandler: (marker: L.Marker<any>, index: number, lines: DistanceLine[]) => void;
  markerDragEndHandler: (marker: L.Marker<any>, index: number, lines: DistanceLine[]) => void;
};

export type UpdateCoordinatesProps = {
  lines: DistanceLine[];
  lineIdx: number;
  pointIdx: number;
  pointCoordinates: L.LatLng;
};