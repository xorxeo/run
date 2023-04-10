import { ChangeEvent, Dispatch, FC, SetStateAction, useRef } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import { ErrorCodes, EventFormValues } from '../event-form.typings';
import { getStorage, ref as fireBaseRef, uploadBytes } from 'firebase/storage';

type EventFormUploadFilesProps = {
  register: UseFormRegister<EventFormValues>;
  setUploadFiles: Dispatch<SetStateAction<File[]>>;
  formState: FormState<EventFormValues>;
};

export const EventFormUploadFiles: FC<EventFormUploadFilesProps> = (props) => {
  const { register, setUploadFiles, formState } = props;
  const { ref, ...rulesInputOptions } = register('rules');
  const uploadRulesFilesRef = useRef<HTMLInputElement | null>(null);

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
        uploadBytes(storageRef, file).then((snapshot) => {
          console.log('Uploaded a blob or file!', snapshot);
        });
      }
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
              ref(element);
              uploadRulesFilesRef.current = element;
            }}
            onChange={handleFilesChange}
            id="rules"
            multiple
            className="opacity-0 w-0"
            type="file"
            accept="application/pdf, application/msword"
          />
        </div>

        {/* <div>
                  {uploadFiles?.length > 0 &&
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
                </div> */}
        {/* {formState.errors.rules && (
                  <div className="text-red-700">
                    {formState.errors.rules?.message ===
                      ErrorCodes.invalidTypes &&
                      `${InvalidMIMETypesFiles?.join(', ')}`}
                  </div>
                )} */}
      </div>
    </div>
  );
};
