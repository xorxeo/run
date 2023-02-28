import { createContext, useContext, Context, FC, PropsWithChildren } from "react";
import {
  useFirebaseAuth,
  authUserContextType,
} from "@/services/auth/useFirebaseAuth";
import { User } from "firebase/auth";


export const authUserContext = createContext<authUserContextType>({
    authUser: null,
    admin: null,
  loading: true,
  signInEmailAndPassword: async () => {},
  createUserEmailAndPassword: async () => {},
  signOff: async () => {},
  checkAdmin: (): void => {},
});

export const AuthUserProvider: FC<PropsWithChildren> = ({ children }) => {
    const auth = useFirebaseAuth();
    return <authUserContext.Provider value = {auth}>{ children }</authUserContext.Provider>
}

export const useAuth = () => {

   return useContext(authUserContext);
}