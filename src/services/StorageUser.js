import AsyncStorage from '@react-native-async-storage/async-storage';


// Para armazenar as informações do usuário
export const storeUser = async (usuario) => {
  try {
    await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
  } catch (error) {
    console.error('Erro ao armazenar informações do usuário:', error);
  }
};

// Para recuperar as informações do usuário
export const getUser = async () => {
  try {
    const usuario = await AsyncStorage.getItem('usuario');
    return JSON.parse(usuario);
  } catch (error) {
    console.error('Erro ao recuperar informações do usuário:', error);
  }
};