import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  FC,
  useContext,
  useEffect,
} from 'react';
import { FirebaseContext } from '@/containers/FirebaseContainer';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import {
  addNewDistance,
  editDistance,
  selectNewDistances,
} from '../store/eventFormSlice';
import { DistanceFormValues, distancesSchema } from '../event-form.schema';
import {
  FormTextField,
  FormTextFieldProps,
} from '@/components/text-field/FormTextField';
import { nanoid } from 'nanoid';

import { InputMask } from '@react-input/mask';
import {
  WEB_LINK_INPUT_MASK,
} from './create-event-form/create-event-form.consts';
import { inputStyle } from '@/styles/eventFormStyles';

const TIME_REG_EXP = /(?: [01] | 2(?![4 - 9])){ 1}\d{ 1}: [0-5]{ 1}\d{ 1}/;

const DISTANCE_DEFAULT_VALUES: DistanceFormValues = {
  id: '0',
  
    name: '',
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

};

export const CreateDistance: FC = () => {
  const { db } = useContext(FirebaseContext);
 
  const {
    register,
    handleSubmit,
    formState,
    setError,
    setValue,
    control,
    reset,
  } = useForm<DistanceFormValues>({
    resolver: zodResolver(distancesSchema),
    mode: 'onChange',
    // TODO: validate onBlur
    reValidateMode: 'onBlur',
    defaultValues: DISTANCE_DEFAULT_VALUES,
  });

  const router = useRouter();
  const { id: distanceId } = router.query;
  const dispatch = useDispatch();
  const storedDistances = useSelector(selectNewDistances);

  const editedDistance = storedDistances.find((distance) => {
    return distance.id === distanceId;
  });

  const { errors } = formState;

  useEffect(() => {
    if (editedDistance) {
      reset(editedDistance);
    } else {
      setValue('id', nanoid());
    }
  }, [distanceId]);

  const setDataFromForm = (rawData: DistanceFormValues) => {
    const parsedData = distancesSchema.parse(rawData);
    return parsedData;
  };

  const onSubmit: SubmitHandler<DistanceFormValues> = async (data) => {
  
    try {
      setDataFromForm(data);
      if (editedDistance) {
        console.log('edit');
        dispatch(editDistance(data));
      } else {
        console.log('add');
        dispatch(addNewDistance(data));
      }
      // await addDataInDatabase(db, "distances", "event 1", dataObject)
      router.back();
    } catch (error) {
      if (error instanceof Error) {
     
        setError('root', { message: error.message });
      }
    }
  };


  return (
    <div className="flex flex-col m-auto h-[60%] w-[80%] hero-content shadow-md rounded-md">
      Create distance
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[80%] lg:w-[55%] gap-3"
      >
        <input type="hidden" {...register('id')} />

        <FormTextField
          name="name"
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

        <div className="flex justify-between">
          <button type="button" onClick={() => router.back()}>
            Cancel
          </button>
          <button onClick={handleSubmit(onSubmit)}>Submit</button>
        </div>
      </form>
    </div>
  );
};
