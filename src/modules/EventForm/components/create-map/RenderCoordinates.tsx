import { FC } from 'react';
import { AreaCoordinates } from './createMap.typings';

type Coordinates = L.LatLng[] | L.LatLng[][] | L.LatLng[][][];
type RenderCoordinatesProps = {
  coordinates: AreaCoordinates;
};

export const RenderCoordinates = ({ coordinates }: RenderCoordinatesProps) => {
  //   console.log('coordinates', coordinates);

  return (
    <div className='flex flex-col'>
      <span>{coordinates.firstCoord}</span>
      <span>{coordinates.lastCoord}</span>
    </div>
  );
};

{
  /** @ts-ignore */
}
