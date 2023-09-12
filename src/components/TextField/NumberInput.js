import React from 'react';
import { TextInput } from 'react-native-paper';

const NumberInput = ({ label, value, onChangeText }) => {
  return (
    <TextInput
      label={label}
      value={value.toString()}
      onChangeText={(text) => {
        const numericValue = parseFloat(text.replace(/\s/g, ''));
        if (!isNaN(numericValue)) {
          onChangeText(numericValue);
        }
      }}
      keyboardType="numeric"
    />
  );
};

export default NumberInput;
