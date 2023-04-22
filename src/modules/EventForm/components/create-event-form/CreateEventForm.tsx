import {
  ChangeEvent,
  MouseEvent,
  MouseEventHandler,
  SyntheticEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SubmitHandler,
  useForm,
  useFormState,
  useFieldArray,
  Controller,
  useController,
} from 'react-hook-form';
import Link from 'next/link';
import { unknown, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// import Select from "react-select";

import TextArea from '../../../../components/TextArea';
import { useDatabaseManageData } from '@/services/DatabaseManageData';
import { FirebaseContext } from '@/containers/FirebaseContainer';
// import Input from '../../../components/Input';
import { TextField } from '@/components/text-field/TextField';
import { useRouter } from 'next/router';
import { ErrorCodes, EventFormInputs } from '../../event-form.typings';
import { EventFormUploadFiles } from '../EventFormUploadFiles';
import { UploadResult } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import {
  InputValues,
  addRule,
  deleteDistance,
  deleteRule,
  selectDistances,
  selectInputValues,
  selectRules,
  storeInputValues,
} from '../../store/eventFormSlice';
import { PreviewFilelist } from '../PreviewFilelist';
import { ErrorMessage } from '@hookform/error-message';
import { InputErrorMessage } from '@/components/text-field/TextFieldErrorMessage';
import {
  DistanceFormValues,
  EventFormValues,
  eventFormSchema,
} from './createForm.schema';
import { FormTextField } from '@/components/text-field/FormTextField';
import { PreviewDistancesList } from '../PreviewDistancesList';

type SelectOptionsDistances = {
  label: string;
  value: DistanceFormValues;
};

const ACCEPTED_RULES_MIME_TYPES = ['application/pdf', 'application/msword'];

let InvalidMIMETypesFiles: string[] = [];

export const CreateEventForm = () => {
  const [eventNameState, setEventNameState] = useState('');
  const {
    register,
    handleSubmit,
    formState,
    getFieldState,
    setError,
    control,
    setValue,
    getValues,
    trigger,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      eventName: eventNameState,
      information: '',
      distances: [],
      rules: [],
    },
  });
  const { addDataInDatabase } = useDatabaseManageData();
  const { db } = useContext(FirebaseContext);

  const { dirtyFields } = useFormState({ control });
  const { errors } = formState;

  const previewRefs = useRef<HTMLDivElement[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const dispatch = useDispatch();
  const storedRules = useSelector(selectRules);

  const storedInputValues = useSelector(selectInputValues);

  const storedDistances = useSelector(selectDistances);

  const router = useRouter();

  async function setData(rawData: EventFormValues) {
    eventFormSchema.parse(rawData);
    console.log('rawData', rawData);
  }

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    console.log('in submit');

    try {
      console.log(data);

      setData(data);
      console.log(dirtyFields);
    } catch (error) {
      if (error instanceof Error) {
        setError('root', { message: error.message });
      }
    }
    // await addDataInDatabase(db, "events", "event 1", DTO.distancesState);
    // console.log("try add in db");
    console.log(data);
  };

  const handlePreviewDelete = (index: number) => {
    console.log('in delete');

    setUploadFiles(
      uploadFiles?.filter(
        (file) => file.name != previewRefs.current[index].innerText
      )
    );
    console.log('uploadFiles', uploadFiles);
  };

  const handleRulesUpload = (snapshot: UploadResult) => {
    const rule = { name: snapshot.ref.name, path: snapshot.ref.fullPath };
    dispatch(addRule(rule));
    setValue('rules', [...storedRules, rule]);
    console.log('getValues', getValues());
  };

  const handleRuleDelete = (name: string) => {
    dispatch(deleteRule(name));
    setValue(
      'rules',
      storedRules.filter((rule) => rule.name !== name)
    );
  };

  const handleDistanceDelete = (id: string) => {
    dispatch(deleteDistance(id));
    setValue(
      'distances',
      storedDistances.filter((distance) => distance.id !== id)
    );
  };

  const handleGetInputValues = () => {
    const values = {} as { [key in EventFormInputs]: any };
    for (let input in EventFormInputs) {
      values[input as keyof typeof EventFormInputs] = getValues(
        input as keyof InputValues
      );
    }
    console.log('handleGetInputValues', values);
    dispatch(storeInputValues(values));
  };

  const handleDistanceEdit = (id: string) => {
    router.push(`createEvent/edit/distance/${id}`);
  };

  useEffect(() => {
    // TODO: reset values when event is created

    Object.keys(storedInputValues).forEach((key) => {
      setValue(
        key as keyof InputValues,
        storedInputValues[key as keyof InputValues]
      );
    });
    dispatch(storeInputValues({} as InputValues));

    setValue('distances', storedDistances);

    return () => handleGetInputValues();
  }, []);

  // useEffect(() => {
  //   if (eventNameState && location.at(-1) === "addNewDistance") {
  //     setValue("eventName", eventNameState);
  //     console.log(eventNameState);
  //   }
  // }, [location, eventNameState]);

  // useMemo(() => {
  //   setSelectOptions(getSelectOptions());
  //   // console.log("useMemo selectOptions", selectOptions);
  // }, [DTO.distances]);

  // if (formState.errors) {
  //   console.log(formState.errors);
  // }

  return (
    <div className=" flex flex-col items-center bg-gray-50 h-[100%] w-[100%] ">
      <div className="flex flex-col items-center bg-gray-50 w-[80%] h-[100%] shadow-md rounded-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          action=""
          className="form flex flex-col w-[75%] gap-5 "
        >
          <div className="flex h-24  items-center font-medium text-lg border-b-[1px] border-gray-300">
            Event Constructor
          </div>

          <FormTextField
            name="eventName"
            placeholder="Event name"
            control={control}
            className={`${
              getFieldState('eventName').invalid.toString() === 'true'
                ? 'border-red-600'
                : ' focus:border-[#FBBD23]'
            } input bg-gray-100 w-full  focus:outline-none `}
          />

          <div className="flex flex-col items-center rounded-md p-5 max-w-full border-b-[1px] border-gray-300">
            <h1 className="mb-5" tabIndex={1}>
              General information
            </h1>

            <TextArea register={register} errors={errors} name="information" />
          </div>

          <div className="add dist flex flex-col justify-center rounded-md p-5 max-w-[100%] border-b-[1px] border-gray-300">
            <div className="flex w-full justify-center">
              <h1 className="flex  mb-5">Distances</h1>
            </div>

            <div className="flex flex-col items-center justify-center ">
              <div className="flex flex-col basis-1/4 w-full items-center pb-5">
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
            formState={formState}
            setUploadFiles={setUploadFiles}
            inputName={'rules'}
            onUpload={handleRulesUpload}
            acceptTypes="application/pdf, application/msword"
            errors={errors}
          />

          <PreviewFilelist
            fileNames={storedRules.map(({ name }) => name)}
            onDelete={handleRuleDelete}
          />

          <input type="submit" />
        </form>
      </div>
    </div>
  );
};
