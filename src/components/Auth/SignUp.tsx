// import "Auth.module.css"

import { useAuth, authUserContext } from "@/containers/AuthUserContainer";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { createUserEmailAndPassword } = useAuth();

  const q = useContext(authUserContext);

  const onSubmit = (e: React.FormEvent) => {
    setError(null);
    if (passwordOne === passwordTwo) {

      createUserEmailAndPassword(email, passwordOne)
        .then((authUser) => {
          console.log("Success");
          router.push("/");
          console.log(q.authUser?.email);
        })
        .catch((error) => {
          setError(error.message);
        });
    } else {
      setError("Password do not match");
    }
    e.preventDefault();
  };

  return (
    <div
      className="flex h-screen w-screen bg-slate-100  "
    >
      <div className="flex flex-col m-auto bg-slate-200  h-[60%] w-[80%] hero-content shadow-md rounded-md">
        <form onSubmit={onSubmit} className="flex flex-col w-[40%]">
          <h1 className="flex  w-[100%] text-xl font-normal h-12">Register</h1>

          <div className="form-control font-light">
            <label className="label pl-0">
              <span className="label-text">Email address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              name="email"
              id="signUpEmail"
              autoComplete="on"
              placeholder="email"
              className="input input-bordered"
            />
          </div>

          <div className="form-control font-light">
            <label className="label pl-0">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="passwordOne"
              value={passwordOne}
              onChange={(event) => setPasswordOne(event.target.value)}
              id="signUpPassword1"
              autoComplete="on"
              placeholder="password"
              className="input input-bordered"
            />
          </div>

          <div className="form-control font-light">
            <label className="label pl-0">
              <span className="label-text">Repeat password</span>
            </label>
            <input
              type="password"
              name="passwordOne"
              value={passwordTwo}
              onChange={(event) => setPasswordTwo(event.target.value)}
              id="signUpPassword2"
              autoComplete="on"
              placeholder="password"
              className="input input-bordered"
            />
            <div className="label flex justify-between h-12">
              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </div>
          </div>
          <div className="flex justify-center h-12 rounded-lg  bg-[#FBBD23] font-normal hover:scale-105 transition-transform duration-200 ">
            <button>Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
};
