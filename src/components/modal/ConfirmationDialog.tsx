import { FC } from 'react';
import { Button, Modal, Text, useMantineTheme } from '@mantine/core';

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
  
  const theme = useMantineTheme();

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="lg"
      centered={true}
      overlayProps={{
        color:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Text>{message}</Text>
      <Button onClick={onCancel}>{cancelButtonTitle}</Button>
      <Button type="submit" onClick={onSubmit}>
        {submitButtonTitle}
      </Button>
    </Modal>
  );
};
