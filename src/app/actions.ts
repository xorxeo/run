'use server';

import firebaseApp from '@/firebase/initFirebase';

export async function fetchCollection(collectionName: string) {
  return firebaseApp.getDocuments(collectionName);
}

