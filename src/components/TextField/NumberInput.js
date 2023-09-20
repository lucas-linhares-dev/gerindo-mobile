import React from 'react';
import { TextInput } from 'react-native-paper';

const NumberInput = ({ label, value, onChangeText, setValue }) => {
  return (
    <TextInput
      label={label}
      value={value.toString()}
      onChangeText={onChangeText}
      keyboardType="numeric"
      style={{ height: 45}} // Defina a altura e a largura desejadas
      editable
    />
  );
};

export default NumberInput;
