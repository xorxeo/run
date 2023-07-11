

import FirebaseService from '@/firebase/firebaseService';
import firebaseApp from '@/firebase/initFirebase';
import {
  DistanceFormValues,
  EventFormValues,
} from '@/modules/EventForm/event-form.schema';
import Image from 'next/image';
import { Suspense } from 'react';

type EventCardPropsType = {
  item: EventFormValues;
};

const file =  (
  path: string
) => {
  
  return firebaseApp.getFileFromStorage(path);
};

export async function EventCard ({ item }: EventCardPropsType) {

  const files = await file(item.images[0].path);
  // console.log('===============================files', files)

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="flex flex-col mb-20 border-[1px] border-black rounded-md">
        {files && typeof files === 'string' && (
          <Image
            src={files}
            width={500}
            height={500}
            alt={`Picture of ${item.images[0]}`}
          />
        )}
        <div>{item.eventName}</div>
        <div>{item.information}</div>
      </div>
    </Suspense>
  );
};
