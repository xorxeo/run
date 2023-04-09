import { FirebaseContext } from "@/containers/FirebaseContainer";
import { collection, doc, Firestore, setDoc } from "firebase/firestore";

type AddDataInDatabaseType = {
  database: Firestore;
  data: {};
  collection: string;
  title: string;
};

export function useDatabaseManageData() {
  async function addDataInDatabase(
    database: Firestore,
    collection: string,
    title: string,
    data: {},
  ) {
    console.log("setDoc");
    await setDoc(doc(database, collection, title), data);

  }

  async function UploadDataToStorage () {
    
  }
  return {
    addDataInDatabase,
    UploadDataToStorage,
  };
}
