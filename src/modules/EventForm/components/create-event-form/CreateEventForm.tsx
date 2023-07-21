'use client';

import { useEffect, useState } from 'react';

import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '../../../../app/redux/hooks';

import { zodResolver } from '@hookform/resolvers/zod';

import { collection, doc, setDoc } from 'firebase/firestore';

import {
  UploadResult,
  getStorage,
  ref as fireBaseRef,
  deleteObject,
} from 'firebase/storage';

import { TextArea } from '../../../../components/TextArea';

import {
  eventFormInputsNames,
  EventUploadFile,
} from '../../event-form.typings';
import { EventFormUploadFiles } from '../EventFormUploadFiles';
import {
  EventFormInputValues,
  addImages,
  addRule,
  // deleteNewDistance,
  deleteImage,
  deleteRule,
  // selectNewDistances,
  selectImages,
  selectEventFormValues,
  selectRules,
  storeEventFormValues,
  selectPartnersStoredSelectOptions,
  selectDistancesStoredSelectOptions,
  partnersSelectOptions,
  distancesSelectOptions,
  selectLogos,
  selectDistancesFromDatabase,
} from '../../../../app/redux/features/eventFormSlice';
import { PreviewFilelist } from '../PreviewFilelist';
import { EventFormValues, eventFormSchema } from '../../event-form.schema';
import { FormTextField } from '@/components/text-field/FormTextField';
import { PreviewEntitiesList } from '../PreviewEntitiesList';
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  ACCEPTED_RULES_MIME_TYPES,
  DISTANCES_SELECT_OPTIONS,
  PARTNERS_FROM_DATABASE,
} from '@/modules/EventForm/components/create-event-form/create-event-form.consts';
import { AddPartners } from '../AddPartners';
import { FormMultiSelect } from '@/components/select/FormMultiSelect';

import { inputStyle, textAreaStyle } from '../../../../styles/eventFormStyles';
import {
  deleteFileFromStorageWithPath,
  writeDocument,
} from '@/firebase/getData';
import { nanoid } from 'nanoid';
import FirebaseService from '@/firebase/firebaseService';
import { useFormManager } from '@/services/hooks/useFormManager';
import firebaseApp from '@/firebase/initFirebase';

export type HandleFileDeletePropsType = {
  // fileName: string;
  reducer: ReturnType<() => any>;
  inputName: keyof EventFormValues;
  storedFiles: EventUploadFile[];
  idSubCollection?: string;
};

export default function CreateEventForm({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const [eventNameState, setEventNameState] = useState('');
  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      id: nanoid(),
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

  const { handleEntityEdit, handleEntityDelete } = useFormManager();

  const router = useRouter();

  const { errors } = methods.formState;

  const dispatch = useAppDispatch();

  const storedRules = useAppSelector(selectRules);

  const storedImages = useAppSelector(selectImages);
  const storedLogos = useAppSelector(selectLogos);

  const storedEventFormValues = useAppSelector(selectEventFormValues);

  const storedDistances = useAppSelector(selectDistancesFromDatabase);

  const storage = getStorage();

  const storedPartnersUnselectedOptions = useAppSelector(
    selectPartnersStoredSelectOptions
  );

  const storedDistancesUnselectedOptions = useAppSelector(
    selectDistancesStoredSelectOptions
  );

  const setInputsValues = () => {
    // console.log('storedInputValues', storedInputValues);
    Object.keys(storedEventFormValues).forEach((key) => {
      methods.setValue(
        key as keyof EventFormValues,
        storedEventFormValues[key as keyof EventFormValues]
      );
    });
  };

  useEffect(() => {
    methods.setValue('images', storedImages);
    // console.log('useEffect storedImages', storedImages);
  }, [storedImages]);

  useEffect(() => {
    methods.setValue('rules', storedRules);
    // console.log('useEffect storedRules', storedRules);
  }, [storedRules]);

  useEffect(() => {
    // console.log('useEffect storedLogos', storedLogos);
  }, [storedLogos]);

  useEffect(() => {
    setInputsValues();
  }, [storedEventFormValues]);

  useEffect(() => {
    // TODO: reset values when event is created
    // console.log('useEffect storedEventFormValues', storedEventFormValues);
    return () => handleGetInputValues();
  }, []);

  async function setData(rawData: EventFormValues) {
    eventFormSchema.parse(rawData);
  }

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    try {
      setData(data);
      console.log('CreateEventForm submit data', data);
      await firebaseApp.addDocument('events', data);
    } catch (error) {
      if (error instanceof Error) {
        methods.setError('root', { message: error.message });
      }
    }
  };

  const handleFileDelete = (
    fileName: string,
    props: HandleFileDeletePropsType
  ) => {
    const { inputName, storedFiles, reducer, idSubCollection } = props;

    let filePath;
    if (idSubCollection) {
      filePath = `${inputName}/${idSubCollection}/${fileName}`;
    } else {
      filePath = `${inputName}/${fileName}`;
    }

    deleteFileFromStorageWithPath(filePath);

    dispatch(reducer(fileName));
    methods.setValue(
      inputName,
      storedFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleGetInputValues = () => {
    const values = {} as { [key in keyof typeof eventFormInputsNames]: any };
    for (let input in eventFormInputsNames) {
      values[input as keyof typeof eventFormInputsNames] = methods.getValues(
        input as keyof EventFormValues
      );
    }
    dispatch(storeEventFormValues(values));
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

  //   if (errors) {
  //   console.log('errors', errors)
  // }

  return (
    <div className="flex flex-col m-auto items-center w-[100%] h-full shadow-md rounded-md  pb-10">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          action=""
          className="form flex flex-col w-[75%] gap-3 "
        >
          <input type="text" hidden {...methods.register('id')} />
          <div className="flex h-20 items-center justify-center  ">
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

            <div className="flex flex-col justify-center max-w-[100%] rounded-md border border-slate-900 ">
              <FormMultiSelect
                name={`distancesFromDatabase`}
                control={methods.control}
                dataForSelectOptions={DISTANCES_SELECT_OPTIONS}
                storedUnselectedOptions={storedDistancesUnselectedOptions}
                reducer={distancesSelectOptions}
                hasStoredValues={checkStoredValues(
                  'distancesFromDatabase',
                  storedEventFormValues
                )}
                label={'Choose distances from database'}
              />

              {/* <div className="flex flex-col basis-1/4 w-full items-center ">
                <Link
                  href="/admin/createDistance"
                  className="flex p-2 w-full h-12 justify-center rounded-md border-[1px] border-[#FBBD23] cursor-pointer transition ease-in hover:transition-all 1s hover:bg-[#FBBD23] "
                >
                  <button>Add new distance</button>
                </Link>
              </div> */}

              {/* <PreviewEntitiesList
                entities={storedDistances.map((distance) => ({
                  id: distance.id,
                  entityName: distance.distanceName,
                }))}
                onDelete={() =>
                  handleEntityDelete({
                    fieldName: 'distancesFromDatabase',
                    setFieldValues: methods.setValue,
                  })
                }
                onEdit={() =>
                  handleEntityEdit('admin/createDistance/edit/distance')
                }
              /> */}
            </div>
          </div>

          <div className=" flex flex-col justify-center max-w-[100%] rounded-md border border-slate-900 ">
            <EventFormUploadFiles
              inputName={'rules'}
              label="Rules and regulations"
              collectionName="rules"
              formState={methods.formState}
              acceptTypes={ACCEPTED_RULES_MIME_TYPES}
              errors={errors}
              reducer={addRule}
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
          </div>

          <div className=" flex flex-col justify-center max-w-[100%] rounded-md border border-slate-900 ">
            <EventFormUploadFiles
              inputName={'images'}
              label="Images"
              collectionName="images"
              subCollection={methods.getValues('id')}
              formState={methods.formState}
              acceptTypes={ACCEPTED_IMAGE_MIME_TYPES}
              errors={errors}
              reducer={addImages}
            />

            {storedImages.length > 0 && (
              <PreviewFilelist
                fileNames={storedImages.map(({ name }) => name)}
                onDelete={handleFileDelete}
                onDeleteProps={{
                  inputName: 'images',
                  storedFiles: storedImages,
                  reducer: deleteImage,
                  idSubCollection: methods.getValues('id'),
                }}
              />
            )}
          </div>

          <div className="add dist flex flex-col justify-center max-w-[100%] rounded-md border border-slate-900 ">
            <FormMultiSelect
              name={`partnersFromDatabase`}
              control={methods.control}
              dataForSelectOptions={PARTNERS_FROM_DATABASE}
              storedUnselectedOptions={storedPartnersUnselectedOptions}
              reducer={partnersSelectOptions}
              hasStoredValues={checkStoredValues(
                'partnersFromDatabase',
                storedEventFormValues
              )}
              label={'Choose partners from database or add new'}
            />

            <AddPartners />
          </div>

          <input className="bg-yellow-300" type="submit" />
        </form>
      </FormProvider>
    </div>
  );
}
