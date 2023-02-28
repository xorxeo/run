import { useAuth } from "@/containers/AuthUserContainer";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { Inputs, Errors } from "./auth.types";

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>();

  const router = useRouter();

  const { signInEmailAndPassword, admin } = useAuth();

  const onSubmit = handleSubmit(({ email, password }) => {
    signInEmailAndPassword(email, password)
      .then(() => {
        router.push("/");
      })
      .then(() => {
        console.log(admin);
      })
      .catch((error) => {
        const { code } = error;

        if (code === Errors.EMAIL_NOT_FOUND) {
          setError("email", { message: code });
          return;
        }
        if (code === Errors.INVALID_PASSWORD) {
          setError("password", { message: code });
          return;
        }
        setError("root", { message: code });
      });
  });

  return (
    <div className="flex h-screen w-screen bg-slate-100 ">
      <div className="flex flex-col m-auto bg-slate-200  h-[60%] w-[80%] hero-content shadow-md rounded-md">
        <form onSubmit={onSubmit} className="flex flex-col w-[40%]">
          <h1 className="flex  w-[100%] text-xl font-normal h-12">
            Sign in to your account
          </h1>

          <div className="form-control font-light">
            <label className="label pl-0 h-12">
              <span className="label-text">Email address</span>
            </label>
            <input
              type="email"
              autoComplete="on"
              placeholder="email"
              className="input input-bordered "
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
              className="input input-bordered "
              {...register("password", { required: true })}
            />
            {errors.password && <div>{errors.password.message}</div>}
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
