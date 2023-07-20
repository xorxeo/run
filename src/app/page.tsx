import { EventsList } from '@/components/eventsList';
import FirebaseService from '@/firebase/firebaseService';
import { getDocuments, writeDocument } from '@/firebase/getData';
import firebaseApp from '@/firebase/initFirebase';
import { EVENTS } from '@/modules/EventForm/components/create-event-form/create-event-form.consts';
import { EventFormValues } from '@/modules/EventForm/event-form.schema';
import { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';

// import './global.css';

export const metadata: Metadata = {
  title: 'RUN',
};






export default async function Page() {
  // const fetchedEvents = await firebaseApp.getDocuments('events');

  return (
    // add error fetch

   
     
      <div className="event-list-container flex w-full h-full justify-center">
        {/* {<EventsList items={fetchedEvents} />} */}main
      </div>
  
    // )
  );
}
