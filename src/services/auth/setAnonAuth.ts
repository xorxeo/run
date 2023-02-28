import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

export const setAnonAuth = () => {
  const auth = getAuth();

  signInAnonymously(auth)
     .then(() => {
    //   onAuthStateChanged(auth, (user) => {    
    //   });   
      //  console.log(auth.currentUser?.isAnonymous); 
    })
    .catch((error) => {
      console.warn(error.code, error.mesage);
    });

  return auth;
};
