import { useDispatch, useSelector } from 'react-redux';
import { UploadResult } from 'firebase/storage';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { FormTextField } from './../../../components/text-field/FormTextField';
import { EventFormValues, PartnerFormValues } from '../event-form.schema';
import { EventFormUploadFiles } from './EventFormUploadFiles';
import { nanoid } from 'nanoid';
import { addLogo, deleteLogo, selectLogos } from '../store/eventFormSlice';
import { inputStyle } from '@/styles/eventFormStyles';


export type PartnersType = Pick<EventFormValues, 'newPartners'>;

export const AddPartners = () => {
  const { control, formState, setValue, register } =
    useFormContext<PartnersType>();

  const { fields, append, remove } = useFieldArray({
    name: 'newPartners',
    control,
  });

  const dispatch = useDispatch();
  const storedLogos = useSelector(selectLogos);

  const handleLogoUpload = (index: number) => {
    return (snapshot: UploadResult) => {
      const logoName = snapshot.ref.name;
      dispatch(addLogo({ index, logoName }));
      setValue(`newPartners.${index}.logoName`, logoName);
    };
  };

  const handleLogoDelete = (index: number) => {
    return () => {
      dispatch(deleteLogo(index));
      setValue(`newPartners.${index}.logoName`, '');
    };
  };

  const handlePartnerDelete = (index: number) => {
    dispatch(deleteLogo(index));
    remove(index);
  };

  const handleAppendNewItem = () => {
    append({
      id: nanoid(),
      name: '',
      link: '',
      logoName: '',
    });
  };

  // TODO: check logo name - if is the same as the one in firebase, push it in storedLogos
  // probably do this in common upload files method

  return (
    <div className="flex flex-col  items-center rounded-md border border-slate-900  max-w-[100%]  ">
      {fields.map((field, index) => {
        return (
          <div className="flex flex-col w-full" key={field.id}>
            <input type="hidden" {...register(`newPartners.${index}.id`)} />

            <FormTextField
              control={control}
              name={`newPartners.${index}.name` as const}
              label="Name"
              style={inputStyle}
            />

            <FormTextField
              control={control}
              name={`newPartners.${index}.link` as const}
              label="Link"
              style={inputStyle}
            />

            <EventFormUploadFiles
              collectionName={`partners`}
              formState={formState}
              inputName={`newPartners.${index}.logoName` as const}
              label="Upload logo"
              onUpload={handleLogoUpload(index)}
            />

            {storedLogos[index] && (
              <div key={nanoid()}>
                <span className="mr-1">
                  {storedLogos
                    .filter((logo) => logo.index === index)
                    .map((el) => el.logoName)}
                </span>
                <button type="button" onClick={handleLogoDelete(index)}>
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
            )}
            <button type="button" onClick={() => handlePartnerDelete(index)}>
              Delete Partner
            </button>
          </div>
        );
      })}

      <button type="button" onClick={() => handleAppendNewItem()}>
        Add New Partner
      </button>
    </div>
  );
};
