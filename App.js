import React from 'react';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { AuthProvider } from './src/providers/AuthProvider'; // Importe o contexto de autenticação
import Main from './Main';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF',
    primary: '#131313',
    secondary: '#FFD900',
    error: 'red',
  },
};

export default function App() {
  const methods = useForm();

  return (
    <AuthProvider>
      <FormProvider {...methods}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Main />
          </NavigationContainer>
        </PaperProvider>
      </FormProvider>
    </AuthProvider>
  );
}

// Não inclua o AppRegistry.registerComponent neste arquivo, pois ele não é mais necessário.
