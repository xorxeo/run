import { FC } from 'react';
import { Button, Modal, ModalProps, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

type ConfirmationDialogProps = {
  opened: boolean;
  open?: () => void;
  close: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  message: string;
  cancelButtonTitle: string;
  submitButtonTitle: string;
};

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  close,
  open,
  opened,
  message,
  cancelButtonTitle,
  submitButtonTitle,
  onCancel,
  onSubmit,
}) => {
    // const [{close}] = useDisclosure(false);

  return (
    <Modal opened={opened} onClose={close}>
      <Text>{message}</Text>
      <Button onClick={onCancel}>{cancelButtonTitle}</Button>
      <Button type="submit" onClick={onSubmit}>{submitButtonTitle}</Button>
    </Modal>
  );
};
