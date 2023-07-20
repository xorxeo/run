
type Case = {
    case: {
        
    }
}
type DIalogFormProps = {
    children: JSX.Element;
    cases: Case;
  conditions: { isEdit: boolean; isDirty: boolean };
};

export const DialogForm = ({ children, conditions }: DIalogFormProps) => {

};
