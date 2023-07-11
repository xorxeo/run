'use client';

import { CreateDistance } from '@/modules/EventForm/components/CreateDistance';
import {
  DISTANCE_DEFAULT_VALUES,
  distancesSchema,
} from '@/modules/EventForm/event-form.schema';
import { UseFormManager } from '@/services/hooks/useFormManager';

export default function addNewDistance({
  params,
}: {
  params: {
    id: string;
  };
}) {
  // console.log('params.id addNewDistance', params.id);
  // const CreateNewDistance = FormManager(CreateDistance)
  // return <CreateNewDistance params={params}/>;
  return (
  
      <CreateDistance params={params} />
   
  );
}
