import * as React from 'react';
import { AppRegistry } from 'react-native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import NavigationDrawer from './src/components/Navigation/NavigationDrawer';
import { NavigationContainer } from '@react-navigation/native';
import Clientes from './src/screens/Clientes';


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
  return (
    <PaperProvider theme={theme}>
      <Clientes/>
      {/* <NavigationContainer>
        <NavigationDrawer />
      </NavigationContainer> */}
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);