// 'use client'

import { UploadResult } from 'firebase/storage';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { FormTextField } from './../../../components/text-field/FormTextField';
import { EventFormValues, PartnerFormValues } from '../event-form.schema';
import { EventFormUploadFiles } from './EventFormUploadFiles';
import { nanoid } from 'nanoid';
import { addLogo, deleteLogo, selectLogos } from '../../../app/redux/features/eventFormSlice';
import { inputStyle } from '@/styles/eventFormStyles';
import {useAppDispatch, useAppSelector } from '../../../app/redux/hooks'
import { useEffect } from 'react';
import Image from 'next/image';
import DeleteIcon from '../../../../public/icons/delete-icon.svg';


export type PartnersType = Pick<EventFormValues, 'newPartners'>;

export const AddPartners = () => {
  const { control, formState, setValue, register } =
    useFormContext<PartnersType>();

  const { fields, append, remove, } = useFieldArray({
    name: 'newPartners',
    control,
  });

  const dispatch = useAppDispatch();
  const storedLogos = useAppSelector(selectLogos);

  // useEffect(() => {
  //   for (let field of fields) {
  //     setValue(`newPartners.${index}.logoPath`, storedLogos[index].path);
  //   }
  // }, [storedLogos]);

 useEffect(() => {
   fields.forEach((field, index) => { 
     if (!storedLogos[index]) {
       setValue(`newPartners.${index}.logoPath`, '');
     } else {
       setValue(`newPartners.${index}.logoPath`, storedLogos[index].path);
     }
    })
 }, [storedLogos]);

  // const handleLogoUpload = (index: number) => {
  //   return (snapshot: UploadResult) => {
  //     const logoName = snapshot.ref.name;
  //     dispatch(addLogo({ index, logoName }));
  //     setValue(`newPartners.${index}.logoName`, logoName);
  //   };
  // };

  const handleLogoDelete = (index: number) => {
    return () => {
      dispatch(deleteLogo(index));
      setValue(`newPartners.${index}.logoPath`, '');
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
      logoPath: '',
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
              inputName={`newPartners.${index}.logoPath` as const}
              label="Upload logo"
              index={index}
              reducer={addLogo}
            />

            {storedLogos[index] && (
              <div
                className="flex flex-row w-full min-h-12 justify-between items-center pl-2 pr-2 "
                key={nanoid()}
              >
                <div className="mr-1">
                  {storedLogos
                    .filter((logo) => logo.index === index)
                    .map((el) => el.name)}
                </div>
                <button
                  className="flex w-[10%] min-h-[2.5rem] items-center justify-center border-[1px] hover:bg-[#FBBD23] rounded-md"
                  type="button"
                  onClick={handleLogoDelete(index)}
                >
                  <Image
                    className="  "
                    src={DeleteIcon}
                    alt="delete icon"
                    height={20}
                    width={20}
                  ></Image>
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
