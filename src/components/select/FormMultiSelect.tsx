import {
  ChangeEvent,
  DetailedHTMLProps,
  FC,
  SelectHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldErrors,
} from 'react-hook-form';
import { Select, SelectOptions } from './Select';
import {
  DistanceFormValues,
  PartnerFormValues,
} from '@/modules/EventForm/event-form.schema';
import { useDispatch } from 'react-redux';
import Image from 'next/image';

import DeleteIcon from '../../../public/icons/delete-icon.svg';

type DataForSelectOptions = Record<string, string>[];

type FormSelectProps = {
  dataForSelectOptions: DataForSelectOptions;
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  title?: string;
  storedUnselectedOptions: SelectOptions[];
  reducer: any;
  hasStoredValues?: boolean;
  errors?: FieldErrors;
} & DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

function transformDataToOptions(data: DataForSelectOptions) {
  let transformToOptionsData: SelectOptions[] = [];
  for (let item of data) {
    transformToOptionsData.push({
      title: item.name,
      value: item,
    });
  }
  return transformToOptionsData;
}

export const FormMultiSelect: FC<FormSelectProps> = (props) => {
  const {
    dataForSelectOptions,
    control,
    name,
    label,
    placeholder,
    title,
    storedUnselectedOptions,
    reducer,
    hasStoredValues,
    errors,
    ...restProps
  } = props;

  const [optionsState, setOptionsState] = useState<SelectOptions[]>([]);
  const [selectedOptionsState, setSelectedOptionsState] = useState<
    SelectOptions[]
  >([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const selectOptions = transformDataToOptions(dataForSelectOptions);

    if (
      storedUnselectedOptions.length > 0 &&
      storedUnselectedOptions.length < selectOptions.length
    ) {
      setOptionsState(storedUnselectedOptions);
    } else if (hasStoredValues && storedUnselectedOptions.length === 0) {
      console.log('here');
      setOptionsState([]);
    } else {
      setOptionsState(selectOptions);
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(reducer(optionsState));
    };
  }, [dispatch, optionsState, reducer]);

  const handleSelectItem = (
    event: ChangeEvent<HTMLSelectElement>,
    field: ControllerRenderProps<any, string>
  ) => {
    field.onChange([...field.value, JSON.parse(event.target.value)]);

    setSelectedOptionsState((selectedOptionsState) => [
      ...selectedOptionsState,
      JSON.parse(event.target.value),
    ]);

    filterSelectOptions(event, optionsState);
  };

  const handleUnselectItem = (
    field: ControllerRenderProps<any, string>,
    index: number
  ) => {
    const unselectedItem = dataForSelectOptions.find((item) => {
      return item.id === field.value[index].id;
    });

    if (unselectedItem) {
      setOptionsState((optionsState) => [
        ...optionsState,
        {
          title: unselectedItem.name,
          value: unselectedItem,
        },
      ]);
    }

    field.onChange(
      field.value.filter((item: SelectOptions[]) => item !== field.value[index])
    );
  };

  const filterSelectOptions = (
    event: ChangeEvent<HTMLSelectElement>,
    optionsState: SelectOptions[]
  ) => {
    let filteredSelectOptions: SelectOptions[] = [];

    for (let option of optionsState) {
      if (JSON.parse(event.target.value).id !== option.value.id)
        filteredSelectOptions.push(option);
    }
    setOptionsState(filteredSelectOptions);
  };

  return (
    <Controller
      render={({ field, fieldState }) => (
        <div className="flex flex-col  justify-center items-center rounded-md ">
          {label && <label className="">{label}</label>}

          <Select
            {...restProps}
            options={optionsState}
            ref={field.ref}
            onChange={(event) => {
              handleSelectItem(event, field);
            }}
          ></Select>

          {field.value?.length > 0 && (
            <div className="flex flex-col w-full ">
              {field.value.map(
                (value: Record<string, string>, index: number) => (
                  <div
                    className="flex flex-row w-full min-h-12 justify-between items-center pl-2 pr-2 "
                    key={value.id}
                  >
                    <div className="flex w-[70%] h-[100%] min-h-[2.5rem] items-center justify-center  overflow-hidden border-[#FBBD23] border-[1px] rounded-md">
                      {value.name}
                    </div>

                    <button
                      className="flex w-[30%] min-h-[2.5rem] m-0 items-center justify-center border-[1px] hover:bg-[#FBBD23] rounded-md"
                      key={value.id}
                      onClick={() => {
                        handleUnselectItem(field, index);
                      }}
                    >
                      <Image
                        className=""
                        src={DeleteIcon}
                        alt="delete icon"
                        height={20}
                        width={20}
                      ></Image>
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
      name={name}
      control={control}
    />
  );
};
