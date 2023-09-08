import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar, Text } from 'react-native-paper';
import { UsuarioActions } from '../actions/UsuarioActions';
import { storeUser } from '../services/StorageUser';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import TextFieldGeneric from '../components/TextField/TextFieldGeneric';
import SnackbarGeneric from '../components/SnackBar/SnackBarGeneric';
import ButtonGeneric from '../components/Button/ButtonGeneric';
import { useCliente } from '../providers/ClienteProvider';
import { useFormaPag } from '../providers/FormaPagProvider';
import MyDateTimePicker from '../components/DateTimePicker/DateTimePicker';
import AutocompleteGeneric from '../components/AutoComplete/AutoCompleteGeneric';
import SelectGeneric from '../components/Select/SelectGeneric';
import { useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProdutoActions } from '../actions/ProdutoActions';




const Venda = () => {

  const clientes = useCliente()
  const formasPag = useFormaPag()

  const navigation = useNavigation();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarErrorVisible, setSnackbarErrorVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [formaPag, setFormaPag] = useState('');
  const [cliente, setCliente] = useState('');
  const [data, setData] = useState('')
  const [produtos, setProdutos] = useState([])

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);



  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setCameraOpen(!cameraOpen);
    
    const res = await ProdutoActions.GetWithCode(data.toString())
    if(res.status === 200){
      const produto = await res.json()
      console.log(produto.nome)
    } 
    else{
      console.log("PRODUTO NAO ENCONTRADO!")
    }

  };

  const toggleCamera = () => {
    setCameraOpen(!cameraOpen);
    if (!cameraOpen) {
      setScanned(false);
    }
  };

  const onSubmit = async (data) => {
    console.log(formaPag)
    console.log(cliente)
    console.log(data)
    // console.log(produtos)
    // if(data.senha !== data.confirmacaoSenha){
    //   setSnackbarErrorVisible(true);
    //   setSnackbarMessage("As senhas não correspondem");
    // }
    // else{
    //   const res = await UsuarioActions.Cadastrar(data)

    //   if (res.status === 200) {
    //     const usuarioLogado = await res.json();
    //     await storeUser(res)
    //     setSnackbarVisible(true);
    //     setSnackbarMessage('Seja bem vindo ' + usuarioLogado.nome);
    //   } else {
    //     setSnackbarVisible(true);
    //     setSnackbarMessage('Falha ao fazer login');
    //   }
    // }
  };



  return (
    <View style={{flex: 1}}>

      {cameraOpen &&
        <SafeAreaView style={styles.containerCamera}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />            
          <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
            <Button mode="text" style={{ position: 'absolute', bottom: 20, left: 20 }} onPress={() => {
              setCameraOpen(false)
            }}>
              <Text>Fechar</Text>
            </Button>

            {/* <TouchableOpacity style={{ position: 'absolute', bottom: 20, left: 20 }} onPress={() => {
                setTypeCamera(
                  typeCamera === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                )
              }}>
                <Text style={{ fontSize: 20, marginBottom: 12, color: '#fff' }}>Trocar</Text>
              </TouchableOpacity> */}
          </View>
        </SafeAreaView>
      }

      {!cameraOpen &&
        <View style={styles.container}>

          <MyDateTimePicker />

          <AutocompleteGeneric
            label={"Cliente"}
            fieldExtractor={(cliente) => cliente.nome}
            data={clientes.clientes}
            onValueChange={(value) => setCliente(value)}
          />

          <SelectGeneric
            label={"Forma de pagamento"}
            fieldExtractor={(formapag) => formapag.nome}
            data={formasPag.formasPag}
            onValueChange={(value) => setFormaPag(value)}
          />

          <ButtonGeneric
            title={cameraOpen ? 'Fechar câmera' : 'Iniciar scanner'}
            onPress={() => toggleCamera()}
            backgroundColor={'green'}
          />

          <ButtonGeneric
            onPress={() => navigation.navigate('Login')}
            title={'Confirmar venda'}
            backgroundColor={'green'}
          />

          <SnackbarGeneric
            visible={snackbarVisible}
            message={snackbarMessage}
            setVisible={setSnackbarVisible}
            onDismiss={() => navigation.navigate('Home')}
          />
          <SnackbarGeneric
            visible={snackbarErrorVisible}
            message={snackbarMessage}
            setVisible={setSnackbarErrorVisible}
            type={'erro'}
          />
        </View>

      }

    </View >

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    // justifyContent: 'center',
    paddingHorizontal: 20,
  },
  containerCamera: {
    flex: 1,
    justifyContent: 'center'
  },
});

export default Venda;
