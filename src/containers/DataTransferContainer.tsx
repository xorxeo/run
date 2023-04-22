// import { useDataTransfer } from '@/services/useDataTransfer';
// import {
//   createContext,
//   FC,
//   PropsWithChildren,
//   useContext,
//   useState,
// } from 'react';

// type DataTransferContextType = {
//   distancesState: InputsUnion[];
//   setDistances: (data: InputsUnion) => void;
//   updateDistance: (index: number, data: InputsUnion) => void;
//   deleteDistances: (index: number) => void;
//   eventsState: EventFormValues[];
//   setEvents: (data: EventFormValues) => void;
// };

// export const DataTransferContext = createContext<DataTransferContextType>({
//   distancesState: [],
//   setDistances: () => [],
//   updateDistance: () => [],
//   deleteDistances: () => [],
//   eventsState: [],
//   setEvents: () => [],
// });

// export const DataTransferContainer: FC<PropsWithChildren> = ({ children }) => {
//   const data = useDataTransfer();

//   return (
//     <DataTransferContext.Provider value={data}>
//       {children}
//     </DataTransferContext.Provider>
//   );
// };

// export const useDataTransferContext = () => {
//   return useContext(DataTransferContext);
// };
