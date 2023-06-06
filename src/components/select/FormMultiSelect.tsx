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
import { Select, selectOptions } from './Select';
import {
  DistanceFormValues,
  PartnerFormValues,
} from '@/modules/EventForm/event-form.schema';
import { useDispatch } from 'react-redux';

type DataForSelectOptions = Record<string, string>[];

type FormSelectProps = {
  dataForSelectOptions: DataForSelectOptions;
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  title?: string;
  storedUnselectedOptions: selectOptions[];
  reducer: any;
  hasStoredValues?: boolean;
  errors?: FieldErrors;
} & DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

function transformDataToOptions(data: DataForSelectOptions) {
  let transformToOptionsData: selectOptions[] = [];
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

  const [optionsState, setOptionsState] = useState<selectOptions[]>([]);
  const [selectedOptionsState, setSelectedOptionsState] = useState<
    selectOptions[]
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
      field.value.filter((item: selectOptions[]) => item !== field.value[index])
    );
  };

  const filterSelectOptions = (
    event: ChangeEvent<HTMLSelectElement>,
    optionsState: selectOptions[]
  ) => {
    let filteredSelectOptions: selectOptions[] = [];

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
            <ul>
              {field.value.map(
                (value: Record<string, string>, index: number) => (
                  <li key={value.id}>
                    {value.name}
                    <button
                      key={value.id}
                      style={{ marginLeft: 80 }}
                      type="button"
                      onClick={() => {
                        handleUnselectItem(field, index);
                      }}
                    >
                      remove
                    </button>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      )}
      name={name}
      control={control}
    />
  );
};
