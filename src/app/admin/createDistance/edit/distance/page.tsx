'use client';

import { fetchCollection } from '@/app/actions';
import {
  deleteStoredDistanceById,
  selectDistancesFromDatabase,
  storeDistancesFromDatabase,
} from '@/app/redux/features/eventFormSlice';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { EventsList } from '@/components/eventsList';
import { LoadingSkeleton } from '@/components/loading-skeleton/LoadingSkeleton';
import firebaseApp from '@/firebase/initFirebase';
import {
  Entities,
  PreviewEntitiesList,
} from '@/modules/EventForm/components/PreviewEntitiesList';
import { DistanceFormValues } from '@/modules/EventForm/event-form.schema';
import { UseFormManager } from '@/services/hooks/useFormManager';
import { DocumentData } from 'firebase/firestore';
import { Suspense, use, useEffect, useState } from 'react';

export default function EditDistance({ params }: { params: { id: string } }) {
  const [entities, setEntities] = useState<string | DocumentData[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { handleEntityEdit, handleEntityDelete } = UseFormManager();

  const dispatch = useAppDispatch();
  const distancesFromDatabase = useAppSelector(selectDistancesFromDatabase);

  const fetchData = async () => {
    setLoading(true);
    console.log('fetchData');
    const res = await fetchCollection('distances');
    if (typeof res === 'string') {
      setError(res);
    }
    setEntities(res);
    dispatch(storeDistancesFromDatabase(res as DistanceFormValues[]));
    setLoading(false);
  };

  useEffect(() => {
    if (distancesFromDatabase.length === 0) {
      fetchData();
    } 
  }, []);

  return (
    <div className="edit-distance-container flex w-full">
      {loading && <LoadingSkeleton />}
      <PreviewEntitiesList
        title="Edit Distance"
        entities={distancesFromDatabase}
        onEdit={() => handleEntityEdit('admin/createDistance/edit/distance')}
        onDelete={() =>
          handleEntityDelete('distances', deleteStoredDistanceById)
        }
      />
      {error && <div>{error}</div>}
    </div>
  );
}
