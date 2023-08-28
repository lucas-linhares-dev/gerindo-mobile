import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';

const SnackbarGeneric = ({ message, duration = 2000, onDismiss, visible, setVisible, type }) => {

  const styles = StyleSheet.create({
    snackbar: {
      backgroundColor: type === 'erro' ? 'red' : '#2196F3',
      borderRadius: 8,
      // width: '100%'
    },
    snackbarText: {
      color: 'white', // Cor do texto
      fontSize: 16,
    },
  });

  const hideSnackbar = () => {
    setVisible(false);
    onDismiss && onDismiss();
  };

  return (
    <Snackbar
      visible={visible}
      onDismiss={hideSnackbar}
      duration={duration}
      style={styles.snackbar}
    >
      <Text style={styles.snackbarText}>{message}</Text>
    </Snackbar>

  );

};



export default SnackbarGeneric;
