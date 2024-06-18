'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { YMap, YMapLocationRequest } from '@yandex/ymaps3-types';
// import { YMapListener } from '@yandex/ymaps3-types/imperative';

// const YMapProvider: FC<{ children?: React.ReactNode }> = ({ children }) => {
//   const mapRef = useRef<HTMLDivElement | null>(null);

//   return (
//     <>
//       <div className="mapppp" ref={mapRef}></div>
//       <Script
//         id="maps"
//         src={`https://api-maps.yandex.ru/v3/?apikey=${process.env.NEXT_PUBLIC_YMAP_APIKEY}&lang=ru_RU`}
//         // onReady={() => {
//         //   ymaps3.ready.then(() => {
//         //     if (mapRef.current) {
//         //       const q = new ymaps3.YMap(mapRef.current, {
//         //         location: {
//         //           center: [55.75, 37.62],
//         //           zoom: 10,
//         //         },
//         //       });
//         //     }
//         //   });
//         // }}
//       />
//       {children}
//     </>
//   );
// };

// export default YMapProvider;

export const YandexMapsScript: FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<YMap>();

  async function initMap(ref: HTMLDivElement): Promise<YMap> {
    await ymaps3.ready;

    const LOCATION: YMapLocationRequest = {
      center: [37.623082, 55.75254],
      zoom: 9,
    };

    const { YMap, YMapDefaultSchemeLayer } = ymaps3;

    const map = new YMap(ref, { location: LOCATION });
    map.addChild(new YMapDefaultSchemeLayer({ theme: 'dark' }));
    
    // map.addChild(
    //   new YMapListener({
    //     layer: 'any',
    //     onClick: () => {
    //       console.log('wow');
    //     },
    //   })
    // );

    console.log('map', map);
    setMap(map);
    return map;
  }

  if (map) {
  }

  useEffect(() => {
    if (map) {
      console.log('map useEffect', map);
    }
  }, [map]);
  return (
    <>
      <div className="yandex-maps w-96 h-96" ref={mapRef}></div>
      <Script
        id="yandex-maps"
        src={`https://api-maps.yandex.ru/v3/?apikey=${process.env.NEXT_PUBLIC_YMAP_APIKEY}&lang=ru_RU`}
        onReady={() => {
          if (mapRef.current) {
            initMap(mapRef.current);
          }
        }}
      />
    </>
  );
};
