'use client';

import CreateEventForm from '../../../modules/EventForm/components/create-event-form/CreateEventForm';

export default function CreateEvent({
  params,
}: {
  params: {
    id: string;
  };
  }) {
 
  return <CreateEventForm params={params} />;
  
}
