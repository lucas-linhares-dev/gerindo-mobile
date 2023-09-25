import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Clientes from './src/screens/Clientes';
import Home from './src/screens/Home';
import CadastroScreen from './src/screens/Cadastro';
import { useAuth } from './src/providers/AuthProvider';
import LoginScreen from './src/screens/Login';
import Venda from './src/screens/Venda';

const Drawer = createDrawerNavigator();

export default function Main() {
    const authContext = useAuth();

    const [authenticated, setAuthenticated] = React.useState(authContext.isAuthenticated);

    useEffect(() => {
        setAuthenticated(authContext?.isAuthenticated);
        console.log("MAIN")
    }, [authContext.isAuthenticated]);

    // async function Logout() {
    //     await authContext.logout()
    // }

    return (
        <>
            {true ? (
                <Drawer.Navigator initialRouteName="Home"
                screenOptions={{
                    drawerStyle: {
                      backgroundColor: 'green',
                      width: 240,
                    },
                  }}
                >
                    <Drawer.Screen name="Clientes" component={Clientes}  />
                    <Drawer.Screen name="Home" component={Home} />
                    <Drawer.Screen name="Venda" component={Venda}
                    options={{
                        title: 'Clientes', // Define o título da tela
                        headerStyle: {
                            backgroundColor: 'green', // Define a cor de fundo do cabeçalho
                        },
                        headerTintColor: 'white', // Define a cor do texto do cabeçalho
                    }}
                    />

                    {/* <Drawer.Screen
                        name="Logout"
                        component={LoginScreen}
                        options={{
                            drawerLabel: 'Logout',
                            drawerIcon: ({ color, size }) => (
                                <IconButton
                                    icon="logout"
                                    color={color}
                                    size={size}
                                    onPress={() => Logout()} // Remova os parênteses aqui
                                />
                            ),
                        }}
                    /> */}
                </Drawer.Navigator>
            ) : (
                <Drawer.Navigator initialRouteName="Login">
                    <Drawer.Screen name="Login" component={LoginScreen} />
                    <Drawer.Screen name="Cadastro" component={CadastroScreen} />
                </Drawer.Navigator>
            )}
        </>
    );
}

