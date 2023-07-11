import firebaseApp from './initFirebase';
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
    addDoc,
    DocumentData,
  CollectionReference
} from 'firebase/firestore';
import { DistanceFormValues, EventFormValues } from '@/modules/EventForm/event-form.schema';
import { deleteObject, getStorage, ref as fireBaseRef } from 'firebase/storage';

const db = firebaseApp.firestore;

const storage = firebaseApp.storage;

type DocRef<T extends EventFormValues[] | DistanceFormValues[]> = T extends EventFormValues[] ? EventFormValues[] : DistanceFormValues[];
type Collections = 'events' | 'distances';

export async function getDocuments(collectionName: Collections) {
  const docsRef = collection(db, collectionName);

  let result = null;
  let error = null;

  try {
    result = await getDocs(docsRef);
  } catch (err) {
    error = err;
    console.log('error', error);
  }

  return { result, error };
}

export async function writeDocument(collectionName: string, data: any) {
  const docsRef = collection(db, collectionName);
  let result = null;
  let error = null;
  try {
    result = await addDoc(docsRef, data);
    // console.log('add', result);
  } catch (err) {
    // console.log('add error', error)
    error = err;
  }

  if (result) {
    // data.push(result.docs.map((doc) => ( (JSON.stringify(doc.data())))));
    // console.log(result)
  }
  //  console.log('data', data)
  // console.log('result', result?.docs[0].data())
  return { result, error };
}

export function deleteFileFromStorageWithPath (
  path: string,
) {
  const fileRef = fireBaseRef(storage, `${path}`);
  deleteObject(fileRef);
};
