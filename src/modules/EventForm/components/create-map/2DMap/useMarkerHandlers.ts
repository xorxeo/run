import { useCallback, useEffect, useState } from 'react';
import { DistanceLine } from '../createMap.typings';
import { updateCoordinates } from './2DMap.utils';

export function useMarkerHandlers(
  initial: DistanceLine[] | null,
//   lineIdx: number | null
) {
  const [coordinates, setCoordinates] = useState<DistanceLine[] | null>(
    initial
  );
  const [editableLinePointIndex, setEditableLinePointIndex] = useState<
    number | null
        >(null);
    
    const [updated, setUpdated] = useState<DistanceLine[]>([]);
    
     useEffect(() => {
       setCoordinates(initial);
          console.log('setCoordinates in HOOK', coordinates);
     }, [initial]);

   
    
  const markerDragStart = useCallback(
    (marker: L.Marker, lineIdx: number) => {
      const markerCoordinate: L.LatLng = {} as L.LatLng;
      let searchableLinePointIndex: number;

      markerCoordinate.lat = marker.getLatLng().lat;
      markerCoordinate.lng = marker.getLatLng().lng;

      const linePoints = initial![lineIdx].pointsCoordinates;

      if (linePoints && linePoints.length > 0 && markerCoordinate) {
        searchableLinePointIndex = linePoints.findIndex(element => {
          return (
            element.latitude.toPrecision(10) ===
              markerCoordinate.lat.toPrecision(10) &&
            element.longitude === markerCoordinate.lng
          );
        });
        console.log('searchableLinePointIndex', searchableLinePointIndex);
        setEditableLinePointIndex(searchableLinePointIndex);
      }
    },
    [initial]
  );

  const markerDrag = useCallback(
    (marker: L.Marker<any>, lineIdx: number) => {
      setCoordinates(prevState => {
        const newLineCoordinate = updateCoordinates({
          lineIdx,
          lines: prevState!,
          pointCoordinates: marker.getLatLng(),
          pointIdx: editableLinePointIndex!,
        });
        return newLineCoordinate;
      });
        //   console.log('pastState', coordinates);
    },
    [editableLinePointIndex]
  );

  const markerDragEnd = useCallback(
    (marker: L.Marker<any>, lineIdx: number) => {
    //   setEditableLinePointIndex(null);
    },
    [coordinates]
  );

  return {
    markerDragStart,
    markerDrag,
    markerDragEnd,
    coordinates,
  };
}
