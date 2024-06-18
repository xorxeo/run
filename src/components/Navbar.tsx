import Link from 'next/link';
import { AuthBar } from './auth/AuthBar';

export const Navbar = () => {
  return (
    <div className="absolute flex justify-between w-full h-12 bg-gray-400 rounded-lg border-[1px] border-black">
      <Link href="/" className="select-none">
        logo
      </Link>
      <AuthBar />
    </div>
  );
};
