

type DialogButton = {
  buttonText: string;
  buttonOnClick: () => void;
};

type DialogCases = {
  newForm: ['submit', 'cancel'];
  editForm: ['saveChanges', 'cancel'];
};

type DialogCaseOptions<T extends keyof DialogCases> = {
  [K in DialogCases[T][number]]: {
    content: {
      title: string;
      body: string;
    };
    buttons: DialogButton;
  };
};

type DialogCase<T extends keyof DialogCases> = {
  case: T;
  options: { [K in DialogCases[T][number]]: DialogCaseOptions<T>[K] };
};

const dialogCase: Array<DialogCase<'newForm'> | DialogCase<'editForm'>> = [
  {
    case: 'newForm',
    options: {
      submit: {
        content: {
          title: 'Submit form',
          body: 'Are you sure you want to submit this form?',
        },
        buttons: {
          buttonText: 'Submit',
          buttonOnClick: () => {},
        },
      },
      cancel: {
        content: {
          title: 'Cancel form',
          body: 'Are you sure you want to cancel this form?',
        },
        buttons: {
          buttonText: 'Cancel',
          buttonOnClick: () => {},
        },
      },
    },
  },
  {
    case: 'editForm',
    options: {
      saveChanges: {
        content: {
          title: 'Save changes',
          body: 'Are you sure you want to save your changes?',
        },
        buttons: {
          buttonText: 'Save',
          buttonOnClick: () => {},
        },
      },
      cancel: {
        content: {
          title: 'Cancel form',
          body: 'Are you sure you want to cancel this form?',
        },
        buttons: {
          buttonText: 'Cancel',
          buttonOnClick: () => {},
        },
      },
    },
  },
];

