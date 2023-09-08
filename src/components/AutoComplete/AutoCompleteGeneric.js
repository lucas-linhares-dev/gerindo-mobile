import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { TextInput, List, IconButton, Button } from 'react-native-paper';

const AutocompleteGeneric = ({ label, data, fieldExtractor }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Função para aplicar a máscara de CPF
  const applyCpfMask = (text) => {
    const onlyNumbers = text.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (/^\d+$/.test(onlyNumbers)) { // Verifica se a string contém apenas números
      let maskedCpf = onlyNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // Aplica a máscara de CPF
      return maskedCpf;
    }
    return text; // Se não for um número, retorna o texto original
  };

  const handleInputChange = (text) => {
    setQuery(text);
  };

  // Função para lidar com a pesquisa após um atraso
  useEffect(() => {
    const delay = setTimeout(() => {
      // Aplica a máscara de CPF ao texto digitado
      const maskedQuery = applyCpfMask(query);
      let filteredData = [];

      // Verifica se o texto se parece com um CPF
      if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(maskedQuery)) {
        filteredData = data.filter((item) =>
          item.cpf.includes(maskedQuery)
        );
      } else {
        filteredData = data.filter((item) =>
          fieldExtractor(item).toLowerCase().includes(maskedQuery.toLowerCase())
        );
      }

      setSuggestions(filteredData);
    }, 500); // Atraso de 500ms antes de acionar a pesquisa

    return () => clearTimeout(delay);
  }, [query]);

  const handleItemSelect = (item) => {
    setQuery(fieldExtractor(item));
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
          onChangeText={handleInputChange}
          style={styles.input}
        />
        <Button mode="contained" onPress={openModal} style={styles.searchButton}>
          Buscar
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
            {suggestions.map((item) => (
              <List.Item
                key={item._id}
                title={`${fieldExtractor(item)} - ${item.cpf}`}
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
    backgroundColor: 'white',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: 'blue'
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

export default AutocompleteGeneric;
