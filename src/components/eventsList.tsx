'use client';

import {
  DistanceFormValues,
  EventFormValues,
} from '@/modules/EventForm/event-form.schema';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { EventCard } from './EventCard';
import { FirebaseError } from 'firebase/app';
import { fetchCollection } from '@/app/actions';
import {
  isDistances,
  isError,
  isEvents,
} from '@/services/hooks/useFormManager';

type EventsListProps = {
  items: DocumentData[] | string;
  // fetch?: (collectionName: string) => Promise<DocumentData[] | string>;
};

type Items = EventFormValues[] | DistanceFormValues[];

// const isEvents = (items: unknown): items is EventFormValues[] => {
//   return (items as EventFormValues[]).every((item) => !!item.eventName);
// };
// const isDistances = (items: unknown): items is DistanceFormValues[] => {
//   return (items as DistanceFormValues[]).every((item) => !!item.distanceName);
// };
// const isError = (items: unknown) => {
//   if (typeof items === 'string') return true;
// };

export const EventsList = ({ items }: EventsListProps) => {
  const [events, setEvents] = useState<DocumentData[] | string>([]);

  useEffect(() => {
    setEvents(items);
  }, []);

  return (
    <div className="mt-5 w-[90%]">
      {!isError(events) && isEvents(events) && (
        <div className="flex flex-col w-full ">
          {events &&
            events.map((event) => (
              /* @ts-expect-error Server Component */
              <EventCard key={event.eventName} item={event} />
            ))}
        </div>
      )}

      {!isError(events) && isDistances(events) && (
        <div>
          {events &&
            events.map((event) => (
              <div key={event.distanceName}>{event.distanceName}</div>
            ))}
        </div>
      )}

      {isError(events) && <div>{events as string}</div>}
    </div>
  );
};
