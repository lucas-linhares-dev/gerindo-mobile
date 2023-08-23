import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { UsuarioActions } from '../actions/UsuarioActions';
import { getUser, storeUser } from '../services/StorageUser';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleLogin = async () => {

    // const res = UsuarioActions.Logar({email: email, senha: senha})
    const res = await UsuarioActions.Logar({email: email, senha: senha})

    if (res.status === 200) {
      const usuarioLogado = await res.json();
      await storeUser(res)
      setSnackbarVisible(true);
      setSnackbarMessage('Seja bem vindo ' + usuarioLogado.nome);
    } else {
      setSnackbarVisible(true);
      setSnackbarMessage('Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Senha"
        secureTextEntry
        value={senha}
        onChangeText={text => setSenha(text)}
        style={styles.input}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.loginButton}
        contentStyle={styles.loginButtonContent}
      >
        Entrar
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
      >
        {snackbarMessage}
      </Snackbar>
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
