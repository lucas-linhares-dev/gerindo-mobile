import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback, Text } from 'react-native';
import { TextInput, List, IconButton, Button } from 'react-native-paper';

const SelectGeneric = ({ label, data, fieldExtractor, query, setQuery, setId }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleItemSelect = (item) => {
    setQuery(fieldExtractor(item));
    setId(item._id)
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label={label}
          value={query}
          disabled
          mode='outlined'
          onChangeText={() => {}}
          style={styles.input}
        />
        <Button mode="elevated" onPress={openModal} style={styles.searchButton}>
          <Text style={{color: 'green'}}>Buscar</Text>
        </Button>
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <ScrollView>
            {data.map((item) => (
              <List.Item
                key={item._id}
                title={`${fieldExtractor(item)}`}
                onPress={() => handleItemSelect(item)}
                style={styles.item}
                titleStyle={styles.itemText}
                left={(props) => (
                  <IconButton icon="minus" onPress={() => handleItemSelect(item)} />
                )}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    // backgroundColor: 'white',
  },
  searchButton: {
    marginLeft: 10,
    // backgroundColor: 'green'
    color: 'green',
    borderRadius: 5
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  itemText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    marginTop: 'auto',
    backgroundColor: 'white',
  },
});

export default SelectGeneric;
