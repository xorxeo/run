'use client';

import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import signInEmailAndPassword from '../../firebase/auth/SignIn';
import { FirebaseErrorCodes } from '../../firebase/auth/auth.types';
import Link from 'next/link';

type SignUpInputs = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().email({ message: 'invalid email address' }),
  password: z.string().min(6, { message: 'required min 6 symbols' }),
});

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpInputs>({
    resolver: zodResolver(schema),
    mode: 'onBlur'
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async ({ email, password }) => {
 
    try {
      await signInEmailAndPassword(email, password).then((error)=>{console.log('error', error)});
      router.push('/');
    } catch (error) {
      const { code } = error as FirebaseError;
      console.log('error', error)
      if (code === FirebaseErrorCodes.EMAIL_NOT_FOUND) {
        setError('email', { message: code });
        return;
      }
      if (code === FirebaseErrorCodes.INVALID_PASSWORD) {
        setError('password', { message: code });
        return;
      }
      setError('root', { message: code });
    }
  });


  return (
    <div className="flex h-screen w-screen bg-slate-100  ">
      <div className="flex flex-col m-auto bg-slate-200  h-[60%] w-[80%] hero-content shadow-md rounded-md">
        <form onSubmit={onSubmit} className="flex flex-col w-[40%]">
          <h1 className="flex  w-[100%] text-xl font-normal h-12">Hello</h1>

          <div className="form-control font-light">
            <label className="label pl-0 h-12">
              <span className="label-text">Email address</span>
              {errors.email && (
                <div className="text-red-700">{errors.email.message}</div>
              )}
            </label>
            <input
              type="email"
              autoComplete="on"
              placeholder="email"
              className="input input-bordered"
              {...register('email', { required: true })}
            />
          </div>

          <div className="form-control font-light">
            <label className="label pl-0 h-12">
              <span className="label-text">Password</span>
              {errors.password && (
                <div className="text-red-700">{errors.password.message}</div>
              )}
            </label>
            <input
              type="password"
              autoComplete="on"
              placeholder="password"
              className="input input-bordered"
              {...register('password', { required: true })}
            />
          </div>

          <div className="flex justify-between h-12">
            <div className="flex items-center text-sm font-light">
              Need an account?
            </div>

            <Link href="/signUp" className="">
              Sign Up
            </Link>
          </div>

          <div className="flex justify-center h-12 rounded-lg mt-12 bg-[#FBBD23] font-normal hover:scale-105 transition-transform duration-200 ">
            <button >Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
}
