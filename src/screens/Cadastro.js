import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar, Text } from 'react-native-paper';
import { UsuarioActions } from '../actions/UsuarioActions';
import { storeUser } from '../services/StorageUser';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import TextFieldGeneric from '../components/TextField/TextFieldGeneric';
import ButtonGeneric from '../components/Button/ButtonGeneric';
import DialogMessage from '../components/Dialog/DialogMessage';


const CadastroScreen = () => {

  const { control, handleSubmit, errors, getValues } = useForm();
  const navigation = useNavigation();

  const [dialogMessageError, setDialogMessageError] = useState(false);
  const [dialogMessageSuccess, setDialogMessageSuccess] = useState('');
  const [msgDialog, setMsgDialog] = useState('')

  const onSubmit = async (data) => {

    console.log(data)

    if(data.senha !== data.confirmacaoSenha){
      setDialogMessageError(true);
      setMsgDialog("As senhas não correspondem");
    }
    else{
      const res = await UsuarioActions.Cadastrar(data)

      if (res.status === 200) {
        const usuarioLogado = await res.json();
        await storeUser(res)
        setDialogMessageSuccess(true);
        setMsgDialog('Seja bem vindo ' + usuarioLogado.nome + '!');
      } else {
        setDialogMessageError(true);
        setMsgDialog('Falha ao cadastrar-se');
      }
    }
  };
  

  return (
    <View style={styles.container}>

      <DialogMessage visible={dialogMessageError} setVisible={setDialogMessageError} message={msgDialog} onDismiss={() => setDialogMessageError(false)} type={'erro'} />
      <DialogMessage visible={dialogMessageSuccess} setVisible={setDialogMessageSuccess} message={msgDialog} onDismiss={() => {setDialogMessageSuccess(false) ; navigation.navigate('Login')}} type={'sucesso'} />

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
        marginTop={10}
        backgroundColor={'green'}

      />

      <Text variant="titleMedium" style={{marginVertical: 10, marginHorizontal: 110}}>Já é cadastrado?</Text>

      <ButtonGeneric
        onPress={() => navigation.navigate('Login')}
        title={'Fazer login'}
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
