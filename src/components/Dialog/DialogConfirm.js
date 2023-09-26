import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';

const DialogConfirm = ({ visible, onConfirm, onCancel, message }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>Confirmação</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>Cancelar</Button>
          <Button onPress={onConfirm}>Confirmar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogConfirm;

