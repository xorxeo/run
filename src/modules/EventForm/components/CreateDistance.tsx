import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Select from '../../../components/Select';
import { useDatabaseManageData } from '@/services/DatabaseManageData';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FirebaseContext } from '@/containers/FirebaseContainer';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

enum ErrorCodes {
  InvalidSize = 'InvalidSize',
  InvalidMIMETypes = '.jpg, .jpeg, .png and .webp files are accepted.',
  RequiredField = 'Field is required',
}

import {
  addDistance,
  editDistance,
  selectDistances,
} from '../store/eventFormSlice';
import {
  DistanceFormValues,
  distancesSchema,
} from './create-event-form/createForm.schema';
import { FormTextField } from '@/components/text-field/FormTextField';
import { type } from 'os';
import { nanoid } from 'nanoid';

const FIVE_MB = 5_242_880;
const ONE_MB = 466700;
const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
const URL_REG_EXP =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const TIME_REG_EXP = /(?: [01] | 2(?![4 - 9])){ 1}\d{ 1}: [0-5]{ 1}\d{ 1}/;

const DISTANCE_DEFAULT_VALUES: DistanceFormValues = {
  id: '0',
  value: {
    name: '',
    cost: 0,
    distanceLength: 0,
    linkToDownloadDistanceRoute: '',
    linkToViewDistanceRouteOnTheMap: '',
    refreshmentPoints: 0,
    longitude: 0,
    latitude: 0,
    startPointDescription: '',
    startTime: '',
    timeLimit: '',
    totalElevation: '',
  },
};

const UrlSchema = z.string().regex(URL_REG_EXP).or(z.string().min(0));

let invalidSizeFiles: string[] = [];
let InvalidMIMETypesFiles: string[] = [];

export const CreateDistance: FC = () => {
  const { db } = useContext(FirebaseContext);
  const { addDataInDatabase } = useDatabaseManageData();
  const [isEdit, setIsEdit] = useState<Boolean | null>(null);

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
    mode: 'onBlur',
    // TODO: validate onBlur
    reValidateMode: 'onChange',
    defaultValues: DISTANCE_DEFAULT_VALUES,
  });

  const router = useRouter();
  const { id: distanceId } = router.query;

  const { errors } = formState;

  const dispatch = useDispatch();
  const storedDistances = useSelector(selectDistances);

  const editedDistance = storedDistances.find((distance) => {
    return distance.id === distanceId;
  });

  useEffect(() => {
    if (editedDistance) {
      if (editedDistance) {
        reset(editedDistance);
      }
    } else {
      setValue('id', nanoid());
    }
  }, [distanceId]);

  const setDataFromForm = (rawData: DistanceFormValues) => {
    const parsedData = distancesSchema.parse(rawData);

    return parsedData;
  };

  const onSubmit: SubmitHandler<DistanceFormValues> = async (data) => {
    console.log('submitting...');
    try {
      setDataFromForm(data);

      if (editedDistance) {
        console.log('edit');

        dispatch(editDistance(data));
      } else {
        console.log('add');
        dispatch(addDistance(data));
      }

      // console.log("onSubmit dataObject", dataObject);
      // await addDataInDatabase(db, "distances", "event 1", dataObject)
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        setError('root', { message: error.message });
      }
    }
  };

  return (
    <div className="flex flex-col m-auto bg-slate-200  h-[60%] w-[80%] hero-content shadow-md rounded-md">
      Create distance
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[40%]">
        <input type="hidden" {...register('id')} />

        <div>
          <FormTextField
            name="value.name"
            placeholder="name"
            type="text"
            autoFocus
            control={control}
          />
        </div>

        <div>
          <FormTextField
            name="value.cost"
            control={control}
            type="number"
            label="Cost"
          />
        </div>

        <div>
          <FormTextField
            name="value.distanceLength"
            control={control}
            type="number"
            label="Distance length"
          />
        </div>

        <div>
          <FormTextField
            name="value.linkToDownloadDistanceRoute"
            control={control}
            label="Link to download distance route"
          />
        </div>

        <div>
          <FormTextField
            name="value.linkToViewDistanceRouteOnTheMap"
            control={control}
            label="Link to view distance route on the map"
          />
        </div>

        <div>
          <FormTextField
            name="value.refreshmentPoints"
            control={control}
            type="number"
            label="Refreshment points"
          />
        </div>

        <div>
          <span>Start point</span>
          <FormTextField
            name="value.startPointDescription"
            control={control}
            label="Start point description"
          />
          <div className="flex flex-row space-x-2">
            <FormTextField
              name="value.longitude"
              control={control}
              label="Start point longitude"
            />
            <FormTextField
              name="value.latitude"
              control={control}
              label="Start point latitude"
            />
          </div>
        </div>

        <div>
          <FormTextField
            name="value.startTime"
            control={control}
            label="Start time"
          />
        </div>

        <div>
          <FormTextField
            name="value.timeLimit"
            control={control}
            label="Time limit"
          />
        </div>

        <div>
          <FormTextField
            name="value.totalElevation"
            control={control}
            label="Total elevation"
          />
        </div>

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
          <button onClick={handleSubmit(onSubmit)}>Submit</button>
        </div>
        <button type="button" onClick={() => router.back()}>
          Cancel
        </button>
      </form>
    </div>
  );
};
