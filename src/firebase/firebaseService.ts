import {
  FirebaseApp,
  FirebaseError,
  getApps,
  initializeApp,
} from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  Firestore,
  CollectionReference,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  FirebaseStorage,
  StorageError,
  getDownloadURL,
  getStorage,
  ref,
} from 'firebase/storage';
import { Auth, getAuth } from 'firebase/auth';

// type FirebaseServiceType = {
//   firestore: Firestore;
//   storage: FirebaseStorage;
//   collectionRef: CollectionReference;
//   collectionName: string;
// };

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  dataBaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_MEASUREMENT_ID,
};

class FirebaseService {
  firestore: Firestore;
  storage: FirebaseStorage;
  app: FirebaseApp;
  auth: Auth;
  error: any;

  constructor() {
    this.app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    this.firestore = getFirestore(this.app);
    this.storage = getStorage();
    this.auth = getAuth();
    this.error = '';
    // this.collectionRef = collection(this.firestore, collectionName);
  }

  async addDocument(collectionName: string, data: any) {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const documentRef = doc(collectionRef, data.id);
      await setDoc(documentRef, data);
      console.log('Document written with ID: ', documentRef.id);
    } catch (error) {
      const { message } = error as FirebaseError;
      return (this.error = message);
    }
  }

  async updateDocument(collectionName: string, data: any) {
    console.log('data.id', data.id);
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const documentRef = doc(collectionRef, data.id);
      await updateDoc(documentRef, data);
    } catch (error) {
      const { message } = error as FirebaseError;
      return (this.error = message);
    }
  }

  async deleteDocumentByID(collectionName: string, id: string) {
    console.log('in delete', id);
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const documentRef = doc(collectionRef, id);
      await deleteDoc(documentRef);
      console.log('delete documentRef', documentRef);
    } catch (error) {
      const { message } = error as FirebaseError;
      return (this.error = message);
    }
  }

  async getDocuments(collectionName: string) {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const querySnapshot = await getDocs(collectionRef);
      if (querySnapshot.empty) {
       throw new Error(
         (this.error = `Collection ${collectionName} does not exist or is empty`)
       );
      }
      const documents = querySnapshot.docs.map(doc => doc.data());
      return documents;
    } catch (error) {
      const { message } = error as FirebaseError;
      return (this.error = message);
      // throw new Error(message);
    }
  }

  async getFileFromStorage(path: string) {
    try {
      const fileRef = ref(this.storage, path);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      const { message } = error as FirebaseError;
      return (this.error = message);
    }
  }
}

export default FirebaseService;
