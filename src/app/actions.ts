'use server';

import firebaseApp from '@/firebase/initFirebase';

export async function fetchCollection(collectionName: string) {
  console.log('in server action');
  return await firebaseApp.getDocuments(collectionName);
}
