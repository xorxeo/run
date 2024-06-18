import {
  decrementYoffset,
  incrementYoffset,
  reliefScaleYDecrement,
  reliefScaleYIncrement,
  update,
} from '@/app/redux/features/MapCreatorSlice';
import { useAppDispatch } from '@/app/redux/hooks';

// type MapEditorProps = {
//     currentScale: number;
// }

type MapEditorPropsType = {
  toggleHelper?: () => void;
};

export const MapEditor = ({ toggleHelper }: MapEditorPropsType) => {
  const dispatch = useAppDispatch();

  const handleScalePlus = () => {
    dispatch(reliefScaleYIncrement());
  };

  const handleScaleMinus = () => {
    dispatch(reliefScaleYDecrement());
  };

  const handleIncrYDist = () => {
    dispatch(incrementYoffset());
    // dispatch(update());
  };

  const handleDecrYDist = () => {
    dispatch(decrementYoffset());
    // dispatch(update());
  };
  // const handleToggle = () => { }
  return (
    <div className="absolute">
      <div className=" relative max-w-full ml-2">
        <button onClick={handleScaleMinus}>scale - </button>
        <button onClick={handleScalePlus}>scale + </button>
        {/* <button onClick={toggleHelper}>toggle vertexHelper</button> */}
      </div>
      <div className=" relative max-w-full ml-2 ">
        <button onClick={handleDecrYDist}>offset - </button>
        <button onClick={handleIncrYDist}>offset + </button>
      </div>
    </div>
  );
};
