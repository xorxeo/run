import { authUserContext, useAuth } from "@/containers/AuthUserContainer";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const { signInEmailAndPassword, admin } = useAuth();

  const q = useContext(authUserContext);

  const onSubmit = (e: React.FormEvent) => {
    setError(null);

    signInEmailAndPassword(email, password)
        .then(() => {
            // checkAdmin();
        router.push("/");
        })
        .then(() => {
            console.log(admin);
            
        })
      .catch((error) => {
        setError(error.message);
      });
    e.preventDefault();
  };

  return (
    <div
      className="flex h-screen w-screen bg-slate-100 "
    >
      <div className="flex flex-col m-auto bg-slate-200  h-[60%] w-[80%] hero-content shadow-md rounded-md">
        <form onSubmit={onSubmit} className="flex flex-col w-[40%]">
          <h1 className="flex  w-[100%] text-xl font-normal h-12">
            Sign in to your account
                  </h1>
                  {error && <div>{ error}</div>}

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
              className="input input-bordered "
            />
          </div>

          <div className="form-control font-light">
            <label className="label pl-0">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="passwordOne"
              value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                  event.preventDefault();
                              }
                          }}
              id="signUpPassword"
              autoComplete="on"
              placeholder="password"
              className="input input-bordered "
            />
          </div>

          <div className="flex justify-between h-12">
            <div className="flex items-center text-sm font-light">
              Need an account?
            </div>
           
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/registration");
                }}
                className="label-text-alt text-sm font-normal"
              >
                Sign up
              </button>
            
          </div>
          <div className="flex justify-center h-12 rounded-lg bg-[#FBBD23] font-normal hover:scale-105 transition-transform duration-200 ">
            <button className="w-[100%]">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  );
};
