import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar, Text } from 'react-native-paper';
import { UsuarioActions } from '../actions/UsuarioActions';
import { storeUser } from '../services/StorageUser';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import TextFieldGeneric from '../components/TextField/TextFieldGeneric';
import SnackbarGeneric from '../components/SnackBar/SnackBarGeneric';
import ButtonGeneric from '../components/Button/ButtonGeneric';
import { useAuth } from '../providers/AuthProvider';
import AutocompleteGeneric from '../components/AutoComplete/AutoCompleteGeneric';
import { useCliente } from '../providers/ClienteProvider';
import SelectGeneric from '../components/Select/SelectGeneric';
import { useFormaPag } from '../providers/FormaPagProvider';
import MyDateTimePicker from '../components/DateTimePicker/DateTimePicker';



const LoginScreen = () => {

  const authContext = useAuth()

  const { control, handleSubmit, errors } = useForm();
  const navigation = useNavigation();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');


  const onSubmit = async (data) => {

    const res = await authContext.login(data);

    if (res !== 'ERRO') {
      const usuarioLogado = res
      await storeUser(usuarioLogado)
      setSnackbarVisible(true);
      setSnackbarMessage('Seja bem vindo ' + usuarioLogado.nome);
    } else {
      setSnackbarVisible(true);
      setSnackbarMessage('Falha ao fazer login');
    }
  };

  return (
    <View style={styles.container}>
      
      <TextFieldGeneric
        control={control}
        name="email"
        label="Email"
        rules={{ required: 'Campo obrigatório' }}
        defaultValue=""
      />
      <TextFieldGeneric
        control={control}
        type={'password'}
        name="senha"
        label="Senha"
        rules={{ required: 'Campo obrigatório' }}
        defaultValue=""
      />

      <ButtonGeneric
        onPress={handleSubmit(onSubmit)}
        title={'Entrar'}
      />

      <Text variant="titleMedium" style={{ marginVertical: 10, marginHorizontal: 108 }}>Não tem cadastro?</Text>

      <ButtonGeneric
        onPress={() => navigation.navigate('Cadastro')}
        title={'Cadastrar-se'}
        backgroundColor={'green'}
      />
      <SnackbarGeneric
        visible={snackbarVisible}
        message={snackbarMessage}
        type={'erro'}
        setVisible={setSnackbarVisible}
        onDismiss={() => {

        }}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#FFD900',
  },
  loginButtonContent: {
    height: 50,
  },
});

export default LoginScreen;
