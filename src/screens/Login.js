import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleLogin = async () => {

    const res = await fetch("http://192.168.1.69:3001/auth/usuarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          senha: senha
        }),
      });

    // console.log(res)

    if (res.status === 200) {
      setSnackbarVisible(true);
      setSnackbarMessage('Login successful');
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
