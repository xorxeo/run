'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputMask } from '@react-input/mask';
import { nanoid } from 'nanoid';

import { useAppDispatch, useAppSelector } from '../../../app/redux/hooks';

import {
  DISTANCE_DEFAULT_VALUES,
  DistanceFormValues,
  distancesSchema,
} from '../event-form.schema';
import {
  FormTextField,
  FormTextFieldProps,
} from '@/components/text-field/FormTextField';
import {
  addNewDistance,
  storeEditedDistance,
  selectDraftNewDistanceFormValues,
  // selectNewDistances,
  storeDraftNewDistanceFormValues,
  selectDistancesFromDatabase,
} from '../../../app/redux/features/eventFormSlice';
import { WEB_LINK_INPUT_MASK } from './create-event-form/create-event-form.consts';
import { distanceFormInputsNames } from '../event-form.typings';
import { useFormManager } from '@/services/hooks/useFormManager';
import { NavigationEvents } from '@/services/NavigationEvents';
import { ConfirmationDialog } from '@/components/modal/ConfirmationDialog';
import { useDisclosure } from '@mantine/hooks';
import { Button } from '@mantine/core';
import { set } from 'zod';

// import {experimental_useFormStatus} from 'react-dom'

export const CreateDistance = ({ params }: { params: { id: string } }) => {
  const [distanceId, setDistanceId] = useState(params.id);

  const router = useRouter();

  const storedDraftNewDistanceFormValues = useAppSelector(
    selectDraftNewDistanceFormValues
  );

  const storedDistances = useAppSelector(selectDistancesFromDatabase);

  const editedDistance = storedDistances.find(distance => {
    return distance.id === distanceId;
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, touchedFields },
    setError,
    setValue,
    control,
    reset,
    getValues,
  } = useForm<DistanceFormValues>({
    resolver: zodResolver(distancesSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: distanceId ? editedDistance : DISTANCE_DEFAULT_VALUES,
  });

  const {
    handleGetFormValues,
    handleSetFormValues,
    handleSubmitNewForm,
    handleSubmitEditedForm,
  } = useFormManager();

  const [isLeavePageModalOpen, setIsLeavePageModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitNewFormModalOpen, setIsSubmitNewFormModalOpen] =
    useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    //  console.log('CreateDistance distanceId', params.id);
    setDistanceId(params.id);
  }, [params.id]);

  useEffect(() => {
    if (!distanceId) {
      //   handleSetFormValues({
      //     resetFormValues: reset,
      //     storedValues: storedDraftNewDistanceFormValues,
      //   });
      setValue('id', nanoid());
    }
    // else if (distanceId) {
    //   console.log('editedDistance', editedDistance);
    //   handleSetFormValues({
    //     resetFormValues: reset,
    //     storedValues: editedDistance,
    //   });
    // }
  }, []);

  useEffect(() => {
    // return () => {
    //   if (!distanceId) {
    //     handleGetFormValues({
    //       getInputsValuesMethod: getValues,
    //       reducerStoreInputsValues: storeDraftNewDistanceFormValues,
    //       inputsNames: distanceFormInputsNames,
    //     });
    //   } else if (distanceId) {
    //     console.log('GET');
    //     handleGetFormValues({
    //       getInputsValuesMethod: getValues,
    //       reducerStoreInputsValues: storeEditedDistance,
    //       inputsNames: distanceFormInputsNames,
    //     });
    //   }
    // };
  }, []);

  const onSubmitNew: SubmitHandler<DistanceFormValues> = formData => {
    console.log('fdfdf');
    handleSubmitNewForm({
      onSubmitData: formData,
      collectionName: 'distances',
      reducerAddNew: addNewDistance,
      redirectPathAfterSubmit: '/',
      resetFormValues: reset(DISTANCE_DEFAULT_VALUES),
      setError,
    });
    setIsLeavePageModalOpen(false);
     router.push('/admin/createDistance/edit/distance');
  };

  const onSubmitEdited: SubmitHandler<DistanceFormValues> = formData => {
    handleSubmitEditedForm({
      collectionName: 'distances',
      setError,
      updatedData: formData,
      storeEditedDocument: storeEditedDistance,
    });
    // setIsLeavePageModalOpen(false);
    close();
    router.back();
  };
  // if (errors) {
  //   console.log('errors', errors)
  // }

  return (
    <div className="flex flex-col m-auto w-[100%] items-center shadow-md rounded-md bg-slate-100">

      {isSubmitModalOpen && (
        <ConfirmationDialog
          opened={opened}
          close={close}
          open={open}
          message="Save changes?"
          cancelButtonTitle="Cancel"
          submitButtonTitle="Save"
          onCancel={() => close()}
          onSubmit={handleSubmit(onSubmitEdited)}
        />
      )}

      {isLeavePageModalOpen && (
        <ConfirmationDialog
          opened={opened}
          close={close}
          open={open}
          message="The changed data will not be saved. Continue?"
          cancelButtonTitle="Отменить"
          submitButtonTitle="Продолжить"
          onCancel={() => {
            close();
          }}
          onSubmit={() => {
            close();
            router.back();
          }}
        />
      )}

      {isSubmitNewFormModalOpen && (
        <ConfirmationDialog
          opened={opened}
          close={close}
          open={open}
          message="Submit New distance to DB?"
          cancelButtonTitle="Cancel"
          submitButtonTitle="Submit"
          onCancel={() => close()}
          onSubmit={handleSubmit(onSubmitNew)}
        />
      )}

      <div className="flex justify-between ">
      
          <Button
            type="button"
            color="red"
            uppercase={true}
            onClick={() => {
              console.log('dfd');
              if (isValid && isDirty) {
                setIsLeavePageModalOpen(!isLeavePageModalOpen);
                open();
                // router.back();
              } else {
                router.back();
              }
            }}
          >
            Cancel
          </Button>
        

        {!distanceId && (
          // <button onClick={handleSubmit(onSubmit)}>Submit</button>
          <Button
            type="button"
            color={isValid ? 'yellow' : 'gray'}
            uppercase={true}
            disabled={isValid ? false : true}
            onClick={() => {
              setIsSubmitNewFormModalOpen(!isSubmitNewFormModalOpen);
              open();
             
              console.log('sub');
            }}
            
          >
            Submit
          </Button>
        )}

        {distanceId && (
          <Button
            disabled={isDirty ? false : true}
            onClick={() => {
              if (isValid) {
                setIsSubmitModalOpen(!isSubmitModalOpen);
                open();
              }
            }}
            className={'button-active hover:bg-yellow-400'}
          >
            Save changes
          </Button>
        )}
      </div>

      {distanceId ? <h1>Edit distance</h1> : <h1>Create distance</h1>}

      <form
        onSubmit={handleSubmit(onSubmitNew)}
        className="flex flex-col w-[80%] lg:w-[55%] gap-2"
      >
        <input type="hidden" {...register('id')} />

        <FormTextField
          name="distanceName"
          placeholder="distance name"
          type="text"
          autoFocus
          control={control}
          label="Distance name"
          withAsterisk={true}
          inputSize="sm"
        />

        <FormTextField
          name="cost"
          placeholder="distance cost"
          control={control}
          type="text"
          label="Cost"
          mask={'000 000 000 000'}
          replacement={'0'}
          inputSize="sm"
        />

        <FormTextField
          name="distanceLength"
          control={control}
          type="text"
          label="Distance length"
          placeholder="distance length in meters"
          inputSize="sm"
        />

        <InputMask<FormTextFieldProps>
          component={FormTextField}
          name="linkToDownloadDistanceRoute"
          type="text"
          control={control}
          label="Link to download distance route"
          placeholder="https://www.example.com"
          mask={WEB_LINK_INPUT_MASK.mask}
          replacement={WEB_LINK_INPUT_MASK.replacement}
          inputSize="sm"
        />

        <InputMask<FormTextFieldProps>
          component={FormTextField}
          name="linkToViewDistanceRouteOnTheMap"
          control={control}
          label="Link to view distance route on the map"
          placeholder="https://www.example.com"
          mask={WEB_LINK_INPUT_MASK.mask}
          replacement={WEB_LINK_INPUT_MASK.replacement}
          inputSize="sm"
        />

        <FormTextField
          name="refreshmentPoints"
          control={control}
          type="text"
          label="Refreshment points"
          placeholder="number of food outlets"
          inputSize="sm"
        />

        <span className="flex justify-center">Start point</span>
        <FormTextField
          name="startPointDescription"
          control={control}
          label="Description"
          placeholder="start point description"
          inputSize="sm"
        />

        <div className="flex flex-row space-x-2">
          <FormTextField
            name="longitude"
            type="text"
            control={control}
            placeholder="longitude"
            label="Start point longitude"
            min={-180}
            max={180}
            inputSize="sm"
          />

          <FormTextField
            name="latitude"
            type="text"
            control={control}
            label="Start point latitude"
            placeholder="latitude"
            min={-90}
            max={90}
            inputSize="sm"
          />
        </div>

        <InputMask<FormTextFieldProps>
          component={FormTextField}
          name="startTime"
          control={control}
          label="Start time"
          placeholder='start time in format "HH:MM"'
          mask={'__:__'}
          replacement={'_'}
          inputSize="sm"
        />

        <FormTextField
          name="timeLimit"
          control={control}
          label="Time limit"
          placeholder="time limit"
          inputSize="sm"
        />

        <FormTextField
          name="totalElevation"
          control={control}
          label="Total elevation"
          placeholder="total elevation in meters"
          inputSize="sm"
        />

        {/* <div>
          <h1>Upload photos</h1>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            multiple
            {...register("images", { required: true })}
          />
          <div className="h-5">
            {errors.images && (
              <div className="text-red-700">
                {errors.images?.message === FilesErrorCodes.InvalidSize &&
                  `This files ${invalidSizeFiles.join(", ")} have `}
              </div>
            )}
            {errors.images && (
              <div className="text-red-700">
                {errors.images?.message === FilesErrorCodes.InvalidMIMETypes &&
                  `This files ${InvalidMIMETypesFiles.join(
                    ", "
                  )} have wrong types`}
              </div>
            )}
          </div>
        </div> */}
      </form>
    </div>
  );
};
