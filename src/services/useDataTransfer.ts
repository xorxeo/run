// import { useContext, useEffect, useState } from 'react';
// import { EventFormValues } from '@/modules/EventForm/components/create-event-form/createFormSchema';

// export function useDataTransfer() {
//   const DTO = useContext(DataTransferContext);
//   // let distances = DTO.distances;

//   const [distancesState, setDistancesState] = useState<InputsUnion[]>([]);
//   const [eventsState, setEventsState] = useState<EventFormValues[]>([]);

//   const setDistances = (data: InputsUnion) => {
//     setDistancesState((distancesState) => [...distancesState, data]);
//   };

//   const deleteDistances = (index: number) => {
//     const idx = distancesState.indexOf(distancesState[index]);
//     if (idx !== -1) {
//       distancesState.splice(idx, 1);
//     }
//     setDistancesState((distancesState) => [...distancesState]);
//   };

//   const updateDistance = (index: number, data: InputsUnion) => {
//     distancesState[index] = data;
//   };

//   const setEvents = (data: EventFormValues) => {
//     const rules = (rules: File[]) => {};
//     setEventsState((eventsState) => [...eventsState, data]);
//   };

//   // useEffect(() => {
//   //   // DTO.distances = distancesState;
//   //   console.log("useEffect distances", distancesState);
//   //   // console.log("useEffect DTO.distances", distancesState);
//   // }, [distancesState]);

//   return {
//     distancesState,
//     setDistances,
//     updateDistance,
//     deleteDistances,
//     eventsState,
//     setEvents,
//   };
// }
