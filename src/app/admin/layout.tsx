import { Sidebar } from '@/components/Sidebar';
import { LoadingSkeleton } from '@/components/loading-skeleton/LoadingSkeleton';
import { Suspense } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log('children', children)
  return (
    <div className="admin-container flex w-[100vw] h-[90vh]">
      <div className="sidebar-container flex  w-[30%] h-full m-4 justify-center rounded-lg border-2 border-black">
        <Sidebar />
      </div>
      <Suspense fallback={'Loading!!!!!' && <LoadingSkeleton />}>
        <div className="children-container flex w-[70%] h-full m-4 justify-center rounded-lg border-2 border-black">
          {children}
        </div>
      </Suspense>
    </div>
  );
}
