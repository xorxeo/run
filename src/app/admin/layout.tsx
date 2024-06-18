import { Sidebar } from '@/components/Sidebar';
import { Loader } from '@mantine/core';
import { Suspense } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log('children', children)
  return (
    <div className="admiN-container flex h-screen pt-12 bg-gray-500">
      <div className="sidebar-container flex w-[30%] bg-gray-400 m-[1px] justify-center rounded-lg  shadow-xl">
        <Sidebar />
      </div>
      {/* <Suspense fallback={'Loading!!!!!' }> */}
      <div className="children-container flex w-[70%] bg-gray-400 m-[1px] justify-center rounded-lg  shadow-xl">
        {children}
      </div>
      {/* </Suspense> */}
    </div>
  );
}
