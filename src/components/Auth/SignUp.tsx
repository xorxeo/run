// import "Auth.module.css"
import { useAuth } from "@/containers/AuthUserContainer";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { FirebaseErrorCodes } from "./auth.types";

type Inputs = {
  email: string;
  password: string;
};

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>();

  const router = useRouter();

  const { createUserEmailAndPassword } = useAuth();

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      await createUserEmailAndPassword(email, password);
      router.push("/");
    } catch (error) {
      const { code } = error as FirebaseError;

      if (code === FirebaseErrorCodes.WEAK_PASSWORD) {
        setError("password", { message: code });
        return;
      }
      if (code === FirebaseErrorCodes.INVALID_EMAIL) {
        setError("email", { message: code });
        return;
      }
      if (code === FirebaseErrorCodes.EMAIL_EXISTS) {
        setError("email", { message: code });
        return;
      }
    }
  });

  return (
    <div className="flex h-screen w-screen bg-slate-100  ">
      <div className="flex flex-col m-auto bg-slate-200  h-[60%] w-[80%] hero-content shadow-md rounded-md">
        <form onSubmit={onSubmit} className="flex flex-col w-[40%]">
          <h1 className="flex  w-[100%] text-xl font-normal h-12">Register</h1>

          <div className="form-control font-light">
            <label className="label pl-0 h-12">
              <span className="label-text">Email address</span>
            </label>
            <input
              type="email"
              autoComplete="on"
              placeholder="email"
              className="input input-bordered"
              {...register("email", { required: true })}
            />
          </div>
          {errors.email && <div>{errors.email.message}</div>}

          <div className="form-control font-light">
            <label className="label pl-0 h-12">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              autoComplete="on"
              placeholder="password"
              className="input input-bordered"
              {...register("password", { required: true })}
            />
          </div>
          {errors.password && <div>{errors.password.message}</div>}

          <div className="flex justify-center h-12 rounded-lg mt-12 bg-[#FBBD23] font-normal hover:scale-105 transition-transform duration-200 ">
            <button>Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
};
