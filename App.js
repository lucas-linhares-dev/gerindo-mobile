import React from 'react';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { AuthProvider } from './src/providers/AuthProvider'; // Importe o contexto de autenticação
import Main from './Main';
import { ClienteProvider } from './src/providers/ClienteProvider';
import { FormaPagProvider } from './src/providers/FormaPagProvider';

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
    <FormaPagProvider>
      <ClienteProvider>
        <AuthProvider>
          <FormProvider {...methods}>
            <PaperProvider theme={theme}>
                <Main />
            </PaperProvider>
          </FormProvider>
        </AuthProvider>
      </ClienteProvider>
    </FormaPagProvider>
  );
}
