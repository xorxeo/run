import {
  MouseEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SubmitHandler,
  useForm,
  useFormState,
  useFieldArray,
  Controller,
  useController,
} from "react-hook-form";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import Select from "react-select";

import TextArea from "./TextArea";
import { DataTransferContext } from "@/containers/DataTransferContainer";
import {  DistanceFormValues } from "./CreateDistance";
import { useDatabaseManageData } from "@/services/DatabaseManageData";
import { FirebaseContext } from "@/containers/FirebaseContainer";
import Input from "./Input";
import { useRouter } from "next/router";

enum ErrorCodes {
  invalidTypes = "wrong type",
}

type SelectOptionsDistances = {
  label: string;
  value: DistanceFormValues;
};

export type EventFormValues = {
  eventName: string;
  information: string;
  distances: DistanceFormValues[];
  rules: File[];
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

const ACCEPTED_RULES_MIME_TYPES = ["application/pdf", "application/msword"];

let InvalidMIMETypesFiles: string[] = [];

const eventFormSchema = z.object({
  eventName: z.string().min(1),
  information: z.string().min(8, { message: "min 8" }),
  distances: z.array(ZodDistancesArraySchema),

  rules: z.any().refine(
    (files) => {
      console.log("validation", InvalidMIMETypesFiles);
      InvalidMIMETypesFiles = [];
      for (let { name, type } of files) {
        console.log("for");

        if (!ACCEPTED_RULES_MIME_TYPES.includes(type)) {
          InvalidMIMETypesFiles.push(name);
          console.log(InvalidMIMETypesFiles);
        }
      }
      return !(InvalidMIMETypesFiles.length > 0);
    },
    { message: ErrorCodes.invalidTypes }
  ),
});

export const CreateEventForm = () => {
  const [eventNameState, setEventNameState] = useState("");
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
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      eventName: eventNameState,
      information: "",
      distances: [],
      rules: [],
    },
  });
  const { addDataInDatabase } = useDatabaseManageData();
  const { db } = useContext(FirebaseContext);

  const { dirtyFields } = useFormState({ control });

  const { ref, ...rulesInputOptions } = register("rules");

  const { ref: eventNameInputRefCB, ...eventNameInputOptions } = register(
    "eventName",
    { required: true }
  );

  const eventNameRef = useRef<HTMLInputElement | null>(null);

  const uploadRulesFilesRef = useRef<HTMLInputElement | null>(null);
  const previewRefs = useRef<HTMLDivElement[]>([]);
  const distancesRefs = useRef<HTMLDivElement[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<DistanceFormValues[]>(
    []
  );
  const [selectOptions, setSelectOptions] = useState<SelectOptionsDistances[]>(
    []
  );

  
  

  const DTO = useContext(DataTransferContext);
  const param = useRouter()
  const location = param.pathname.split("/");

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
        setError("root", { message: error.message });
      }
    }
    // await addDataInDatabase(db, "events", "event 1", DTO.distancesState);
    // console.log("try add in db");
    console.log(data);
  };

  const handleFilesChange = ({
    currentTarget: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    console.log("in change");
    if (files && files.length) {
      setUploadFiles((uploadFiles) => uploadFiles.concat(Array.from(files)));
      console.log("in change IF", uploadFiles);
    }
  };

  const handlePreviewDelete = (index: number) => {
    console.log("in delete");

    setUploadFiles(
      uploadFiles?.filter(
        (file) => file.name != previewRefs.current[index].innerText
      )
    );

    dataTransform();
    //  trigger("rules");

    console.log("uploadFiles", uploadFiles);
  };

  const handleDistanceDelete = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    console.log(index);

    DTO.deleteDistances(index);
    console.log(DTO.distancesState);
  };

  const dataTransform = () => {
    // console.log("transform");

    let data = new DataTransfer();
    if (uploadFiles) {
      for (let file of uploadFiles) {
        data.items.add(new File([file], file.name, { type: file.type }));
      }
      // console.log("transform data", data.files);
      if (
        uploadRulesFilesRef != undefined &&
        uploadRulesFilesRef.current != null
      ) {
        uploadRulesFilesRef.current.files = data.files;
      }
    }
  };

  const getSelectOptions = () => {
    for (let distance of DTO.distancesState) {
      selectOptions.push({ label: distance.name, value: distance });
    }
    // console.log("getSelectOptions", selectOptions);
    return selectOptions;
  };

  const handleSelectChange = (option: SelectOptionsDistances[]) => {
    console.log("option onChange started >>>>>>>>>>>>>>>>>>>>>>>>", option);

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

  const storeDirtyValues = () => {
    // console.log(dirtyFields.eventName);
    // console.log(textAreaRef.current);
  };

  useEffect(() => {
    if (uploadFiles.length) {
      console.log("useEffect uploadFiles");
      setValue("rules", uploadFiles);
      dataTransform();
    }
  }, [uploadFiles]);

  useEffect(() => {
    if (DTO.distancesState.length) {
      setValue("distances", DTO.distancesState);
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
              render={({ field, fieldState: { isDirty }, formState: {dirtyFields, defaultValues} }) => (
                <Input
                  {...field}
                  ref={eventNameRef}
                  options={{
                    errors: formState.errors,
                    name: "eventName",
                    placeholder: "name",
                    title: "Event name",
                    type: "text",
                    onChange: field.onChange,
                    onBlur: () => {
                      if(eventNameRef.current)
                        setEventNameState(eventNameRef.current?.value);
                      console.log(eventNameRef.current?.value);
                      console.log(dirtyFields);
                    },
                    
                  }}
                  
                  className={`${
                    getFieldState("eventName").invalid.toString() === "true"
                      ? "border-red-600"
                      : " focus:border-[#FBBD23]"
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
                    <div onClick={(e) => handleDistanceDelete(e, index)}>
                      Delete
                    </div>
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

          <div>
            <div className="flex flex-col items-center rounded-md p-5 max-w-[100%] border-b-[1px] border-gray-300">
              <h1 className="mb-5">Rules and regulations</h1>

              <div className="flex upload container">
                <div className="flex basis-1/3 w-full justify-center">
                  <label
                    htmlFor="rules"
                    className="flex items-center p-2 h-12 rounded-md border-[1px] border-[#FBBD23] cursor-pointer transition ease-in hover:transition-all 1s hover:bg-[#FBBD23]"
                  >
                    Upload
                  </label>

                  <input
                    {...rulesInputOptions}
                    ref={(element) => {
                      ref(element);
                      uploadRulesFilesRef.current = element;
                    }}
                    onChange={handleFilesChange}
                    id="rules"
                    multiple
                    className="opacity-0 w-0"
                    type="file"
                    // accept="application/pdf, application/msword"
                  />
                </div>

                <div>
                  {uploadFiles &&
                    uploadFiles.length > 0 &&
                    uploadFiles.map((file, index) => {
                      return (
                        <div
                          key={index}
                          ref={(file: HTMLDivElement) => {
                            previewRefs.current[index] = file;
                          }}
                          className="flex basis-2/3 w-full pl-2 justify-between items-center rounded-md border-[1px] border-gray-300"
                        >
                          <div key={Math.random()} className="flex flex-row ">
                            {file.name}
                          </div>
                          <button
                            className=""
                            onClick={(e) => {
                              e.preventDefault();
                              handlePreviewDelete(index);
                            }}
                          >
                            <svg
                              className="flex border-[1px] opacity-40 hover:opacity-70 hover:bg-[#FBBD23]"
                              height="20"
                              width="20"
                              viewBox="0 0 20 20"
                            >
                              <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                </div>
                {formState.errors.rules && (
                  <div className="text-red-700">
                    {formState.errors.rules?.message ===
                      ErrorCodes.invalidTypes &&
                      `${InvalidMIMETypesFiles?.join(", ")}`}
                  </div>
                )}
              </div>
            </div>
          </div>

          <input type="submit" />
        </form>
      </div>
    </div>
  );
};
