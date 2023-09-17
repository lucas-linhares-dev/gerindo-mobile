import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { TextInput, Button, Snackbar, Text, Card } from 'react-native-paper';
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
import Modal from 'react-native-modal';
import Base64Image from '../components/helpers/Base64Image';
import NumberInput from '../components/TextField/NumberInput';
import { AntDesign } from '@expo/vector-icons';



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

  const [produto, setProduto] = useState(null)
  const [quantidade, setQuantidade] = useState(1)


  const [modal, setModal] = useState(false)


  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    const res = await ProdutoActions.GetWithCode(data.toString())
    if (res.status === 200) {
      const produtoEncontrado = await res.json()
      setProduto(produtoEncontrado)
      setModal(true)
      setCameraOpen(false);
    }
    else {
      console.log("PRODUTO NAO ENCONTRADO!")
    }

  };

  const closeModal = () => {
    setModal(false)
  }

  const cancelarProduto = () => {
    closeModal()
    setCameraOpen(true)
    setScanned(false);
    setProduto(null)
    setQuantidade(1)
  }

  const finalizarProdutos = () => {
    const newProduto = {
      produto: produto,
      quantidade: quantidade
    }
    const newProdutos = produtos.concat(newProduto)
    setProdutos(newProdutos)
    closeModal()
  }

  const continuarProdutos = () => {
    const newProduto = {
      produto: produto,
      quantidade: quantidade
    }
    const newProdutos = produtos.concat(newProduto)
    setProdutos(newProdutos)
    cancelarProduto()
  }

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
    <View style={{ flex: 1 }}>

      {cameraOpen &&
        <SafeAreaView style={styles.containerCamera}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
            <Button mode="text" style={{ position: 'absolute', bottom: 20, left: 20 }} onPress={() => {
              cancelarProduto()
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
        <ScrollView style={{ flex: 1 }}>

          <View style={styles.container}>

            <MyDateTimePicker />

            <Card style={styles.cardInformacoes}>
              <View style={{ borderBotto: 'solid 1px yellow' }}>
                <Text style={styles.titleInformacoes}>Informações da venda</Text>
              </View>
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
            </Card>

            <Card style={styles.cardInformacoes}>

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
              <Text style={styles.titleInformacoes}>Produtos</Text>

              {produtos && (
                <FlatList
                  data={produtos}
                  keyExtractor={(produto) => produto?.produto._id}
                  renderItem={({ item }) => (
                    <View style={styles.produtoContainer}>
                      <Base64Image
                        base64ImageData={item?.produto.foto}
                        width={50}
                        height={50}
                      />
                      <Text style={styles.produtoNome}>{item?.produto.nome}</Text>
                      <Text style={styles.produtoQuantidade}>Quantidade: {item?.quantidade}</Text>
                    </View>
                  )}
                />
              )}

              <ButtonGeneric
                marginTop={20}
                title={'Scannear'}
                onPress={() => cancelarProduto()}
                backgroundColor={'blue'}
                icon={<AntDesign name="camera" size={24} color="white" />} // Passe o ícone como um componente
              />
            </Card>



            <ButtonGeneric
              onPress={() => navigation.navigate('Login')}
              title={'Confirmar venda'}
              backgroundColor={'green'}
            />
          </View>
        </ScrollView>

      }

      <Modal
        isVisible={modal}
        onBackdropPress={closeModal}
      >
        <View style={styles.modalContainer}>
          <View>
            <Card>
              <Card.Content style={styles.cardContent}>
                <Base64Image base64ImageData={produto?.foto} width={250} height={200} />
                <Text style={styles.title}>{produto?.nome}</Text>

              </Card.Content>
            </Card>
          </View>
        </View>
        <View style={styles.inputQuantidade}>
          {/* <TextInput
            label="Quantidade"
            type="number"
            value={quantidade} // Certifique-se de que 'quantidade' seja um estado
            onChangeText={(text) => setQuantidade(text)} // Atualize o estado da quantidade
            keyboardType="numeric" // Teclado numérico para entrada
            style={{ width: 115, height: 80, textAlign: 'center' }}
          /> */}
          <NumberInput
            label="Quantidade"
            value={quantidade}
            onChangeText={(newValue) => setQuantidade(newValue)}
            style={{ width: 115, height: 80, textAlign: 'center' }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <ButtonGeneric onPress={cancelarProduto} title={"Cancelar"} backgroundColor={'red'} />
          <ButtonGeneric onPress={finalizarProdutos} title={"Finalizar"} />
          <ButtonGeneric onPress={continuarProdutos} title={"Continuar"} backgroundColor={'green'} />
        </View>
      </Modal>


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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  cardContent: {
    alignItems: 'center',
    // backgroundColor: 'blue',
    borderRadius: 5,
    width: 270,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  title: {
    fontSize: 24,
    marginTop: 20, // Espaço entre o título e a imagem
  },

  actions: {
    justifyContent: 'center',
  },
  inputQuantidade: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Espaço entre o campo de entrada e o botão
    borderRadius: 20,

  },
  buttonContainer: {
    flexDirection: 'row', // Define o layout como uma linha horizontal
    justifyContent: 'space-between', // Distribui os botões uniformemente no espaço disponível
    marginTop: 20, // Define a margem superior conforme necessário
  },
  produtoContainer: {
    flexDirection: 'row', // Para alinhar os elementos horizontalmente
    alignItems: 'center', // Para alinhar os elementos verticalmente ao centro
    marginBottom: 20, // Espaçamento inferior entre os produtos
  },
  produtoNome: {
    marginLeft: 10, // Espaçamento à esquerda do nome do produto
    fontSize: 16, // Tamanho da fonte do nome do produto
  },
  produtoQuantidade: {
    marginLeft: 10, // Espaçamento à esquerda da quantidade do produto
    fontSize: 14, // Tamanho da fonte da quantidade do produto
    color: 'gray', // Cor do texto da quantidade
  },
  cardInformacoes: {
    padding: 20,
    backgroundColor: '#98FB98',
    marginBottom: 20
  },
  titleInformacoes: {
    marginBottom: 20,
    fontSize: 20,
  }
});

export default Venda;
