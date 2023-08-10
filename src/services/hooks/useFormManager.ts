import { ActionCreatorWithPayload, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/app/redux/store';
import {
  addNewDistance,
  deleteEvent,
  // deleteNewDistance,
  deleteStoredDistanceById,
  eventFormSlice,
  selectDistancesFromDatabase,
  selectEventsFromDatabase,
} from '@/app/redux/features/eventFormSlice';
import {
  distanceFormInputsNames,
  eventFormInputsNames,
} from '../../modules/EventForm/event-form.typings';
import {
  DistanceFormValues,
  EventFormValues,
} from '@/modules/EventForm/event-form.schema';
import { useRouter } from 'next/navigation';
import firebaseApp from '@/firebase/initFirebase';
import { collection } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { useCallback } from 'react';

export const isDistances = (items: unknown): items is DistanceFormValues[] => {
  return (items as DistanceFormValues[]).every((item) => !!item.distanceName);
};

export const isEvents = (items: unknown): items is EventFormValues[] => {
  return (items as EventFormValues[]).every((item) => !!item.eventName);
};

export const isError = (items: unknown) => {
  if (typeof items === 'string') return true;
};

type ActionTypes = ReturnType<
  (typeof eventFormSlice.actions)[keyof typeof eventFormSlice.actions]
>;

type ActionKeys = typeof eventFormSlice.actions;

type ActionMap = {
  [K in keyof ActionKeys]: ActionKeys[K] extends PayloadAction<infer T>
    ? (payload: T) => void
    : () => void;
};

type HandleSubmitFormProps = {
  collectionName: string;
  onSubmitData: DistanceFormValues | EventFormValues;
  reducerAddNew: ActionCreatorWithPayload<any>;
  resetFormValues: any;
  redirectPathAfterSubmit: string;
  setError: any;
};

type HandleGetFormValuesProps = {
  getInputsValuesMethod: (inputName: string) => void;
  reducerStoreInputsValues: ActionCreatorWithPayload<any>;
  inputsNames: any;
};

type HandleSetFormValuesProps = {
  storedValues: any;
  resetFormValues: (values?: any) => void;
};

type HandleSubmitEditedFormProps = {
  collectionName: string;
  updatedData: DistanceFormValues | EventFormValues;
  setError: any;
  storeEditedDocument: ActionCreatorWithPayload<any>;
};


type HandleEntityDeleteProps = {
  fieldName?: keyof DistanceFormValues | keyof EventFormValues;
  setFieldValues?: any;
};
type HandleEntityDelete = {
  (): (id: string) => void;
  (props: HandleEntityDeleteProps): (id: string) => void;
};

export const useFormManager = () => {
  const dispatch = useAppDispatch();
  const storedDistances = useAppSelector(selectDistancesFromDatabase);
  const storedEvents = useAppSelector(selectEventsFromDatabase);

  const router = useRouter();

  const handleSubmitEditedForm = async ({
    collectionName,
    updatedData,
    setError,
    storeEditedDocument,
  }: HandleSubmitEditedFormProps) => {
    console.log('updatedData', updatedData);
    try {
      firebaseApp.updateDocument(collectionName, updatedData);
      dispatch(storeEditedDocument(updatedData));
    } catch (error) {
      if (error instanceof Error) {
        setError('root', { message: error.message });
      }
    }
  };

  const handleSubmitNewForm = async ({
    collectionName,
    onSubmitData,
    reducerAddNew,
    resetFormValues,
    redirectPathAfterSubmit,
    setError,
  }: HandleSubmitFormProps) => {
    try {
      firebaseApp.addDocument(collectionName, onSubmitData);
      dispatch(reducerAddNew(onSubmitData));
      // router.push(redirectPathAfterSubmit);
      router.back();
      resetFormValues();
    } catch (error) {
      if (error instanceof Error) {
        setError('root', { message: error.message });
      }
    }
  };

  const handleGetFormValues = ({
    getInputsValuesMethod: getInputsValues,
    reducerStoreInputsValues,
    inputsNames,
  }: HandleGetFormValuesProps) => {
    if (inputsNames && inputsNames.hasOwnProperty('distanceName')) {
      const values = {} as {
        [key in keyof typeof distanceFormInputsNames]: any;
      };
      for (let input in distanceFormInputsNames) {
        values[input as keyof typeof distanceFormInputsNames] = getInputsValues(
          input as keyof DistanceFormValues
        );
      }
      dispatch(reducerStoreInputsValues(values));
    }

    if (inputsNames.hasOwnProperty('eventName')) {
      const values = {} as { [key in keyof typeof eventFormInputsNames]: any };
      for (let input in eventFormInputsNames) {
        values[input as keyof typeof eventFormInputsNames] = getInputsValues(
          input as keyof EventFormValues
        );
      }
      dispatch(reducerStoreInputsValues(values));
    }
  };

  const handleSetFormValues = ({
    resetFormValues: reset,
    storedValues,
  }: HandleSetFormValuesProps) => {
    reset(storedValues);
  };

  const handleEntityDelete = (
    collectionName: string,
    deleteFromStoreReducer: ActionCreatorWithPayload<any>
  ) => {
    return (id: string) => {
      firebaseApp.deleteDocumentByID(collectionName, id);
      dispatch(deleteFromStoreReducer(id));
    };
  };

  const handleEntityEdit = (path: string) => {
    return (id: string) => router.push(`${path}/${id}`);
  };

  return {
    handleGetFormValues,
    handleSubmitNewForm,
    handleSubmitEditedForm,
    handleSetFormValues,
    handleEntityEdit,
    handleEntityDelete,
  };
};
