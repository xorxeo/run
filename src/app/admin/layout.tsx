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
    <div className="admin-container flex h-[90dvh]">
      <div className="sidebar-container flex w-[30%] h-full m-4 justify-center rounded-lg border-2 border-black">
        <Sidebar />
      </div>
      {/* <Suspense fallback={'Loading!!!!!' }> */}
      <div className="children-container flex w-[70%] h-full m-4 justify-center rounded-lg border-2 border-black">
        {children}
      </div>
      {/* </Suspense> */}
    </div>
  );
}
