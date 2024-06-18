'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import L from './index';
import {
  createCustomControl,
  drawFigure,
  convertLatLngToPointCoordinatesArray,
  convertPointCoordinatesToLatLngArray,
  getRandomColor,
  CreateControlContainer,
  drawLineMarkers,
  updateCoordinates,
} from './2DMap.utils';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  addDistanceLine,
  selectAreaCoordinates,
  selectDistancesLines,
  storeAreaAspectRatio,
  storeAreaCoordinates,
  updateLines,
} from '@/app/redux/features/MapCreatorSlice';
import { LineMarkers, MapPropsType, PolyLineRef } from './2DMap.typings';
import { COLORS, FIGURE_TYPE, MAP_PARAMS } from './2DMap.consts';
import { nanoid } from 'nanoid';
import { getMaterial } from '../materials';
import { AREA, ASPECT } from '../createMap.consts';
import { DistanceLine } from '../createMap.typings';

const defaultSControltyle =
  'width: 100%; height: 100%; margin: auto; padding: 4px 4px 4px 4px; background-color: #cccccc; ';
const defaultDrawButtonStyle = `${defaultSControltyle} background-color: #cccccc; `;
const activeDrawButtonStyle = `${defaultSControltyle} background-color: #609f7d; pointer-events: none; opacity: 0.8; `;
const defaultHiddenButtonStyle = `${defaultSControltyle} background-color: #bfbfbf; pointer-events: none; opacity: 0.5; `;
const activeDeleteButtonStyle = `${defaultSControltyle} background-color: red;`;

export const MapInit: FC<MapPropsType> = ({ initialMapViewCoordinates }) => {
  const [renderCount, setRenderCount] = useState(0);

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  //LAYERS
  const drawnItemsRef = useRef<L.LayerGroup<any> | null>(null);
  const drawnRectsRef = useRef<L.LayerGroup<any> | null>(null);
  const lineMarkersRef = useRef<L.LayerGroup<any> | null>(null);

  //FIGURES
  const polylineRef = useRef<L.Polyline | null>(null);
  const rectangleRef = useRef<L.Rectangle | null>(null);
  const markersRef = useRef<LineMarkers>({ lineID: '', markersArray: [] });

  //CUSTOM CONTROLS CONTAINERS
  const drawBarControlContainerRef = useRef<L.Control>();
  const linesListControlContainerRef = useRef<L.Control>();

  //CONTROL ITEMS
  const drawLineRefControl = useRef<HTMLElement>();
  const saveLineRefControl = useRef<HTMLElement>();
  const deleteLineRefControl = useRef<HTMLElement>();

  const drawRectangleRefControl = useRef<HTMLElement>();
  const saveRectangleRefControl = useRef<HTMLElement>();
  const deleteRectangleRefConntrol = useRef<HTMLElement>();

  const linesItemsRef = useRef<HTMLElement[]>([]);

  const [isDrawLine, setIsDrawLine] = useState(false);
  const [isDrawRectangle, setIsDrawRectangle] = useState(false);

  const [lineID, setLineID] = useState<string | null>(null);

  const [constraints, setConstraints] = useState<L.LatLngBounds>();

  const [lineColor, setLineColor] = useState<keyof typeof COLORS>('red');

  const [editableLineIndex, setEditableLineIndex] = useState<number | null>(
    null
  );
  const editableLinePointIndexRef = useRef<number | null>(null);

  const dispatch = useAppDispatch();

  const storedInitialAreaCoordinate = useAppSelector(selectAreaCoordinates);

  const storedLinesCoordinates = useAppSelector(selectDistancesLines);
  const [updatedLineCoordinate, setUpdatedLineCoordinate] = useState<
    DistanceLine[] | null
  >(null);

  const [isDragEnd, setIsDragEnd] = useState<boolean>(false);

  const [inFocus, setInfocus] = useState(false);

  const drawLineHandler = useCallback(
    (e: Event) => {
      console.log('drawLineHandler');
      setLineID(nanoid());
      e.stopPropagation();
      setLineColor(getRandomColor());
      setIsDrawLine(!isDrawLine);
      if (isDrawRectangle) setIsDrawRectangle(!isDrawRectangle);
    },
    [isDrawLine, isDrawRectangle]
  );

  const deleteLineHandler = useCallback(
    (e: Event) => {
      e.stopPropagation();
      setIsDrawLine(false);
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }
    },
    [isDrawLine]
  );

  const saveLineHandler = useCallback(
    (e: Event) => {
      e.stopPropagation();
      const currentLatLng = polylineRef.current?.getLatLngs();

      if (currentLatLng && lineID && markersRef.current) {
        setIsDrawLine(false);
        dispatch(
          addDistanceLine({
            id: lineID,
            pointsCoordinates:
              convertLatLngToPointCoordinatesArray(currentLatLng),
            color: lineColor,
          })
        );
      }
      if (polylineRef.current) {
        // const coordinatesFromLines = polylineRef.current.getBounds();

        polylineRef.current.remove();
        polylineRef.current = null;

        markersRef.current = { lineID: '', markersArray: [] };
        lineMarkersRef.current?.clearLayers();
      }
    },
    [lineID, lineColor, dispatch]
  );

  const drawRectangleHandler = useCallback(
    (e: Event) => {
      e.stopPropagation();
      setIsDrawRectangle(!isDrawRectangle);
      if (isDrawLine) setIsDrawLine(!isDrawLine);
    },
    [isDrawLine, isDrawRectangle]
  );

  const deleteRectangleHandler = useCallback((e: Event) => {
    e.stopPropagation();
    setIsDrawRectangle(false);
    if (rectangleRef.current) {
      rectangleRef.current.remove();
      rectangleRef.current = null;
    }
  }, []);

  const saveRectangleHandler = useCallback(
    (e: Event) => {
      e.stopPropagation();
      const currentLatLng = rectangleRef.current?.getLatLngs();

      if (rectangleRef.current) {
        const coordinatesFromRectangle = rectangleRef.current.getBounds();
        setConstraints(coordinatesFromRectangle);
        // console.log('getSouthWest', coordinatesFromRectangle.getSouthWest());
        // console.log('getNorthEast', coordinatesFromRectangle.getNorthEast());
        // dispatch(storeAreaCoordinates(AREA))
        dispatch(
          storeAreaCoordinates({
            firstCoord: [
              coordinatesFromRectangle.getSouthWest().lat,
              coordinatesFromRectangle.getSouthWest().lng,
            ],
            lastCoord: [
              coordinatesFromRectangle.getNorthEast().lat,
              coordinatesFromRectangle.getNorthEast().lng,
            ],
          })
        );
        const element = rectangleRef.current.getElement();
        if (element) {
          // dispatch(storeAreaAspectRatio(ASPECT))
          dispatch(
            storeAreaAspectRatio(
              element.getBoundingClientRect().width /
                element.getBoundingClientRect().height
            )
          );
        }
        setIsDrawRectangle(false);
      }
      if (rectangleRef.current) {
        rectangleRef.current.remove();
        rectangleRef.current = null;
      }
    },
    [dispatch]
  );

  const storeUpdatedLineCoordinates = useCallback(() => {
    if (updatedLineCoordinate) {
      dispatch(updateLines(updatedLineCoordinate));
    }
  }, [updatedLineCoordinate, dispatch]);

  const markerDragHandler = useCallback(
    (marker: L.Marker<any>, lineIdx: number) => {
      setUpdatedLineCoordinate(prevState => {
        const newLineCoordinate = updateCoordinates({
          lineIdx,
          lines: prevState!,
          pointCoordinates: marker.getLatLng(),
          pointIdx: editableLinePointIndexRef.current!,
        });
        return newLineCoordinate;
      });
    },
    []
  );

  const markerDragStartHandler = useCallback(
    (marker: L.Marker<any>, idx: number) => {
      const markerCoordinate: L.LatLng = {} as L.LatLng;
      let searchableLinePointIndex: number;
      markerCoordinate.lat = marker.getLatLng().lat;
      markerCoordinate.lng = marker.getLatLng().lng;
      const linePoints = updatedLineCoordinate![idx].pointsCoordinates;

      if (linePoints && linePoints.length > 0 && markerCoordinate) {
        searchableLinePointIndex = linePoints.findIndex(element => {
          return (
            element.latitude.toPrecision(10) ===
              markerCoordinate.lat.toPrecision(10) &&
            element.longitude === markerCoordinate.lng
          );
        });
        editableLinePointIndexRef.current = searchableLinePointIndex;
      }
    },
    [updatedLineCoordinate]
  );

  const markerDragEndHandler = useCallback(
    (marker: L.Marker<any>, lineIdx: number) => {
      setIsDragEnd(true);
      lineMarkersRef.current?.clearLayers();
    },
    []
  );

  const editLineHandler = useCallback(
    (activeLineIndex: number) => {
      // linesItemsRef.current.forEach((item, idx) => {
      //   if (idx !== activeLineIndex) {
      //     item.style.cssText = defaultDrawButtonStyle;
      //   } else {
      //     item.style.cssText = activeDrawButtonStyle;
      //   }
      // });

      lineMarkersRef.current?.clearLayers();

      drawLineMarkers({
        activeLineIndex: activeLineIndex,
        linesArray: updatedLineCoordinate!,
        markerDragHandler,
        markerDragStartHandler,
        markerDragEndHandler,
        markersLayer: lineMarkersRef,
      });
    },
    [
      updatedLineCoordinate,
      markerDragHandler,
      markerDragStartHandler,
      markerDragEndHandler,
    ]
  );

  const editIconSVG = `
  <svg class="feather feather-edit-2" fill="none" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
    viewBox="0 0 24 24" width="20"
    xmlns="http://www.w3.org/2000/svg">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>`;

  const editIconURL = `url('data:image/svg+xml;utf8,${encodeURIComponent(
    editIconSVG
  )}')`;

  //MAP MAIN
  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current, MAP_PARAMS).setView([
        initialMapViewCoordinates.lat,
        initialMapViewCoordinates.lng,
      ]);

      mapRef.current.invalidateSize();

      // create EditBAR CONTAINER
      drawBarControlContainerRef.current = CreateControlContainer({
        title: 'Draw Area & Lines',
        className: 'edit-bar',
        styles:
          'display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%',
      })
        .addTo(mapRef.current)
        .setPosition('bottomleft');

      drawnItemsRef.current = L.layerGroup().addTo(mapRef.current);
      drawnRectsRef.current = L.layerGroup().addTo(mapRef.current);
      lineMarkersRef.current = L.layerGroup().addTo(mapRef.current);

      // editBarRefControl.current = L.control
      //   .layers(
      //     {
      //     'lines': drawnItemsRef.current,
      //     'area': drawnRectsRef.current,
      //     // 'all':
      //   }
      //   )
      //   .addTo(mapRef.current);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [initialMapViewCoordinates.lat, initialMapViewCoordinates.lng]);

  //LINES LIST CONTAINER
  useEffect(() => {
    if (mapRef.current && storedLinesCoordinates.length > 0) {
      linesListControlContainerRef.current = CreateControlContainer({
        title: 'Lines List',
        className: 'lines-list',
        styles:
          'display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; ',
      })
        .addTo(mapRef.current)
        .setPosition('bottomright');
    }
    return () => {
      linesListControlContainerRef.current?.remove();
    };
  }, [storedLinesCoordinates]);

  //LINES LIST
  useEffect(() => {
    if (
      storedLinesCoordinates &&
      linesListControlContainerRef &&
      linesListControlContainerRef.current
    ) {
      storedLinesCoordinates.forEach((line, lineIndex) => {
        const icon = createCustomControl({
          element: 'div',
          styles: `  background-image: ${editIconURL}; width: 20px; height: 20px;`,
          className: 'icon-edit',
        });

        const editLine = createCustomControl({
          element: 'div',
          // title: 'Edit',
          className: `'edit ${lineIndex}'`,
          styles: `${defaultDrawButtonStyle}; display: flex; align-items: center; justify-content: center; flex-basis: 15%; ${
            editableLineIndex === lineIndex
              ? 'opacity: 1; background-color: #609f7d; '
              : 'opacity: 0.4; background-color: #cfe2d8'
          }; `,
          onClick: () => {
            console.log('edit');
            setEditableLineIndex(lineIndex);
            editLineHandler(lineIndex);
          },
          children: [icon.onAdd()],
        });
        const titleLine = createCustomControl({
          element: 'div',
          className: `name ${lineIndex}`,
          styles: `flex; flex-basis: 55%; height: 4px; background-color: ${line.color}; `,
          onClick: () => {
            console.log('titleLine');
            // editLineHandler(lineIndex);
          },
          focusIn: () => {
            // setInfocus(true)
            // setEditableLineIndex(lineIndex);
          },
          focusOut: () => {
            // setInfocus(false);
            // setEditableLineIndex(null);
          },
        });

        const lineContainer = createCustomControl({
          element: 'div',
          className: `'lineContainer' ${line.id}`,
          styles:
            'background-color: #cccccc;  opacity: 0.8; display: flex; align-items: center; justify-content-left; width: 100%',
          parentContainer: linesListControlContainerRef.current!,
          onClick: () => {},

          children: [editLine.onAdd(), titleLine.onAdd()],
        }).onAdd();
        linesItemsRef.current[lineIndex] = lineContainer;
      });
    }
    return () => {
      linesItemsRef.current.forEach(line => line.remove());
      linesItemsRef.current = [];
    };
  }, [
    storedLinesCoordinates,
    linesListControlContainerRef,
    editLineHandler,
    editableLineIndex,
    updatedLineCoordinate,
    inFocus,
    editIconURL,
  ]);

  useEffect(() => {
    if (storedLinesCoordinates) {
      storedLinesCoordinates.forEach((line, lineIndex) => {
        if (editableLineIndex === lineIndex) {
          const saveLine = createCustomControl({
            element: 'button',
            title: 'Save',
            className: `'save ${lineIndex}'`,
            styles: `${defaultDrawButtonStyle}; flex-basis: 20%;`,
            onClick: () => {
              console.log('save');
              storeUpdatedLineCoordinates();
              setEditableLineIndex(null);
              lineMarkersRef.current?.clearLayers();
            },
          });

          //TODO: delete handler
          const deleteLine = createCustomControl({
            element: 'button',
            title: 'Delete',
            className: `'delete ${line.id}'`,
            styles: `${defaultDrawButtonStyle}; flex-basis: 20%;`,
            // parentContainer: linesListControlContainerRef.current!,
            onClick: () => {
              console.log('del');
            },
          });

          linesItemsRef.current[lineIndex].appendChild(deleteLine.onAdd());
          linesItemsRef.current[lineIndex].appendChild(saveLine.onAdd());
        }
      });
    }
  }, [
    storedLinesCoordinates,
    editableLineIndex,
    editLineHandler,
    storeUpdatedLineCoordinates,
  ]);

  // CREATE CONTROLS ON THE 2D MAP
  useEffect(() => {
    if (
      mapContainerRef.current &&
      mapRef.current &&
      drawBarControlContainerRef &&
      drawBarControlContainerRef.current
    ) {
      // //RECTANGLE CONTROLS
      drawRectangleRefControl.current = createCustomControl({
        className: 'draw rectangle',
        element: 'button',
        styles: isDrawRectangle
          ? activeDrawButtonStyle
          : defaultDrawButtonStyle,
        title: 'Draw Rectangle',
        onClick: drawRectangleHandler,
        parentContainer: drawBarControlContainerRef.current,
      }).onAdd();

      saveRectangleRefControl.current = createCustomControl({
        className: 'save rectangle',
        element: 'button',
        styles: isDrawRectangle
          ? defaultSControltyle
          : defaultHiddenButtonStyle,
        title: 'Save Rectangle',
        onClick: saveRectangleHandler,
        parentContainer: drawBarControlContainerRef.current,
      }).onAdd();

      deleteRectangleRefConntrol.current = createCustomControl({
        className: 'delete rectangle',
        element: 'button',
        styles: isDrawRectangle
          ? defaultSControltyle
          : defaultHiddenButtonStyle,
        title: 'Delete Rectangle',
        onClick: deleteRectangleHandler,
        parentContainer: drawBarControlContainerRef.current,
      }).onAdd();

      //LINE CONTROLS
      drawLineRefControl.current = createCustomControl({
        className: 'draw line',
        element: 'button',
        styles: isDrawLine ? activeDrawButtonStyle : defaultDrawButtonStyle,
        title: 'Draw Line',
        onClick: drawLineHandler,
        parentContainer: drawBarControlContainerRef.current,
      }).onAdd();

      saveLineRefControl.current = createCustomControl({
        className: 'save line',
        element: 'button',
        styles: isDrawLine ? defaultSControltyle : defaultHiddenButtonStyle,
        title: 'Save Line',
        onClick: saveLineHandler,
        parentContainer: drawBarControlContainerRef.current,
      }).onAdd();

      deleteLineRefControl.current = createCustomControl({
        className: 'delete line',
        element: 'button',
        styles: isDrawLine ? defaultSControltyle : defaultHiddenButtonStyle,
        title: 'Delete Line',
        onClick: deleteLineHandler,
        parentContainer: drawBarControlContainerRef.current,
      }).onAdd();
    }
    return () => {
      deleteLineRefControl.current?.remove();
      saveLineRefControl.current?.remove();
      drawLineRefControl.current?.remove();

      deleteRectangleRefConntrol.current?.remove();
      saveRectangleRefControl.current?.remove();
      drawRectangleRefControl.current?.remove();
    };
  }, [
    isDrawRectangle,
    isDrawLine,
    deleteLineHandler,
    deleteRectangleHandler,
    drawLineHandler,
    drawRectangleHandler,
    saveLineHandler,
    saveRectangleHandler,
  ]);

  //DRAW LINE
  useEffect(() => {
    const DrawLine = (event: L.LeafletMouseEvent) => {
      const currentLatlng = event.latlng;
      drawFigure({
        figure: FIGURE_TYPE.line,
        color: lineColor,
        weight: 2,
        currentLatlng,
        figureRef: polylineRef,
        layerRef: drawnItemsRef,
        lineConstraints: constraints,
        markersLayer: lineMarkersRef,
        markersRef: markersRef,
        figureID: lineID ?? nanoid(),
      });
    };
    if (isDrawLine && mapRef.current) {
      mapRef.current.on('click', DrawLine);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', DrawLine);
      }
    };
  }, [isDrawLine, constraints, lineColor, lineID]);

  //DRAW AREA RECTANGLE
  useEffect(() => {
    const DrawRectangle = (event: L.LeafletMouseEvent) => {
      const currentLatlng = event.latlng;
      drawFigure({
        figure: FIGURE_TYPE.rectangle,
        color: 'green',
        currentLatlng,
        figureRef: rectangleRef,
        layerRef: drawnRectsRef,
        weight: 3,
      });
    };

    if (isDrawRectangle && mapRef.current) {
      mapRef.current.on('click', DrawRectangle);
    }

    return () => {
      if (mapRef.current) {
        drawnRectsRef.current?.clearLayers();
        mapRef.current.off('click', DrawRectangle);
      }
    };
  }, [isDrawRectangle]);

  //DRAW LINES FROM STORE
  useEffect(() => {
    if (
      mapRef.current &&
      storedLinesCoordinates &&
      editableLineIndex === null &&
      storedLinesCoordinates.length > 0
    ) {
      setUpdatedLineCoordinate(storedLinesCoordinates);
      storedLinesCoordinates.forEach(coord => {
        const polyline = L.polyline(
          convertPointCoordinatesToLatLngArray(coord.pointsCoordinates),
          { color: coord.color }
        );
        if (polyline && drawnItemsRef.current) {
          // console.log('drawnItemsRef.current', drawnItemsRef.current);
          // console.log('lineMarkersRef.current', lineMarkersRef.current);
          polyline.addTo(drawnItemsRef.current);
        }
      });
    }
    return () => {
      drawnItemsRef.current?.clearLayers();
    };
  }, [storedLinesCoordinates, updatedLineCoordinate, editableLineIndex]);

  //DRAW MARKERS
  useEffect(() => {
    if (isDragEnd && editableLineIndex !== null && updatedLineCoordinate) {
      console.log('>>>>>>>>>>>>>>>draw markers');
      drawLineMarkers({
        activeLineIndex: editableLineIndex,
        linesArray: updatedLineCoordinate,
        markerDragHandler,
        markerDragStartHandler,
        markerDragEndHandler,
        markersLayer: lineMarkersRef,
      });
    }
  }, [
    isDragEnd,
    editableLineIndex,
    updatedLineCoordinate,
    markerDragHandler,
    markerDragStartHandler,
    markerDragEndHandler,
  ]);

  //DRAW LINE FROM STATE
  useEffect(() => {
    if (editableLineIndex !== null && updatedLineCoordinate) {
      updatedLineCoordinate.map(coord => {
        const polyline = L.polyline(
          convertPointCoordinatesToLatLngArray(coord.pointsCoordinates),
          { color: coord.color }
        );
        if (polyline && drawnItemsRef.current) {
          polyline.addTo(drawnItemsRef.current);
        }
      });
    }
    return () => {
      setIsDragEnd(false);
      drawnItemsRef.current?.clearLayers();
    };
  }, [editableLineIndex, updatedLineCoordinate, isDragEnd]);

  //DRAW AREA FROM STORE AND SET CONSTRAINTS
  useEffect(() => {
    if (
      drawnRectsRef.current &&
      storedInitialAreaCoordinate &&
      !isDrawRectangle
    ) {
      const firstPoint = L.latLng(
        storedInitialAreaCoordinate.firstCoord[0],
        storedInitialAreaCoordinate.firstCoord[1]
      );
      const lastPoint = L.latLng(
        storedInitialAreaCoordinate.lastCoord[0],
        storedInitialAreaCoordinate.lastCoord[1]
      );
      const bounds = L.latLngBounds(firstPoint, lastPoint);
      if (bounds) {
        const rectangle = L.rectangle(bounds).addTo(drawnRectsRef.current);
        setConstraints(bounds);
      }
    }
  }, [storedInitialAreaCoordinate, isDrawRectangle]);

  return (
    <>
      <div
        ref={mapContainerRef}
        className="relative h-full w-full rounded-lg mb-[2px]"
      ></div>
    </>
  );
};

// // get map controls elements and set Refs
// if (editBarRefControl.current) {
//   const container = editBarRefControl.current.getContainer();
//   const drawBtn = drawLineRefControl.current?.getContainer();
//   const deleteBtn = deleteRefControl.current?.getContainer();

//   if (drawBtn) drawLineButtonRef.current = drawBtn;
//   if (deleteBtn) deleteLineButtonRef.current = deleteBtn;

//   if (
//     container &&
//     drawLineButtonRef.current &&
//     deleteLineButtonRef.current
//   ) {
//     container.appendChild(drawLineButtonRef.current);
//     container.appendChild(deleteLineButtonRef.current);
//   }
// }
