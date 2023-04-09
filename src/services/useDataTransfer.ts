import { DistanceFormValues } from "@/components/CreateDistance";
import { EventFormValues } from "@/components/CreateEventForm";
import { DataTransferContext } from "@/containers/DataTransferContainer";
import { useContext, useEffect, useState } from "react";

export function useDataTransfer() {
  const DTO = useContext(DataTransferContext);
  // let distances = DTO.distances;

  const [distancesState, setDistancesState] = useState<DistanceFormValues[]>(
    []
  );
  const [eventsState, setEventsState] = useState<EventFormValues[]>([]);

  const setDistances = (data: DistanceFormValues) => {
      setDistancesState((distancesState) => [...distancesState, data]);
  };

  const deleteDistances = (index: number) => {
    const idx = distancesState.indexOf(distancesState[index]);
    if (idx !== -1) {
      distancesState.splice(idx, 1);
    }
    setDistancesState((distancesState) => [...distancesState]);
  };

  const updateDistance = (index: number, data: DistanceFormValues) => {
    distancesState[index] = data;
  };

  const setEvents = (data: EventFormValues) => {
    const rules = (rules: File[]) => {
      
    }
    setEventsState((eventsState) => [...eventsState, data])
  }

  
  // useEffect(() => {
  //   // DTO.distances = distancesState;
  //   console.log("useEffect distances", distancesState);
  //   // console.log("useEffect DTO.distances", distancesState);
  // }, [distancesState]);

  return {
    distancesState,
    setDistances,
    updateDistance,
    deleteDistances,
    eventsState,
    setEvents,
  };
}
