import { ChangeEvent, Dispatch, FC, SetStateAction, useRef } from 'react';
import { FormState, UseFormRegister, FieldErrors } from 'react-hook-form';
import { ErrorCodes } from '../event-form.typings';
import { ErrorMessage } from '@hookform/error-message';

import {
  getStorage,
  ref as fireBaseRef,
  uploadBytes,
  UploadResult,
} from 'firebase/storage';
import { InputErrorMessage } from '@/components/text-field/TextFieldErrorMessage';
import { EventFormValues } from '../event-form.schema';
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  ACCEPTED_RULES_MIME_TYPES,
  FIFTY_KB,
} from './create-event-form/create-event-form.consts';

export type OnUploadWithIndex = (snapshot: UploadResult, index: number) => void;
export type OnUpload = (snapshot: UploadResult) => void;

type EventFormUploadFilesProps = {
  register?: UseFormRegister<EventFormValues>;
  formState: FormState<any>;
  inputName?: string;
  label: string;
  acceptTypes?: string;
  errors?: FieldErrors;
  onUpload: OnUpload;
  collectionName: string;
};

export const EventFormUploadFiles: FC<EventFormUploadFilesProps> = (props) => {
  const {
    register,
    formState,
    inputName,
    label,
    acceptTypes,
    onUpload,
    collectionName,
  } = props;

  const { ref, ...rulesInputOptions } =
    register?.(inputName as keyof EventFormValues) ?? {};

  const uploadFilesRef = useRef<HTMLInputElement | null>(null);

  const { errors } = formState;

  const handleFilesChange = ({
    currentTarget: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    console.log('in change');

    if (files?.length) {
      const storage = getStorage();
      for (let file of files) {
        const { name, size, type } = file;
        if (
          size < FIFTY_KB &&
          (ACCEPTED_IMAGE_MIME_TYPES.includes(type) ||
            ACCEPTED_RULES_MIME_TYPES.includes(type))
        ) {
          const storageRef = fireBaseRef(storage, `${collectionName}/${name}`);
          // 'file' comes from the Blob or File API
          uploadBytes(storageRef, file)
            .then((snapshot) => {
              console.log('Uploaded a blob or file!', snapshot);
              onUpload(snapshot);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          // TODO: invalid files
          console.log('invalid file size or type', name);
        }
      }
    }
  };

  return (
    <div className="upload flex flex-col items-center rounded-md max-w-[100%] rounded-md border border-slate-900 ">
      <h1 className="">{label}</h1>

      <div className="upload container flex items-center">
        <div className="flex  w-full ">
          <label
            htmlFor={inputName}
            className="flex items-center h-12 rounded-md border-[1px] border-[#FBBD23] cursor-pointer transition ease-in hover:transition-all 1s hover:bg-[#FBBD23]"
          >
            Upload
          </label>

          <input
            {...rulesInputOptions}
            ref={(element) => {
              ref?.(element);
              uploadFilesRef.current = element;
            }}
            onChange={handleFilesChange}
            id={inputName}
            multiple
            className="h-0"
            type="file"
            accept={acceptTypes}
          />
        </div>
      </div>
      <ErrorMessage
        errors={errors}
        name={inputName as any}
        render={({ message }) => (
          <InputErrorMessage>{message}</InputErrorMessage>
        )}
      />
    </div>
  );
};
