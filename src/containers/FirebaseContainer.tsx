import { FirebaseEntity, initFirebase } from "@/firebase/initFirebase";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";


import { getAuth, signInAnonymously } from "firebase/auth";

export const FirebaseContext = createContext<FirebaseEntity>(
  null as unknown as FirebaseEntity
);

export const FirebaseContainer: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [entity, setEntity] = useState<FirebaseEntity | null>(null);

  useEffect(() => {
    let { app, db, currentAuth } = initFirebase();

    currentAuth = getAuth();
    // signInAnonymously(currentAuth);

    if (app && db && currentAuth) {
      setEntity({ app, db, currentAuth });
    } else {
      console.warn("No app or db");
    }
  }, []);

  // console.log(entity);

  if (!entity) {
    return null;
  }

  return (
    <FirebaseContext.Provider value={entity}>
      {children}
    </FirebaseContext.Provider>
  );
};
