import React from 'react';
import { Drawer } from 'react-native-paper';
import Home from '../../screens/Home';
import Clientes from '../../screens/Clientes';

export default function NavigationDrawer() {
  const [active, setActive] = React.useState('');

  return (
    <Drawer.Section title="Some title">
      <Drawer.Item
        label="First Item"
        active={active === 'first'}
        onPress={() => setActive('first')}
      />
      <Drawer.Item
        label="Second Item"
        active={active === 'second'}
        onPress={() => setActive('second')}
      />
    </Drawer.Section>
  );
  }