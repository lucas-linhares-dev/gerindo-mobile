import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { decimalDigitsMask } from '../../helpers/decimalDigitsMask';

const DecimalInput = (label, value, setValue) => {

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={(text) => {
        setValue(decimalDigitsMask(text, 2))
      }}
      keyboardType="numeric"
    />
  );
};

export default DecimalInput;
