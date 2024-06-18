import L from './index';
import {
  CreateControlContainerProps,
  DrawFigureProps,
  DrawLineMarkersByIdProps,
  ICreateCustomControl,
  InsertMarkerProps,
  LineMarkers,
  UpdateCoordinatesProps,
} from './2DMap.typings';
import { COLORS, FIGURE_TYPE } from './2DMap.consts';
import { DistanceLine, GeoCoordinates } from '../createMap.typings';

let clickCount = 0;
let firstClick: L.LatLng = {} as L.LatLng;
let secondClick: L.LatLng = {} as L.LatLng;

export const createCustomControl = (props: ICreateCustomControl) => {
  const {
    title,
    className,
    element,
    styles,
    onClick,
    parentContainer,
    children,
    focusIn,
    focusOut,
  } = props;

  const Control = L.Control.extend({
    onAdd() {
      const elem = L.DomUtil.create(element, className);
      if (styles) elem.setAttribute('style', styles);
      if (title) elem.innerHTML = title;
      if (onClick) L.DomEvent.on(elem, 'click', onClick);
      if (parentContainer) {
        // console.log('parentContainer.current', parentContainer.getContainer());
        const container = parentContainer.getContainer();
        if (container) container.appendChild(elem);
      }
      if (children) {
        for (const child of children) {
          elem.appendChild(child);
        }
      }
      if (focusIn) elem.addEventListener('pointerenter', focusIn);
      if (focusOut) elem.addEventListener('pointerout', focusOut);
      return elem;
    },
  });

  return new Control();
};

export const CreateControlContainer = ({
  title,
  className,
  styles,
}: CreateControlContainerProps) =>
  // TODO onClick EXPAND etc.
  {
    const Container = L.Control.extend({
      onAdd() {
        const elem = L.DomUtil.create('div', className);
        if (title) elem.innerHTML = title;
        if (styles) elem.setAttribute('style', styles);
        return elem;
      },
    });
    return new Container();
  };

export const CreateControlIcon = ({
  title,
  className,
  styles,
}: CreateControlContainerProps) =>
  // TODO onClick EXPAND etc.
  {
    const Container = L.Control.extend({
      onAdd() {
        const elem = L.DomUtil.create('div', className);
        // if (title) elem.innerHTML = title;
        // if (styles) elem.setAttribute('style', styles);
        if (styles) elem.setAttribute('styles', styles);
        return elem;
      },
    });
    return new Container();
  };

export const insertMarkers = ({
  latLng,
  markersLayer,
  // markerDragingHandler,
  figureRef,
}: InsertMarkerProps) => {
  const icon = L.divIcon({});
  const marker = L.marker(latLng, {
    icon: icon,
    draggable: true,
  }).addTo(markersLayer!.current!);

  // console.log('insertMarkers markersLayer.current', markersLayer.current);

  // marker.on('dragstart', () => {
  //   markerCoordinate.lat = marker.getLatLng().lat;
  //   markerCoordinate.lng = marker.getLatLng().lng;

  //   const linePoints = figureRef?.current?.getLatLngs();

  //   if (linePoints && linePoints.length > 0 && markerCoordinate) {
  //     searchableLinePointIndex = linePoints.findIndex(element => {
  //       return (
  //         //@ts-ignore
  //         element.lat.toPrecision(10) ===
  //           markerCoordinate.lat.toPrecision(10) &&
  //         //@ts-ignore
  //         element.lng === markerCoordinate.lng
  //       );
  //     });
  //     console.log('searchablePoint', searchableLinePointIndex);
  //   }
  // });

  // marker.on('drag', () => {
  //   markerDragingHandler(marker);

  // });

  return marker;
};

export const drawFigure = ({
  currentLatlng,
  figure,
  figureRef,
  color,
  weight,
  layerRef,
  lineConstraints,
  markersRef,
  markersLayer,
  // markerDragingHandler,
  figureID,
}: DrawFigureProps) => {
  if (layerRef.current) {
    if (figure === FIGURE_TYPE.line && figureRef.current && lineConstraints) {
      if (!lineConstraints.contains(currentLatlng)) return;
      // Если уже есть нарисованная линия, добавляем новую точку
      //   console.log(
      //     'Линия есть figureRef.current',
      //     figureRef.current.getLatLngs()
      //   );
      //   console.log('layerRef.current', layerRef.current);

      if (
        markersLayer &&
        markersLayer.current &&
        markersRef &&
        markersRef.current &&
        markersRef.current.markersArray &&
        // markerDragingHandler &&
        figureID
      ) {
        const marker = insertMarkers({
          latLng: currentLatlng,
          markersLayer,
          // markerDragingHandler,
          figureRef,
        });

        // marker.feature = {
        //   type: 'Feature',
        //   properties: { infoText: '', imageURL: '' },
        //   geometry: {
        //     type: 'Point',
        //     coordinates: [currentLatlng.lat, currentLatlng.lng],
        //   },
        //   id: nanoid(),
        // };
        // const markerID = marker.feature.id;

        markersRef.current.lineID = figureID;
        markersRef.current.markersArray.push(marker);

        figureRef.current.addLatLng(currentLatlng);

        // figureRef.current.feature = {
        //   type: 'Feature',
        //   id: markerID,
        //   geometry: { type: 'point line' },
        //   properties: {infoText: '', imageURL: ''},

        // };
      }
    } else if (figure === FIGURE_TYPE.line && lineConstraints) {
      if (!lineConstraints.contains(currentLatlng)) return;
      // Если линия еще не нарисована, создаем новую линию
      figureRef.current = L.polyline([currentLatlng], {
        color: color,
        weight: weight,
      }).addTo(layerRef.current);

      if (
        markersLayer &&
        markersLayer.current &&
        markersRef &&
        markersRef.current &&
        markersRef.current.markersArray &&
        // markerDragingHandler &&
        figureID
      ) {
        const marker = insertMarkers({
          latLng: currentLatlng,
          markersLayer,
          // markerDragingHandler,
          figureRef,
        });

        // marker.feature = {
        //   type: 'Feature',
        //   properties: { infoText: '', imageURL: '' },
        //   geometry: {type: 'Point', coordinates: [currentLatlng.lat, currentLatlng.lng]},
        //   id: nanoid(),
        // };

        markersRef.current.lineID = figureID;
        markersRef.current.markersArray.push(marker);
      }

      //   console.log(
      //     'Линии нет figureRef.current',
      //     figureRef.current?.getLatLngs()
      //   );
      //   console.log('layerRef.current', layerRef.current);
    }
    if (figure === FIGURE_TYPE.rectangle) {
      // let coords: L.LatLng;

      (function () {
        clickCount++;
        // console.log('in q', clickCount, layerRef.current);

        if (clickCount === 1) {
          firstClick = currentLatlng;
          // coords = firstClick
          //   console.log('firstClick', firstClick, layerRef.current);
        } else if (clickCount === 2) {
          secondClick = currentLatlng;
          //   console.log('secondClick', secondClick, layerRef.current);
          const bounds = L.latLngBounds(firstClick, secondClick);
          // coords = secondClick
          //   console.log('bounds', bounds);
          figureRef.current = L.rectangle(bounds, { color: color }).addTo(
            layerRef.current!
          );
          // figureRef.current
          clickCount = 0;

          // return coords;
        }
      })();
    }
  }
};

export function getRandomColor(): COLORS {
  const values = Object.values(COLORS);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

export function convertLatLngToPointCoordinatesArray(
  latLngObject: L.LatLng[] | L.LatLng[][] | L.LatLng[][][]
): GeoCoordinates[] {
  const coordinates: GeoCoordinates[] = latLngObject.map(item => {
    //@ts-ignore
    return { latitude: item.lat, longitude: item.lng };
  });
  return coordinates;
}

export function convertPointCoordinatesToLatLngArray(
  points: GeoCoordinates[]
): L.LatLng[] {
  const convertedCoordinates = points.map(point => {
    return new L.LatLng(point.latitude, point.longitude);
  });
  return convertedCoordinates;
}

export function drawLineMarkers({
  activeLineIndex,
  linesArray,
  markersLayer,
  markerDragStartHandler,
  markerDragHandler,
  markerDragEndHandler,
}: DrawLineMarkersByIdProps) {
  const icon = L.divIcon({});

  if (Array.isArray(linesArray)) {
    const points = convertPointCoordinatesToLatLngArray(
      linesArray[activeLineIndex].pointsCoordinates
    );
    points.forEach(point => {
      const newMarker = new L.Marker(point, {
        // alt: `${marker.getLatLng().lat}${marker.getLatLng().lng}`,
        icon: icon,
        draggable: true,
      });
      newMarker.on('dragstart', () =>
        markerDragStartHandler(newMarker, activeLineIndex, linesArray)
      );
      newMarker.on('drag', () =>
        markerDragHandler(newMarker, activeLineIndex, linesArray)
      );
      newMarker.on('dragend', () =>
        markerDragEndHandler(newMarker, activeLineIndex, linesArray)
      );
      newMarker.addTo(markersLayer.current!);
      return newMarker;
    });
  } else {
    return linesArray;
  }
}

export function updateCoordinates({
  lineIdx,
  lines,
  pointCoordinates,
  pointIdx,
}: UpdateCoordinatesProps) {
  const updatedLines = lines!.map((line, index) => {
    if (index === lineIdx) {
      const updatedLine: DistanceLine = { ...line };
      updatedLine.pointsCoordinates = line.pointsCoordinates.map(
        (point, index) => {
          if (index === pointIdx) {
            const updatedPoint = { ...point };
            updatedPoint.latitude = pointCoordinates.lat;
            updatedPoint.longitude = pointCoordinates.lng;
            return updatedPoint;
          } else {
            return point;
          }
        }
      );
      return updatedLine;
    } else {
      return line;
    }
  });
  return updatedLines;
}
