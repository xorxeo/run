import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Select from "./Select";
import { useDatabaseManageData } from "@/services/DatabaseManageData";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FirebaseContext } from "@/containers/FirebaseContainer";
import Input from "./Input";
import {
  DataTransferContext,
  useDataTransferContext,
} from "@/containers/DataTransferContainer";
import { useRouter } from "next/router";
import { ValidationErrors } from "./ValidationError";

enum ErrorCodes {
  InvalidSize = "InvalidSize",
  InvalidMIMETypes = ".jpg, .jpeg, .png and .webp files are accepted.",
  RequiredField = "Field is required",
}

export type DistanceFormValues = {
  name: string;
  cost: number;
  distanceLength: string;
  linkToDownloadDistanceRoute: string;
  linkToViewDistanceRouteOnTheMap: string;
  refreshmentPoints: number;
  startPoint: {
    coordinates: {
      longitude: string;
      latitude: string;
    };
    startPointDescription: string;
  };
  startTime: string;
  timeLimit: string;
  totalElevation: string;
  // images?: [];
};

const FIVE_MB = 5_242_880;
const ONE_MB = 466700;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const URL_REG_EXP =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const TIME_REG_EXP = /(?: [01] | 2(?![4 - 9])){ 1}\d{ 1}: [0-5]{ 1}\d{ 1}/;

const UrlSchema = z.string().regex(URL_REG_EXP).or(z.string().min(0));

let invalidSizeFiles: string[] = [];
let InvalidMIMETypesFiles: string[] = [];


export const CreateDistance = () => {
  const { db } = useContext(FirebaseContext);
  const { addDataInDatabase } = useDatabaseManageData();
  const [isEdit, setIsEdit] = useState<Boolean | null>(null);

   const distanceFormSchema = z.object({
  name: z.string().min(1, { message: ErrorCodes.RequiredField })
      .refine(name => {
        if (!isEdit && DTO.distancesState.some((distance) => distance.name === name)) {
          return false;
        } else {
          return true;
        }
      }, {message: "Same name"}
    )
  ,
  cost: z.coerce
    .number({
      invalid_type_error: "Just numbers",
    })
    .min(1, { message: ErrorCodes.RequiredField }),
  distanceLength: z
    .string({
      required_error: "distanceLength is required",
      invalid_type_error: "distance length must be a string",
    })
    .min(1, { message: ErrorCodes.RequiredField }),
  linkToDownloadDistanceRoute: UrlSchema,
  linkToViewDistanceRouteOnTheMap: UrlSchema,
  refreshmentPoints: z.coerce.number(),
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
  // images: z
  //   .any()
  //   .refine(
  //     (files) => {
  //       invalidSizeFiles = [] as string[];
  //       for (let { size, name } of files) {
  //         if (size > FIVE_MB) {
  //           invalidSizeFiles.push(name);
  //         }
  //       }
  //       return !(invalidSizeFiles.length > 0);
  //     },
  //     { message: FilesErrorCodes.InvalidSize }
  //   )
  //   .refine(
  //     (files) => {
  //       InvalidMIMETypesFiles = [] as string[];
  //       for (let { type, name } of files) {
  //         if (!ACCEPTED_IMAGE_MIME_TYPES.includes(type)) {
  //           InvalidMIMETypesFiles.push(name);
  //         }
  //       }
  //       return !(InvalidMIMETypesFiles.length > 0);
  //     },
  //     { message: FilesErrorCodes.InvalidMIMETypes }
  //   ),
});


  const DTO = useDataTransferContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    control,
  } = useForm<DistanceFormValues>({
    resolver: zodResolver(distanceFormSchema),
    mode: "onBlur",
    // TODO: validate onBlur
    reValidateMode: "onChange",
    // mode: "onBlur",
  });

  let dataObject: DistanceFormValues[];

  let selectOptions = [
    { label: "none", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
  ];

  const distanceRef = useRef();

  const param = useRouter();
  const { name } = param.query;
  const location = param.pathname.split("/");

  useEffect(() => {
    if (location.at(-1) !== "addNewDistance" && DTO.distancesState.length) {
      setIsEdit(true);
      for (let distance of DTO.distancesState) {
        if (distance.name === name) {
          Object.keys(distance).forEach((key) => {
            setValue(
              key as keyof DistanceFormValues,
              distance[key as keyof DistanceFormValues]
            );
          });
        }
      }
    }
    return () => setIsEdit(false);
  }, [name, location, DTO.distancesState, setValue]);

  function setDataFromForm(rawData: DistanceFormValues) {
    const parsedData = distanceFormSchema.parse(rawData);

    return parsedData;
  }

  const onSubmit: SubmitHandler<DistanceFormValues> = async (data) => {
    try {
      setDataFromForm(data);
      // console.log("onSubmit dataObject", dataObject);
      // await addDataInDatabase(db, "distances", "event 1", dataObject)
      history.back();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        setError("root", { message: error.message });
      }
    }
  };

  const onDraft: SubmitHandler<DistanceFormValues> = async (data) => {
    try {
      if (data.name === name) {
        console.log("name ===");
        const idx = DTO.distancesState.findIndex(
          (distance) => distance.name === data.name
        );
        DTO.updateDistance(idx, distanceFormSchema.parse(data));
      } else {
        DTO.setDistances(data);
      }
      history.back();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        setError("root", { message: error.message });
      }
    }
  };

  

  return (
    <div className="flex flex-col m-auto bg-slate-200  h-[60%] w-[80%] hero-content shadow-md rounded-md">
      Create distance
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[40%]">
        {/* <div>
          <div>Enter the name of the distance</div>
          <input
            type="text"
            autoComplete="off"
            placeholder="distance name"
            {...register("name", { required: true })}
          />

          <div className="h-5">
            {errors.name && (
              <div className="text-red-700">{errors.name.message}</div>
            )}
          </div>
        </div> */}
        <>
          <Input
            options={{
              type: "text",
              title: "Enter the distance name",
              name: "name",
              placeholder: "distance name",
            }}
            {...register("name", { required: true })}
          />
          <ValidationErrors errors={errors} name="name" />
        </>

        <div>
          <Input
            options={{
              type: "text",
              title: "Enter the cost of participation",
              name: "cost",
              placeholder: "distance cost",
            }}
            {...register("cost")}
          />
          <ValidationErrors errors={errors} name="cost" />
        </div>

        <div>
          <div>Enter the length of the distance</div>
          <input
            type="text"
            autoComplete="off"
            placeholder="distance length"
            {...register("distanceLength", { required: true })}
          />

          <div className="h-5">
            {errors.distanceLength && (
              <div className="text-red-700">
                {errors.distanceLength.message}
              </div>
            )}
          </div>
        </div>

        <div>
          <div>Enter the link to download distance route </div>
          <input
            type="text"
            autoComplete="off"
            placeholder="https://www.example.com"
            {...register("linkToDownloadDistanceRoute")}
          />

          <div className="h-5">
            {errors.linkToDownloadDistanceRoute && (
              <div className="text-red-700">
                {errors.linkToDownloadDistanceRoute.message}
              </div>
            )}
          </div>
        </div>

        <div>
          <div>Enter the link to view distance route on the map </div>
          <input
            type="text"
            autoComplete="off"
            placeholder="https://www.example.com"
            {...register("linkToViewDistanceRouteOnTheMap")}
          />

          <div className="h-5">
            {errors.linkToViewDistanceRouteOnTheMap && (
              <div className="text-red-700">
                {errors.linkToViewDistanceRouteOnTheMap.message}
              </div>
            )}
          </div>
        </div>

        <div>
          <div>Refreshment points</div>

          <Select {...register("refreshmentPoints")} options={selectOptions} />

          <div className="h-5">
            {errors.refreshmentPoints && (
              <div className="text-red-700">
                {errors.refreshmentPoints.message}
              </div>
            )}
          </div>
        </div>

        <div className="">
          <div>Start point</div>
          <div className="flex flex-col">
            Description
            <input
              type="text"
              autoComplete="off"
              placeholder="start point description"
              {...register("startPoint.startPointDescription", {
                required: true,
              })}
            />
          </div>

          <div className="flex flex-col">
            Coordinates
            <input
              type="text"
              autoComplete="off"
              placeholder="longitude"
              {...register("startPoint.coordinates.longitude", {
                required: true,
              })}
            />
            <input
              type="text"
              autoComplete="off"
              placeholder="latitude"
              {...register("startPoint.coordinates.latitude", {
                required: true,
              })}
            />
          </div>

          <div className="h-5">
            {errors.startPoint && (
              <div className="text-red-700">{errors.startPoint.message}</div>
            )}
          </div>
        </div>

        <div>
          <div>Enter start time</div>
          <input
            type="time"
            autoComplete="off"
            placeholder="start time"
            {...register("startTime", { required: "This is required." })}
            // pattern="(?:[01]|2(?![4-9])){1}\d{1}:[0-5]{1}\d{1}"
          />

          <div className="h-5">
            {errors.startTime && (
              <div className="text-red-700">{errors.startTime.message}</div>
            )}
          </div>
        </div>

        <div>
          <div>Enter time limit</div>
          <input
            type="time"
            autoComplete="off"
            placeholder="time limit"
            {...register("timeLimit", { required: "This is required." })}
          />

          <div className="h-5">
            {errors.timeLimit && (
              <div className="text-red-700">{errors.timeLimit.message}</div>
            )}
          </div>
        </div>

        <div>
          <div>Enter total elevation</div>
          <input
            type="text"
            autoComplete="off"
            placeholder="total elevation"
            {...register("totalElevation", { required: "This is required." })}
          />

          <div className="h-5">
            {errors.totalElevation && (
              <div className="text-red-700">
                {errors.totalElevation.message}
              </div>
            )}
          </div>
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

        {/* <input type="submit" /> */}
        <div className="flex justify-between">
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Clear storage
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("DTO.distances", DTO.distancesState);
            }}
          >
            Show storage
          </button>

          <button onClick={handleSubmit(onDraft)}>Save draft</button>
          <button onClick={handleSubmit(onSubmit)}>Submit</button>
        </div>
      </form>
    </div>
  );
};
