type EventCardPropsType = {
  title: string;
};

export const EventCard = (props: EventCardPropsType) => {
  return (
    <div className="flex ">
      <div>{props.title}</div>
    </div>
  );
};
