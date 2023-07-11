'use client';

import  {CreateDistance}  from '@/modules/EventForm/components/CreateDistance';

export default function EditDistance ({ params }: { params: {
  id: string
}
}) {
 
  return <CreateDistance params={params} />;
};


