'use client';

import { fetchCollection } from '@/app/actions';
import {
  deleteStoredDistanceById,
  selectDistancesFromDatabase,
  selectIsInitialFetched,
  setInitialFetched,
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
import { useFormManager } from '@/services/hooks/useFormManager';
import { DocumentData } from 'firebase/firestore';
import { Suspense, use, useEffect, useState } from 'react';
import { useInitialDistanceFetch } from '@/app/admin/hooks/use-initial-distance-fetch';
import { Loader } from '@mantine/core';

export default function EditDistance({ params }: { params: { id: string } }) {
  const { handleEntityEdit, handleEntityDelete } = useFormManager();

  const { error, loading, distancesFromDatabase } = useInitialDistanceFetch();

  return (
    <div className="edit-distance-container flex w-full">
      {loading ? (
        <Loader variant="bars" color="#facc15" />
      ) : (
        <PreviewEntitiesList
          title="Edit Distance"
          entities={distancesFromDatabase}
          onEdit={() => handleEntityEdit('admin/createDistance/edit/distance')}
          onDelete={() =>
            handleEntityDelete('distances', deleteStoredDistanceById)
          }
        />
      )}

      {error && <div>{error}</div>}
    </div>
  );
}
