import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import ButtonGeneric from '../Button/ButtonGeneric';

const DialogConfirm = ({ visible, onConfirm, onCancel, message, type }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={{backgroundColor: 'white'}}>
        <Dialog.Content>
          <Paragraph style={styles.messageText}>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <View style={styles.buttonContainer}>
            <ButtonGeneric onPress={onCancel} title={"Cancelar"} backgroundColor={'red'} marginRight={10} />
            <ButtonGeneric onPress={onConfirm} title={"Confirmar"} backgroundColor={'green'} marginRight={30} />
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  messageText: {
    fontSize: 20, // Ajuste o tamanho da fonte conforme desejado
    fontWeight: 'bold', // Deixa o texto em negrito
    textAlign: 'center', // Centraliza o texto
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default DialogConfirm;
