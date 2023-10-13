import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';

const DialogMessage = ({ visible, setVisible, onCancel, message, type }) => {
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setVisible(false);
      }, 2200);
    }
  }, [visible]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={{ backgroundColor: type === 'erro' ? 'red' : 'green' }}>
        <Dialog.Content style={styles.dialogContent}>
          <Paragraph style={styles.messageText}>{message}</Paragraph>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialogContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold', // Deixa o texto em negrito

  },
});

export default DialogMessage;
