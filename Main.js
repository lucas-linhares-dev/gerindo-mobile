import React, { useEffect } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import Clientes from './src/screens/Clientes';
import Home from './src/screens/Home';
import CadastroScreen from './src/screens/Cadastro';
import { useAuth } from './src/providers/AuthProvider';
import LoginScreen from './src/screens/Login';
import Venda from './src/screens/Venda';
import { NavigationContainer } from '@react-navigation/native';
import { getUser, storeUser } from './src/services/StorageUser';
import Base64Image from './src/components/helpers/Base64Image';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Importe o ícone do pacote que você está usando
import VendaHistorico from './src/screens/VendaHistorico';


const Drawer = createDrawerNavigator();

export default function Main() {

    const authContext = useAuth();

    const [usuario, setUsuario] = useState()
    const [authenticated, setAuthenticated] = useState();

    const CustomHeader = () => {
        return (
            <View style={styles.customHeaderContainer}>
                <View style={styles.avatarContainer}>
                    <Base64Image base64ImageData={usuario?.foto} height={100} width={100} redonda />
                    <Text style={styles.username}>{usuario?.nome}</Text>
                    <Text style={{ marginBottom: 20, color: '#DCDCDC' }}>{usuario?.cargo}</Text>
                </View>
            </View>
        );
    };

    const CustomDrawerContent = (props) => {
        return (
            <DrawerContentScrollView {...props}>

                {true ?
                    <View>
                        <CustomHeader />
                        <DrawerItem
                            labelStyle={styles.drawerLabelStyle}
                            style={styles.drawerItem}
                            label="Home"
                            onPress={() => props.navigation.navigate('Home')}
                            icon={() => (
                                <Ionicons name={"home-outline"} size={22} color="#ffff" />
                            )}
                            pressColor='#949994'

                        />
                        <DrawerItem
                            labelStyle={styles.drawerLabelStyle}
                            label="Venda"
                            onPress={() => props.navigation.navigate('Venda')}
                            style={styles.drawerItem}
                            icon={() => (
                                <Ionicons name={"send-outline"} size={22} color="#ffff" />
                            )}
                            pressColor='#949994'

                        />
                        <DrawerItem
                            labelStyle={styles.drawerLabelStyle}
                            label="Histórico"
                            onPress={() => props.navigation.navigate('VendaHistorico')}
                            style={styles.drawerItem}
                            icon={() => (
                                <Ionicons name={"send-outline"} size={22} color="#ffff" />
                            )}
                            pressColor='#949994'

                        />
                        <DrawerItem
                            labelStyle={styles.drawerLabelStyle}
                            label="Clientes"
                            onPress={() => props.navigation.navigate('Clientes')}
                            style={styles.drawerItem}
                            icon={() => (
                                <Ionicons name={"people-outline"} size={22} color="#ffff" /> // Ícone personalizado
                            )}
                            pressColor='#949994'
                        // activeBackgroundColor='red'
                        />
                        <DrawerItem
                            labelStyle={styles.drawerLabelStyleLogout}
                            label="Logout"
                            onPress={async () => await authContext.logout()}
                            style={styles.drawerItemLogout}
                            icon={() => (
                                <Ionicons name={"log-out-outline"} size={24} color="red" /> // Ícone personalizado
                            )}
                        />
                    </View>
                    :
                    <View>

                        <DrawerItem
                            labelStyle={styles.drawerLabelStyle}
                            label="Login"
                            onPress={() => props.navigation.navigate('Login')}
                            style={styles.drawerItem}
                        />
                        <DrawerItem
                            labelStyle={styles.drawerLabelStyle}
                            label="Cadastro"
                            onPress={() => props.navigation.navigate('Cadastro')}
                            style={styles.drawerItem}
                        />
                    </View>
                }
            </DrawerContentScrollView>
        );
    };

    useEffect(() => {
        setAuthenticated(authContext?.isAuthenticated);
        setUsuario(authContext?.usuario)
        console.log("MAIN")
    }, [authContext.isAuthenticated]);

    return (
        <NavigationContainer>

            {true ? (
                <Drawer.Navigator
                    initialRouteName="Home"
                    drawerContent={props => <CustomDrawerContent {...props} />}
                    screenOptions={{
                        drawerStyle: {
                            backgroundColor: 'green',
                            width: 200,
                            marginTop: 85,
                        },

                        // Personalize o estilo do cabeçalho da tela
                        headerStyle: {
                            backgroundColor: 'green',
                        },
                        headerTintColor: 'white',

                    }}
                >
                    <Drawer.Screen
                        name="Clientes"
                        component={Clientes}
                        options={{
                            title: 'Cliente',
                            unmountOnBlur: true, // Esta opção fará com que a tela seja redefinida quando você voltar para ela

                        }}
                    />
                    <Drawer.Screen
                        name="Home"
                        component={Home}
                        options={{
                            title: 'Home',
                            unmountOnBlur: true, // Esta opção fará com que a tela seja redefinida quando você voltar para ela

                        }}
                    />
                    <Drawer.Screen
                        name="Venda"
                        component={Venda}
                        options={{
                            title: 'Venda',
                            unmountOnBlur: true, // Esta opção fará com que a tela seja redefinida quando você voltar para ela

                        }}
                    />
                    <Drawer.Screen
                        name="VendaHistorico"
                        component={VendaHistorico}
                        options={{
                            title: 'Histórico',
                            unmountOnBlur: true, // Esta opção fará com que a tela seja redefinida quando você voltar para ela

                        }}
                    />
                    <Drawer.Screen name="Login" component={LoginScreen} />
                    <Drawer.Screen name="Cadastro" component={CadastroScreen} />
                </Drawer.Navigator>
            ) : (
                <Drawer.Navigator initialRouteName="Login">
                    <Drawer.Screen name="Login" component={LoginScreen} />
                </Drawer.Navigator>
            )}

        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    customHeaderContainer: {
        backgroundColor: 'green',
        alignItems: 'center',
        borderBottomWidth: 1,      // Largura da borda inferior
        borderBottomColor: 'white',
        marginBottom: 30,
    },
    avatarContainer: {
        alignItems: 'center',
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    drawerLabelStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#DCDCDC',
        marginLeft: -16
    },
    drawerLabelStyleLogout: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
        marginLeft: -16,
    },
    drawerItem: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
    },
    drawerItemLogout: {
        marginTop: 230
    }
});
