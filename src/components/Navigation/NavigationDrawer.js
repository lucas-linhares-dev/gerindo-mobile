import React from 'react';
import { Drawer } from 'react-native-paper';
import Home from '../../screens/Home';
import Clientes from '../../screens/Clientes';

export default function NavigationDrawer() {
    return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Clientes" component={Clientes} />
      </Drawer.Navigator>
    );
  }