import React from 'react';
import { AppRegistry } from 'react-native';
import { DefaultTheme, PaperProvider, IconButton } from 'react-native-paper';
import { name as appName } from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Clientes from './src/screens/Clientes'
import Home from './src/screens/Home'
import Login from './src/screens/Login'
import { FormProvider, useForm } from 'react-hook-form';
import CadastroScreen from './src/screens/Cadastro';




// import TelaPrincipal from './src/screens/TelaPrincipal';
// import OutrasTelas from './src/screens/OutrasTelas';


const Drawer = createDrawerNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF',
    primary: '#131313',
    secondary: '#FFD900',
    error: 'red'
  }
}

export default function Main() {

  const methods = useForm();


  return (
    <FormProvider {...methods}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Login">
            <Drawer.Screen name="Clientes" component={Clientes} />
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Login" component={Login} />
            <Drawer.Screen name="Cadastro" component={CadastroScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </FormProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
