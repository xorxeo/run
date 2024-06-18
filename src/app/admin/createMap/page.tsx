import { CreateMap } from '@/modules/EventForm/components/create-map/CreateMap';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'RUN',
};

export default async function Page() {
  // const fetchedEvents = await firebaseApp.getDocuments('events');

  return (
    // add error fetch

    <div className="flex flex-col w-full items-center rounded bg-gray-500">
      <CreateMap />
    </div>

    // )
  );
}
// console.log('first', exist);
// const { setIsOpen } = useYandexMap();
// const initYmaps = () => {
//   setIsOpen(true);
// };

// useEffect(() => {
//   if (exist) {
//     // Код, который будет выполнен после загрузки скрипта
//     // Например, инициализация карты
//     window.ymaps.ready(() => {
//       // Ваш код инициализации карты

//     });
//   }
// }, [exist]);
