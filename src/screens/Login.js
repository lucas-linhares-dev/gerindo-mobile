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
import DialogMessage from '../components/Dialog/DialogMessage';



const LoginScreen = () => {

  const authContext = useAuth()

  const { control, handleSubmit, errors } = useForm();
  const navigation = useNavigation();

  const [dialogMessageError, setDialogMessageError] = useState(false);
  const [dialogMessageSuccess, setDialogMessageSuccess] = useState('');
  const [msgDialog, setMsgDialog] = useState('')


  const onSubmit = async (data) => {

    const res = await authContext.login(data);

    if (res !== 'ERRO') {
      const usuarioLogado = res
      await storeUser(usuarioLogado)
      setDialogMessageSuccess(true);
      setMsgDialog('Seja bem vindo novamente ' + usuarioLogado.nome + '!');
    } else {
      setDialogMessageError(true);
      setMsgDialog('Falha ao fazer login');
    }
  };

  return (
    <View style={styles.container}>

      <DialogMessage visible={dialogMessageError} setVisible={setDialogMessageError} message={msgDialog} onDismiss={() => setDialogMessageError(false)} type={'erro'} />
      <DialogMessage visible={dialogMessageSuccess} setVisible={setDialogMessageSuccess} message={msgDialog} onDismiss={() => {setDialogMessageSuccess(false) ; navigation.navigate('Home')}} type={'sucesso'} />
      
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
        marginTop={10}
        backgroundColor={'green'}

      />

      <Text variant="titleMedium" style={{ marginVertical: 10, marginHorizontal: 108 }}>Não tem cadastro?</Text>

      <ButtonGeneric
        onPress={() => navigation.navigate('Cadastro')}
        title={'Cadastrar-se'}
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
