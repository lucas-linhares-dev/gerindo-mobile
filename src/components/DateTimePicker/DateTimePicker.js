import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MyDateTimePicker = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <TouchableOpacity
          onPress={() => setShow(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Editar Data</Text>
        </TouchableOpacity>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {format(date, 'dd/MM/yyyy', { locale: ptBR })}
          </Text>
        </View>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
          locale="pt-BR"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 8,
    marginRight: 8
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 8,
    paddingEnd: 18,
    borderRadius: 8,
    height: 45
  },
  dateText: {
    marginLeft: 8,
  },
});

export default MyDateTimePicker;
