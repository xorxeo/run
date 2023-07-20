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
import { inputStyle } from '@/styles/eventFormStyles';
import { distanceFormInputsNames } from '../event-form.typings';
import { UseFormManager } from '@/services/hooks/useFormManager';
import { OverlayingPopup } from '@/components/overlayingPopup/OverlayingPopup';
import { NavigationEvents } from '@/services/NavigationEvents';
import { MainPopup } from '@/components/mainPopup/MainPopup';
import { Dialog } from '@/components/dialog/Dialog';
import { DIALOGCASES } from '@/components/dialog/dialogCases';

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
  } = UseFormManager();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    handleSubmitNewForm({
      onSubmitData: formData,
      collectionName: 'distances',
      reducerAddNew: addNewDistance,
      redirectPathAfterSubmit: '/',
      resetFormValues: reset(DISTANCE_DEFAULT_VALUES),
      setError,
    });
    setIsModalOpen(false);
  };

  const onSubmitEdited: SubmitHandler<DistanceFormValues> = formData => {
    handleSubmitEditedForm({
      collectionName: 'distances',
      setError,
      updatedData: formData,
    });
    setIsModalOpen(false);
    router.back();
  };
  // if (errors) {
  //   console.log('errors', errors)
  // }

  return (
    <div className="flex flex-col m-auto  shadow-md rounded-md ">
      {/* <Suspense fallback={'Suspense'}>
        <NavigationEvents
          sideEffectLogic={() => {
            setIsModalOpen(!isModalOpen);
          }}
        />
      </Suspense> */}

      <MainPopup
        isOpened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customStyle=" min-w-[600px] min-h-[400px]"
        // title='Blah-blah'
      >
        {/* {distanceId ? (
          <Dialog
            content="Unsaved changes. Are you sure you want to leave this page?"
            buttons={[
              { buttonText: 'Cancel', buttonOnClick: () => setIsModalOpen(!isModalOpen) },
              {
                buttonText: 'Continue',
                buttonOnClick: () => router.back(),
              },
            ]}
          />
        ) : (
          <Dialog
            content="Submit form?"
            buttons={[
              {
                buttonText: 'No',
                buttonOnClick: () => {
                  setIsModalOpen(!isModalOpen);
                  router.back();
                },
              },
              {
                buttonText: 'Submit',
                buttonOnClick: handleSubmit(onSubmitNew),
              },
            ]}
          />
        )} */}
        {/* {Object.keys(DIALOGCASES).map(key => {
          const dialogCase = DIALOGCASES[key as keyof typeof DIALOGCASES];
          for (let actionKey in dialogCase) {
            const action = dialogCase[actionKey as keyof typeof dialogCase];
            if ('content' in action) {
              return (
                <Dialog
                  key={key}
                  content={action.content}
                  buttons={action.buttons}
                />
              );
            }
          }
          return null;
        })} */}
      </MainPopup>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => {
            console.log('isDirty', isDirty);
            if (isValid && isDirty) {
              console.log('isDirty', isDirty);
              setIsModalOpen(!isModalOpen);
            } else {
              router.back();
            }
          }}
          className={' button-active hover:bg-yellow-400'}
        >
          Cancel
        </button>
        {!distanceId && (
          // <button onClick={handleSubmit(onSubmit)}>Submit</button>
          <button
            type="submit"
            onClick={() => {
              if (isValid) {
                setIsModalOpen(!isModalOpen);
              }
            }}
            className={
              isValid ? 'button-active bg-yellow-400 ' : 'button-disabled'
            }
          >
            Submit
          </button>
        )}
        {distanceId && (
          // <button onClick={handleSubmit(onSubmitEdited)}>Save changes</button>
          <button
            onClick={() => {
              if (isValid) {
                setIsModalOpen(!isModalOpen);
              }
            }}
            className={'button-active hover:bg-yellow-400'}
          >
            Save changes
          </button>
        )}
      </div>

      {distanceId ? <h1>Edit distance</h1> : <h1>Create distance</h1>}

      <form
        onSubmit={handleSubmit(onSubmitNew)}
        className="flex flex-col w-[80%] lg:w-[55%] gap-3"
      >
        <input type="hidden" {...register('id')} />

        <FormTextField
          name="distanceName"
          placeholder="distance name"
          type="text"
          autoFocus
          control={control}
          label="Distance name"
          style={inputStyle}
        />

        <FormTextField
          name="cost"
          placeholder="distance cost"
          control={control}
          type="text"
          label="Cost"
          mask={'000 000 000 000'}
          replacement={'0'}
          style={inputStyle}
        />

        <FormTextField
          name="distanceLength"
          control={control}
          type="text"
          label="Distance length"
          placeholder="distance length in meters"
          style={inputStyle}
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
          style={inputStyle}
        />

        <InputMask<FormTextFieldProps>
          component={FormTextField}
          name="linkToViewDistanceRouteOnTheMap"
          control={control}
          label="Link to view distance route on the map"
          placeholder="https://www.example.com"
          mask={WEB_LINK_INPUT_MASK.mask}
          replacement={WEB_LINK_INPUT_MASK.replacement}
          style={inputStyle}
        />

        <FormTextField
          name="refreshmentPoints"
          control={control}
          type="text"
          label="Refreshment points"
          placeholder="number of food outlets"
          style={inputStyle}
        />

        <span className="flex justify-center">Start point</span>
        <FormTextField
          name="startPointDescription"
          control={control}
          label="Description"
          placeholder="start point description"
          style={inputStyle}
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
            style={inputStyle}
          />
          <FormTextField
            name="latitude"
            type="text"
            control={control}
            label="Start point latitude"
            placeholder="latitude"
            min={-90}
            max={90}
            style={inputStyle}
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
          style={inputStyle}
        />

        <FormTextField
          name="timeLimit"
          control={control}
          label="Time limit"
          placeholder="time limit"
          style={inputStyle}
        />

        <FormTextField
          name="totalElevation"
          control={control}
          label="Total elevation"
          placeholder="total elevation in meters"
          style={inputStyle}
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
