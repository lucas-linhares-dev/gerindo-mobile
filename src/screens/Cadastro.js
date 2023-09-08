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


const CadastroScreen = () => {

  const { control, handleSubmit, errors, getValues } = useForm();
  const navigation = useNavigation();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarErrorVisible, setSnackbarErrorVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const onSubmit = async (data) => {

    if(data.senha !== data.confirmacaoSenha){
      setSnackbarErrorVisible(true);
      setSnackbarMessage("As senhas não correspondem");
    }
    else{
      const res = await UsuarioActions.Cadastrar(data)

      if (res.status === 200) {
        const usuarioLogado = await res.json();
        await storeUser(res)
        setSnackbarVisible(true);
        setSnackbarMessage('Seja bem vindo ' + usuarioLogado.nome);
      } else {
        setSnackbarVisible(true);
        setSnackbarMessage('Falha ao fazer login');
      }
    }
  };

  return (
    <View style={styles.container}>
      <SnackbarGeneric
        visible={snackbarErrorVisible}
        message={snackbarMessage}
        setVisible={setSnackbarErrorVisible}
        type={'erro'}
      />
      <TextFieldGeneric
        control={control}
        name="nome" 
        label="Nome"
        rules={{ required: 'Campo obrigatório' }} 
        defaultValue="" 
      />
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
      <TextFieldGeneric
        control={control}
        type={'password'}
        name="confirmacaoSenha" 
        label="Confirmação de senha"
        rules={{ required: 'Campo obrigatório' }} 
        defaultValue="" 
      />
      <ButtonGeneric
        onPress={handleSubmit(onSubmit)}
        title={'Cadastrar-se'}
      />

      <Text variant="titleMedium" style={{marginVertical: 10, marginHorizontal: 110}}>Já é cadastrado?</Text>

      <ButtonGeneric
        onPress={() => navigation.navigate('Login')}
        title={'Fazer login'}
        backgroundColor={'green'}
      />
      <SnackbarGeneric
        visible={snackbarVisible}
        message={snackbarMessage}
        setVisible={setSnackbarVisible}
        onDismiss={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFF'
  },
});

export default CadastroScreen;
