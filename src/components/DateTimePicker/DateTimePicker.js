import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from 'react-native-paper';

const MyDateTimePicker = ({ date, setDate, buttonText, disablePadding, invertido }) => {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  return (
    <View style={disablePadding ? { flexDirection: 'column', alignItems: 'center', } : styles.container}>
      {
        !invertido ?
          <View style={styles.rowContainer}>
            <Button
              onPress={() => setShow(true)}
              style={styles.button}
              mode='elevated'
            >
              {buttonText ?

                <Text style={styles.buttonText}>{buttonText}</Text>

                :

                <Text style={styles.buttonText}>Editar Data</Text>
              }
            </Button>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {format(date, 'dd/MM/yyyy', { locale: ptBR })}
              </Text>
            </View>
          </View>
          :
          <View style={styles.rowContainer}>

            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {format(date, 'dd/MM/yyyy', { locale: ptBR })}
              </Text>
            </View>
            <Button
              onPress={() => setShow(true)}
              style={{    borderRadius: 5, marginLeft: 18
              }}
              mode='elevated'
            >
              {buttonText ?

                <Text style={styles.buttonText}>{buttonText}</Text>

                :

                <Text style={styles.buttonText}>Editar Data</Text>
              }
            </Button>
          </View>
      }

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
    marginBottom: 50,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderRadius: 5,
    marginRight: 8
  },
  buttonText: {
    color: 'green',
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
