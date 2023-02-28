import { authUserContext, useAuth } from "@/containers/AuthUserContainer";
import Link from "next/link";
import { useContext } from "react";


export const Navbar = () => {
  const flag = useContext(authUserContext);
  // const adminEmail = process.env.FIREBASE_CLIENT_EMAIL;
  
  const { signOff } = useAuth(); 

  const signOffClickHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    signOff();
  }
  

  return (
    <div className="flex justify-between h-12 bg-slate-300 text-slate-900 text-2xl">
      <div>logo</div>

      {flag.admin && <Link href="/admin">AdminPage</Link>}

      {flag.authUser?.email && (
        <Link href="/authentication" onClick={signOffClickHandler}>
          sign out
        </Link>
      )}

      {flag.authUser?.email == undefined && (
        <Link href="/authentication" className="">
          sign in
        </Link>
      )}
    </div>
  );
};
