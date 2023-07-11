'use client';

import { fetchCollection } from '@/app/actions';
import {
  deleteStoredDistanceById,
  selectDistancesFromDatabase,
  storeDistancesFromDatabase,
} from '@/app/redux/features/eventFormSlice';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { EventsList } from '@/components/eventsList';
import firebaseApp from '@/firebase/initFirebase';
import {
  Entities,
  PreviewEntitiesList,
} from '@/modules/EventForm/components/PreviewEntitiesList';
import { DistanceFormValues } from '@/modules/EventForm/event-form.schema';
import { UseFormManager } from '@/services/hooks/useFormManager';
import { DocumentData } from 'firebase/firestore';
import { use, useEffect, useState } from 'react';

const MOCK = [
  {
    id: '1',
    distanceName: 'Distance 1 MOCK',
    cost: '',
    distanceLength: '',
    linkToDownloadDistanceRoute: '',
    linkToViewDistanceRouteOnTheMap: '',
    refreshmentPoints: '',
    longitude: '',
    latitude: '',
    startPointDescription: '',
    startTime: '',
    timeLimit: '',
    totalElevation: '',
  },
  {
    id: '2',
    distanceName: 'Distance 2 MOCK',
    cost: '',
    distanceLength: '',
    linkToDownloadDistanceRoute: '',
    linkToViewDistanceRouteOnTheMap: '',
    refreshmentPoints: '',
    longitude: '',
    latitude: '',
    startPointDescription: '',
    startTime: '',
    timeLimit: '',
    totalElevation: '',
  },
];

export default function EditDistance({ params }: { params: { id: string } }) {
  const [entities, setEntities] = useState<string | Entities[]>([]);
  const [error, setError] = useState<string>('');

  const { handleEntityEdit, handleEntityDelete } = UseFormManager();

  const dispatch = useAppDispatch();
  const distancesFromDatabase = useAppSelector(selectDistancesFromDatabase);


  useEffect(() => {
    fetchCollection('distances').then((res) => {
      if (typeof res === 'string') {
        setError(res);
      } else {
        // setDistances(res);
        dispatch(storeDistancesFromDatabase(res as DistanceFormValues[]));
        convertToEntity(res);
      }
      console.log('fetchCollection', res);
    });
  }, [dispatch]);

  function convertToEntity(data: DocumentData[]) {
    setEntities(data.map((d) => ({ id: d.id, entityName: d.distanceName })));
  }

  return (
    <div>
      <PreviewEntitiesList
        title="Edit Distance"
        entities={entities}
        onEdit={() => handleEntityEdit('admin/createDistance/edit/distance')}
        onDelete={() =>
          handleEntityDelete('distances', deleteStoredDistanceById)
        }
      />
      {error && <div>{error}</div>}
    </div>
  );
}
