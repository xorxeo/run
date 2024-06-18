import { EventsList } from '@/components/eventsList';
import FirebaseService from '@/firebase/firebaseService';
import { getDocuments, writeDocument } from '@/firebase/getData';
import firebaseApp from '@/firebase/initFirebase';
import { Scene3DMap } from '@/modules/EventForm/components/create-map/3DMap/3DMapScene';
import { EVENTS } from '@/modules/EventForm/components/create-event-form/create-event-form.consts';
import { EventFormValues } from '@/modules/EventForm/event-form.schema';
import { Metadata } from 'next';
import Script from 'next/script';
import { ReactNode, Suspense } from 'react';

// import './global.css';

export const metadata: Metadata = {
  title: 'RUN',
};

export default async function Page() {
  // const fetchedEvents = await firebaseApp.getDocuments('events');

  return (
    // add error fetch
    <>
      <div className="event-list-container flex flex-col items-center bg-gray-200">
        {/* <h1 className=" bg-red-400 ">MAIN</h1> */}
        {/* <div id="3dContainer" className="flex w-[400px] h-[400px] ">
        <ThreeScene containerId="3dContainer" />
      </div> */}
      </div>
    </>
    // )
  );
}
