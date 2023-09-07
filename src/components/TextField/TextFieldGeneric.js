import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Controller } from 'react-hook-form';


const TextFieldGeneric = ({ control, name, label, rules, defaultValue, type }) => {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field }) => (
          <TextInput
            label={label}
            value={field.value}
            onBlur={field.onBlur}
            onChangeText={(text) => field.onChange(text) }
            style={styles.input}
            secureTextEntry = {type === 'password'}
            // mode='outlined'
          />
        )}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'transparent',
    fontSize: 16,
    paddingHorizontal: 10,
  },
});

export default TextFieldGeneric;
