import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { getAuth } from "firebase/auth";

import { FirebaseEntity, initFirebase } from "@/firebase/initFirebase";

export const FirebaseContext = createContext<FirebaseEntity>(
  null as unknown as FirebaseEntity
);

export const FirebaseContainer: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [entity, setEntity] = useState<FirebaseEntity | null>(null);

  useEffect(() => {
    let { app, db, currentAuth } = initFirebase();
    currentAuth = getAuth();

    if (app && db && currentAuth) {
      setEntity({ app, db, currentAuth });
    } else {
      console.warn("No app or db");
    }
  }, []);

  if (!entity) {
    return null;
  }

  return (
    <FirebaseContext.Provider value={entity}>
      {children}
    </FirebaseContext.Provider>
  );
};
