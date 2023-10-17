import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Snackbar, Text } from 'react-native-paper';

const SnackbarGeneric = ({ message, onDismiss, visible, setVisible, type, position }) => {

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      left: 10,
      right: 20,
      bottom: position === 'bottom' ? 0 : undefined, // Define a posição inferior se position for 'bottom'
      top: position === 'top' ? 50 : undefined, // Define a posição superior se position for 'top'
    },
    snackbar: {
      backgroundColor: type === 'erro' ? 'red' : '#2196F3',
      borderRadius: 8,
      width: '100%',
    },
    snackbarText: {
      color: 'white',
      fontSize: 16,
    },
  });

  const hideSnackbar = () => {
    setVisible(false);
    onDismiss && onDismiss();
  };

  return (
    <View style={styles.container}>
        <Snackbar
          visible={visible}
          onDismiss={hideSnackbar}
          duration={2000}
          style={styles.snackbar}
        >
          <Text style={styles.snackbarText}>{message}</Text>
        </Snackbar>
    </View>
  );
};

export default SnackbarGeneric;
