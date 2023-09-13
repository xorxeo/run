'use client';

import { fetchCollection } from '@/app/actions';
import { EventsList } from '@/components/eventsList';
import firebaseApp from '@/firebase/initFirebase';
import { PreviewEntitiesList } from '@/modules/EventForm/components/PreviewEntitiesList';
import { DistanceFormValues } from '@/modules/EventForm/event-form.schema';
import { Loader } from '@mantine/core';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function EditEvent() {
  const [distances, setDistances] = useState<DocumentData[] | string>([]);
  const [entities, setEntities] = useState<{ id: string; name: string }[]>([]);
//   if (typeof distances !== 'string') {
//     for (let distance of distances) {
//       setEntities((prev) => [
//         ...prev,
//         { id: distance.id, name: distance.name },
//       ]);
//     }
//   }
//   useEffect(() => {
//       fetchCollection('distances').then((res) => {
//         console.log('res', res)
//       setDistances(res);
//     });
//   }, []);

  return (
    <div>
      Edit Event
      <Loader
        variant='bars'
        color='#facc15'
      />
      {/* <EventsList /> */}
      {/* <PreviewEntitiesList entities={entities} /> */}
    </div>
  );
}
