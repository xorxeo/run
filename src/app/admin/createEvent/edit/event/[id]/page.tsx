'use client';

import CreateEventForm from '@/modules/EventForm/components/create-event-form/CreateEventForm';
import Link from 'next/link';

export default function EditEvent({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div>
      <CreateEventForm params={params} />
    </div>
  );
}
