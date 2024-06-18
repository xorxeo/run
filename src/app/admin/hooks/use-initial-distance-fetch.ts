import { fetchCollection } from '@/app/actions';
import {
  selectDistancesFromDatabase, selectIsInitialFetched,
  setInitialFetched,
  storeDistancesFromDatabase,
} from '@/app/redux/features/eventFormSlice';
import { DistanceFormValues } from '@/modules/EventForm/event-form.schema';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';

export type UseInitialDistanceFetchReturn = {
  error: string;
  loading: boolean;
  distancesFromDatabase: DistanceFormValues[];
}

export const useInitialDistanceFetch = (): UseInitialDistanceFetchReturn => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  const dispatch = useAppDispatch();
  const distancesFromDatabase = useAppSelector(selectDistancesFromDatabase);
  const isInitialFetched = useAppSelector(selectIsInitialFetched);

  const fetchData = useCallback(async () => {
    setLoading(true);
    console.log('fetchData');
    const res = await fetchCollection('distances');
    if (typeof res === 'string') {
      setError(res);
    }
    dispatch(storeDistancesFromDatabase(res as DistanceFormValues[]));
    dispatch(setInitialFetched(true));
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialFetched) {
      fetchData();
    }
  }, [fetchData, isInitialFetched]);

  return {
    error,
    loading,
    distancesFromDatabase,
  }
};
