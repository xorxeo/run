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
import { useDispatch } from 'react-redux';
import { addRule } from '../store/eventFormSlice';
import { InputErrorMessage } from '@/components/text-field/TextFieldErrorMessage';
import { EventFormValues } from './create-event-form/createForm.schema';

type EventFormUploadFilesProps = {
  register?: UseFormRegister<EventFormValues>;
  setUploadFiles: Dispatch<SetStateAction<File[]>>;
  formState: FormState<EventFormValues>;
  inputName: keyof EventFormValues;
  acceptTypes?: string;
  errors?: FieldErrors;
  onUpload: (snapshot: UploadResult) => void;
};

export const EventFormUploadFiles: FC<EventFormUploadFilesProps> = (props) => {
  const {
    register,
    setUploadFiles,
    formState,
    inputName,
    acceptTypes,
    onUpload,
  } = props;

  const { ref, ...rulesInputOptions } = register?.(inputName) ?? {};

  const uploadRulesFilesRef = useRef<HTMLInputElement | null>(null);

  const { errors } = formState;

  const handleFilesChange = ({
    currentTarget: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    console.log('in change');

    if (files?.length) {
      setUploadFiles((uploadFiles) => [...uploadFiles, ...files]);

      const storage = getStorage();
      for (let file of files) {
        const { name } = file;
        const storageRef = fireBaseRef(storage, `test/${name}`);

        // 'file' comes from the Blob or File API
        uploadBytes(storageRef, file).then(
          (snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
            onUpload(snapshot);
            console.log('in change', snapshot);
          }
          // TODO: catch error
        );
      }
      console.log('files in change', files);
      console.log('in change', errors.rules);
    }
  };

  return (
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
              ref?.(element);
              uploadRulesFilesRef.current = element;
            }}
            onChange={handleFilesChange}
            id="rules"
            multiple
            // className="opacity-0 w-0"
            type="file"
            accept={acceptTypes}
          />
        </div>
      </div>
      <ErrorMessage
        errors={errors}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name={inputName as any}
        render={({ message }) => (
          <InputErrorMessage>{message}</InputErrorMessage>
        )}
      />
    </div>
  );
};
