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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// import Select from "react-select";

import TextArea from '../../../components/TextArea';
import { DataTransferContext } from '@/containers/DataTransferContainer';
import { DistanceFormValues } from '../../../components/CreateDistance';
import { useDatabaseManageData } from '@/services/DatabaseManageData';
import { FirebaseContext } from '@/containers/FirebaseContainer';
import Input from '../../../components/Input';
import { useRouter } from 'next/router';
import { ErrorCodes, EventFormValues } from '../event-form.typings';
import { EventFormUploadFiles } from './EventFormUploadFiles';
import { UploadResult } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { addRule, deleteRule, selectRules } from '../store/eventFormSlice';
import { PreviewFilelist } from './PreviewFilelist';

type SelectOptionsDistances = {
  label: string;
  value: DistanceFormValues;
};

const ZodDistancesArraySchema = z.object({
  name: z.string(),
  cost: z.number(),
  distanceLength: z.string(),
  linkToDownloadDistanceRoute: z.string(),
  linkToViewDistanceRouteOnTheMap: z.string(),
  refreshmentPoints: z.number(),
  startPoint: z.object({
    coordinates: z.object({
      longitude: z.string(),
      latitude: z.string(),
    }),
    startPointDescription: z.string(),
  }),
  startTime: z.string(),
  timeLimit: z.string(),
  totalElevation: z.string(),
});

const ACCEPTED_RULES_MIME_TYPES = ['application/pdf', 'application/msword'];

let InvalidMIMETypesFiles: string[] = [];

const eventFormSchema = z.object({
  eventName: z.string().min(1),
  information: z.string().min(8, { message: 'min 8' }),
  distances: z.array(ZodDistancesArraySchema),
  rules: z.array(z.object({ name: z.string(), path: z.string() })),
});

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

  const { ref: eventNameInputRefCB, ...eventNameInputOptions } = register(
    'eventName',
    { required: true }
  );

  const eventNameRef = useRef<HTMLInputElement | null>(null);

  const previewRefs = useRef<HTMLDivElement[]>([]);
  const distancesRefs = useRef<HTMLDivElement[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<DistanceFormValues[]>(
    []
  );
  const [selectOptions, setSelectOptions] = useState<SelectOptionsDistances[]>(
    []
  );

  const dispatch = useDispatch();
  const storedRules = useSelector(selectRules);

  const DTO = useContext(DataTransferContext);
  const param = useRouter();
  const location = param.pathname.split('/');

  async function setData(rawData: EventFormValues) {
    eventFormSchema.parse(rawData);
    // console.log(rawData);
  }

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
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

    // dataTransform();

    console.log('uploadFiles', uploadFiles);
  };

  const handleDistanceDelete =
    (index: number): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      e.stopPropagation();
      console.log(index);

      DTO.deleteDistances(index);
      console.log(DTO.distancesState);
    };

  // const dataTransform = () => {
  //   // console.log("transform");

  //   let data = new DataTransfer();
  //   if (uploadFiles) {
  //     for (let file of uploadFiles) {
  //       data.items.add(new File([file], file.name, { type: file.type }));
  //     }
  //     // console.log("transform data", data.files);
  //     if (
  //       uploadRulesFilesRef != undefined &&
  //       uploadRulesFilesRef.current != null
  //     ) {
  //       uploadRulesFilesRef.current.files = data.files;
  //     }
  //   }
  // };

  const getSelectOptions = () => {
    for (let distance of DTO.distancesState) {
      selectOptions.push({ label: distance.name, value: distance });
    }
    // console.log("getSelectOptions", selectOptions);
    return selectOptions;
  };

  const handleSelectChange = (option: SelectOptionsDistances[]) => {
    console.log('option onChange started >>>>>>>>>>>>>>>>>>>>>>>>', option);

    // console.log("selectOptions", selectOptions);
    // for (let { value } of option) {
    //   if (!selectedOptions.includes(value)) {
    //     console.log("set");
    //     setSelectedOptions([...selectedOptions, value]);

    //   } else if (selectedOptions.includes(value)) {
    //     console.log("filter");
    //     setSelectedOptions(
    //       selectedOptions.filter(
    //         (selectedOption) => selectedOption.name !== value.name
    //       )
    //     );
    //   }

    // }
    // console.log("selectedOptions", selectedOptions);
    // console.log("option", option);

    // return selectedOptions;
  };

  const handleRulesUpload = (snapshot: UploadResult) => {
    const rule = { name: snapshot.ref.name, path: snapshot.ref.fullPath };
    dispatch(addRule(rule));

    setValue('rules', [...storedRules, rule]);
  };

  const handleRuleDelete = (name: string) => {
    dispatch(deleteRule(name));
    setValue(
      'rules',
      storedRules.filter((rule) => rule.name !== name)
    );
  };

  useEffect(() => {
    if (DTO.distancesState.length) {
      setValue('distances', DTO.distancesState);
    }
  }, [DTO.distancesState]);

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

  if (formState.errors.distances) {
    console.log(formState.errors.distances);
  }

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

          <div className="flex flex-col items-center rounded-md p-5 max-w-[100%] border-b-[1px] border-gray-300">
            <Controller
              control={control}
              name="eventName"
              render={({
                field,
                fieldState: { isDirty },
                formState: { dirtyFields, defaultValues },
              }) => (
                <Input
                  {...field}
                  ref={eventNameRef}
                  options={{
                    errors: formState.errors,
                    name: 'eventName',
                    placeholder: 'name',
                    title: 'Event name',
                    type: 'text',
                    onChange: field.onChange,
                    onBlur: () => {
                      if (eventNameRef.current)
                        setEventNameState(eventNameRef.current?.value);
                      console.log(eventNameRef.current?.value);
                      console.log(dirtyFields);
                    },
                  }}
                  className={`${
                    getFieldState('eventName').invalid.toString() === 'true'
                      ? 'border-red-600'
                      : ' focus:border-[#FBBD23]'
                  } input bg-gray-100 w-full  focus:outline-none `}
                  // onChange={() => {
                  //   storeDirtyValues();
                  //   console.log(isDirty);
                  //   // console.log(eventNameRef.current?.innerText);
                  // }}
                />
              )}
            />
            <div className="flex justify-center w-full h-5">
              {formState.errors?.eventName && (
                <div className="flex text-red-600">
                  {formState.errors.eventName?.message}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center rounded-md p-5 max-w-[100%] border-b-[1px] border-gray-300">
            <h1 className="mb-5" tabIndex={1}>
              General information
            </h1>
            <>
              <Controller
                name="information"
                control={control}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { invalid },
                }) => (
                  <TextArea
                    options={{
                      value,
                      onChange,
                      onBlur,
                      invalid: invalid.toString(),
                      errors: formState.errors,
                    }}
                  />
                )}
              />
            </>
            <div className="flex justify-center w-full h-5">
              {formState.errors?.information && (
                <div className="flex text-red-600">
                  {formState.errors.information?.message}
                </div>
              )}
            </div>
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

              {DTO.distancesState.map((distance, index) => (
                <div
                  key={index}
                  className="flex flex-row h-12 w-full mb-5 items-center justify-between border-[#FBBD23] border-2 rounded-md"
                >
                  <div
                    key={index}
                    ref={(distance: HTMLDivElement) => {
                      distancesRefs.current[index] = distance;
                    }}
                    className="flex w-full justify-center"
                    onClick={() => {
                      console.log(index);

                      console.log(distancesRefs.current[index]);
                    }}
                  >
                    {distance.name}
                    {distance.distanceLength}
                  </div>

                  <div className="flex justify-between bg-amber-300">
                    <div>
                      <Link
                        key={distance.name}
                        href={`/admin/createEvent/edit/distance/${distance.name}`}
                        className="w-full"
                      >
                        Edit
                      </Link>
                    </div>
                    <button onClick={handleDistanceDelete(index)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* <div className=""> */}
              {/* <Select
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,

                      width: "100%",
                      height: "72px",
                      borderColor:
                        getFieldState("distances").invalid.toString() === "true"
                          ? "#DC2626"
                          : "#FBBD23",
                      ":hover": {
                        borderColor:
                          getFieldState("distances").invalid.toString() ===
                          "true"
                            ? "#DC2626"
                            : "#FBBD23",
                      },
                      // border:
                      //   state.menuIsOpen.toString() === "true" ? "0" : "0",
                      // ":focus": {
                      //   border: "0",
                      //   outline: "none"
                      // }
                      // ":focus": {
                      //   outlineColor:
                      //     state.menuIsOpen.toString() === "true"
                      //       ? "#DC2626"
                      //       : "#FBBD23",
                      // },
                    }),
                  }}
                  isMulti
                  placeholder="Choose from existing..."
                  // className="flex h-[72px] justify-center w-[100%]"
                  theme={(theme) => ({
                    ...theme,

                    colors: {
                      ...theme.colors,
                      primary25: "#fbbe238a",
                      primary: "#FBBD23",
                      danger: "ffffff",
                      dangerLight: "#FBBD23",

                      neutral10: "#fbbe238a",
                      neutral40: "#DC2626",
                      neutral20: "#FBBD23",
                    },
                  })}
                /> */}

              {/* {selectedOptions.map((option) => (
                  <div
                    key={option.name}
                    onClick={(e) => {
                      console.log(e.target);
                      console.log(selectedOptions);
                    }}
                  >
                    {option.name}
                  </div>
                ))} */}

              {/* <div className="h-5">
                  {formState.errors.distances && (
                    <div className="text-red-700">
                      {formState.errors.distances.message}
                    </div>
                  )}
                </div> */}
              {/* </div> */}
            </div>
          </div>

          <EventFormUploadFiles
            register={register}
            formState={formState}
            setUploadFiles={setUploadFiles}
            inputName={'rules'}
            onUpload={handleRulesUpload}
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
