'use client';

import { CreateDistance } from '@/modules/EventForm/components/CreateDistance';
// import MyComponent from '@/modules/EventForm/components/ThreeScene';

export default function EditDistance({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <>
      <CreateDistance params={params} />
      {/* <MyComponent /> */}
    </>
  )
}
