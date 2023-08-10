import { Button, ButtonProps, Text, createStyles } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FC } from 'react';

const useStyles = createStyles((theme) => ({
  root: {
   background: 'red',
 },
}));

type ModalProps = {
  title?: string;
  openModalStyle?: string;
  confirmStyle?: ButtonProps;
  cancelStyle?: ButtonProps;
};

export const Modal: FC<ModalProps> = ({
  openModalStyle,
  title,
  cancelStyle,
  confirmStyle,
}) => {
  const {classes} = useStyles()

  const openModal = () =>
    modals.openConfirmModal({
      title: title,
      children: (
        <Text size="sm">
          This action is so important that you are required to confirm it with a
          modal. Please click one of these buttons to proceed.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: confirmStyle,
      cancelProps: cancelStyle,
      onCancel: () => console.log('Cancel'),
      onConfirm: () => console.log('Confirmed'),
    });

  return (
    // <Button
    //   variant="gradient"
    //   gradient={{ from: 'indigo', to: 'cyan' }}
    //   onClick={openModal}
    // >
    //   Indigo cyan
    // </Button>

    <Button
      onClick={openModal}
      className={openModalStyle}
      variant="default"
      uppercase
     
      // styles={theme => ({
      //   root: {
      //     '&:hover': {backgroundColor: 'blue'},
      //   },
      // })}
    >
      Open confirm modal
    </Button>
  );
};
