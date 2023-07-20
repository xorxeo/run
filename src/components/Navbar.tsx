import Link from 'next/link';
import { AuthBar } from './auth/AuthBar';

export const Navbar = () => {
  return (
    <div className="flex justify-between h-12 bg-slate-100 ">
      <Link href="/" className='select-none'>logo</Link>
      <AuthBar />
    </div>
  );
};
