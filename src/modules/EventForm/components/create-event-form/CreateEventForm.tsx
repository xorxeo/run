import { useEffect, useState } from 'react';

import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { zodResolver } from '@hookform/resolvers/zod';

import { collection, doc, setDoc } from 'firebase/firestore';

import {
  UploadResult,
  getStorage,
  ref as fireBaseRef,
  deleteObject,
} from 'firebase/storage';

import { TextArea } from '../../../../components/TextArea';

import { EventFormInputs, EventUploadFile } from '../../event-form.typings';
import { EventFormUploadFiles } from '../EventFormUploadFiles';
import {
  InputValues,
  addImages,
  addRule,
  deleteNewDistance,
  deleteImage,
  deleteRule,
  selectNewDistances,
  selectImages,
  selectInputValues,
  selectRules,
  storeInputValues,
  selectPartnersStoredSelectOptions,
  selectDistancesStoredSelectOptions,
  partnersSelectOptions,
  distancesSelectOptions,
} from '../../store/eventFormSlice';
import { PreviewFilelist } from '../PreviewFilelist';
import {
  EventFormValues,
  eventFormSchema,
} from '../../event-form.schema';
import { FormTextField } from '@/components/text-field/FormTextField';
import { PreviewDistancesList } from '../PreviewDistancesList';
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  ACCEPTED_RULES_MIME_TYPES,
  DISTANCES_SELECT_OPTIONS,
  PARTNERS_FROM_DATABASE,
} from '@/modules/EventForm/components/create-event-form/create-event-form.consts';
import { AddPartners } from '../AddPartners';
import { initFirebase } from '../../../../firebase/initFirebase';
import { FormMultiSelect } from '@/components/select/FormMultiSelect';

import { inputStyle, textAreaStyle } from '../../../../styles/eventFormStyles';

export type HandleFileDeletePropsType = {
  // fileName: string;
  reducer: ReturnType<() => any>;
  inputName: keyof EventFormValues;
  storedFiles: EventUploadFile[];
};

export const CreateEventForm = () => {
  const [eventNameState, setEventNameState] = useState('');
  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      eventName: eventNameState,
      information: '',
      newDistances: [],
      distancesFromDatabase: [],
      rules: [],
      images: [],
      newPartners: [],
      partnersFromDatabase: [],
    },
  });

  const { db } = initFirebase();

  const router = useRouter();

  const { errors } = methods.formState;

  const dispatch = useDispatch();

  const storedRules = useSelector(selectRules);

  const storedImages = useSelector(selectImages);

  const storedInputValues = useSelector(selectInputValues);

  const storedDistances = useSelector(selectNewDistances);

  const storage = getStorage();

  const storedPartnersUnselectedOptions = useSelector(
    selectPartnersStoredSelectOptions
  );

  const storedDistancesUnselectedOptions = useSelector(
    selectDistancesStoredSelectOptions
  );

  if (db) {
    const eventsCollectionRef = collection(db, 'events');
    console.log('eventsCollectionRef from eventform', eventsCollectionRef)
  }

  useEffect(() => {
    // TODO: reset values when event is created

    Object.keys(storedInputValues).forEach((key) => {
      methods.setValue(
        key as keyof EventFormValues,
        storedInputValues[key as keyof EventFormValues]
      );
    });

    return () => handleGetInputValues();
  }, []);

  async function setData(rawData: EventFormValues) {
    eventFormSchema.parse(rawData);
  }

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    try {
      setData(data);
      // const eventRef = doc(collection(db!, 'events'));
      setDoc(doc(collection(db!, 'events')), data);

    } catch (error) {
      if (error instanceof Error) {
        methods.setError('root', { message: error.message });
      }
    }
  };

  const handleRulesUpload = (snapshot: UploadResult) => {
    const rule = { name: snapshot.ref.name, path: snapshot.ref.fullPath };
    dispatch(addRule(rule));
    methods.setValue('rules', [...storedRules, rule]);
    console.log('getValues', methods.getValues());
  };

  const handleFileDelete = (
    fileName: string,
    props: HandleFileDeletePropsType
  ) => {
    const { inputName, storedFiles, reducer } = props;
    const fileRef = fireBaseRef(storage, `${inputName}/${fileName}`);
    deleteObject(fileRef);

    dispatch(reducer(fileName));
    methods.setValue(
      inputName,
      storedFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleDistanceDelete = (id: string) => {
    dispatch(deleteNewDistance(id));
    methods.setValue(
      'newDistances',
      storedDistances.filter((distance) => distance.id !== id)
    );
  };

  const handleDistanceEdit = (id: string) => {
    router.push(`createEvent/edit/distance/${id}`);
  };

  const handleImagesUpload = (snapshot: UploadResult) => {
    const image = {
      name: snapshot.ref.name,
      path: snapshot.ref.fullPath,
    };
    dispatch(addImages(image));
    methods.setValue('images', [...storedImages, image]);
  };

  const handleGetInputValues = () => {
    const values = {} as { [key in EventFormInputs]: any };
    for (let input in EventFormInputs) {
      values[input as keyof typeof EventFormInputs] = methods.getValues(
        input as keyof InputValues
      );
    }
    dispatch(storeInputValues(values));
  };

  const checkStoredValues = (
    inputNameToCheck: keyof EventFormValues,
    storedValues: EventFormValues
  ) => {
    if (storedValues[inputNameToCheck]) {
      return true;
    }
    return false;
  };


  return (
    <div className=" flex flex-col items-center h-[100%] w-[100%] ">
      <div className="flex flex-col items-center  w-[90%] lg:w-[55%] md:w-[85%] h-[100%] shadow-md rounded-md">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            action=""
            className="form flex flex-col w-[75%] gap-3 "
          >
            <div className="flex h-24 items-center justify-center font-medium text-lg ">
              Event Constructor
            </div>

            <FormTextField
              name="eventName"
              label="Event name"
              placeholder="Event name"
              control={methods.control}
              style={inputStyle}
            />

            <TextArea
              name="information"
              control={methods.control}
              label="General information"
              placeholder="General information"
              style={textAreaStyle}
            />

            <div className="add dist flex flex-col justify-center max-w-[100%] rounded-md border border-slate-900 ">
              <div className="flex w-full justify-center">
                <h1 className=" m-auto">Distances</h1>
              </div>

              <div className="flex flex-col items-center justify-center ">
                <FormMultiSelect
                  name={`distancesFromDatabase`}
                  control={methods.control}
                  dataForSelectOptions={DISTANCES_SELECT_OPTIONS}
                  storedUnselectedOptions={storedDistancesUnselectedOptions}
                  reducer={distancesSelectOptions}
                  hasStoredValues={checkStoredValues(
                    'distancesFromDatabase',
                    storedInputValues
                  )}
                  label={'Choose distances from database or add new'}
                />

                <div className="flex flex-col basis-1/4 w-full items-center ">
                  <Link
                    href="/admin/createEvent/addNewDistance"
                    className="flex p-2 w-full h-12 justify-center rounded-md border-[1px] border-[#FBBD23] cursor-pointer transition ease-in hover:transition-all 1s hover:bg-[#FBBD23] "
                  >
                    <button>Add new distance</button>
                  </Link>
                </div>

                <PreviewDistancesList
                  distances={storedDistances}
                  onDelete={handleDistanceDelete}
                  onEdit={handleDistanceEdit}
                />
              </div>
            </div>

            <EventFormUploadFiles
              inputName={'rules'}
              label="Rules and regulations"
              collectionName="rules"
              formState={methods.formState}
              onUpload={handleRulesUpload}
              acceptTypes={ACCEPTED_RULES_MIME_TYPES}
              errors={errors}
            />

            {storedRules.length > 0 && (
              <PreviewFilelist
                fileNames={storedRules.map(({ name }) => name)}
                onDelete={handleFileDelete}
                onDeleteProps={{
                  inputName: 'rules',
                  storedFiles: storedRules,
                  reducer: deleteRule,
                }}
              />
            )}

            <EventFormUploadFiles
              inputName={'images'}
              label="Images"
              collectionName="images"
              formState={methods.formState}
              onUpload={handleImagesUpload}
              acceptTypes={ACCEPTED_IMAGE_MIME_TYPES}
              errors={errors}
            />

            {storedImages.length > 0 && (
              <PreviewFilelist
                fileNames={storedImages.map(({ name }) => name)}
                onDelete={handleFileDelete}
                onDeleteProps={{
                  inputName: 'images',
                  storedFiles: storedImages,
                  reducer: deleteImage,
                }}
              />
            )}

            <div className="add dist flex flex-col justify-center max-w-[100%] rounded-md border border-slate-900 ">
              <FormMultiSelect
                name={`partnersFromDatabase`}
                control={methods.control}
                dataForSelectOptions={PARTNERS_FROM_DATABASE}
                storedUnselectedOptions={storedPartnersUnselectedOptions}
                reducer={partnersSelectOptions}
                hasStoredValues={checkStoredValues(
                  'partnersFromDatabase',
                  storedInputValues
                )}
                label={'Choose partners from database or add new'}
              />

              <AddPartners />
            </div>

            <input className="bg-yellow-300" type="submit" />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
