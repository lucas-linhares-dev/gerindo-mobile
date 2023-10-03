import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
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
import { decimalDigitsMask } from '../helpers/decimalDigitsMask';
import Icon from 'react-native-vector-icons/FontAwesome';
import { VendaActions } from '../actions/VendaActions';
import DialogConfirm from '../components/Dialog/DialogConfirm';
import DialogMessage from '../components/Dialog/DialogMessage';



const Venda = () => {

  const clientes = useCliente()
  const formasPag = useFormaPag()

  const navigation = useNavigation();

  const [formaPag, setFormaPag] = useState('');
  const [cliente, setCliente] = useState('');
  const [data, setData] = useState(new Date())
  const [produtos, setProdutos] = useState([])
  const [valorTotal, setValorTotal] = useState('0,00')

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const [produto, setProduto] = useState(null)
  const [quantidade, setQuantidade] = useState(1)

  const [quantidadesFinais, setQuantidadesFinais] = useState([])

  const [dialogConfirm, setDialogConfirm] = useState(false)
  const [dialogMessageError, setDialogMessageError] = useState(false)
  const [msgDialog, setMsgDialog] = useState()
  const [dialogMessageSuccess, setDialogMessageSuccess] = useState(false)

  const [modalProduto, setModalProduto] = useState(false)

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
      setModalProduto(true)
      setCameraOpen(false);
    }
    else {
      console.log("PRODUTO NAO ENCONTRADO!")
    }

  };

  const closeModalProduto = () => {
    setModalProduto(false)
  }

  const cancelarProduto = () => {
    closeModalProduto()
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

    const produtoJaExiste = produtos.some((item) => item.produto._id === newProduto.produto._id);

    if (!produtoJaExiste) {
      setProdutos([...produtos, newProduto]);
      setQuantidadesFinais([...quantidadesFinais, quantidade]);
      closeModalProduto();
    }
    else {
      setDialogMessageError(true);
      setMsgDialog("Esse produto já foi inserido na venda");
    }
  }


  const continuarProdutos = () => {
    const newProduto = {
      produto: produto,
      quantidade: quantidade
    }

    const produtoJaExiste = produtos.some((item) => item.produto._id === newProduto.produto._id);

    if (!produtoJaExiste) {
      setProdutos([...produtos, newProduto]);
      setQuantidadesFinais([...quantidadesFinais, quantidade]);
      cancelarProduto()
    }
    else {
      setDialogMessageError(true);
      setMsgDialog("Esse produto já foi inserido na venda");
    }
  }

  const onSubmit = async () => {
    console.log("SUBMIT")
    console.log(cliente)
    if (!cliente) {
      console.log("ERRO cliente")

      setDialogMessageError(true);
      setMsgDialog("Selecione o cliente da venda!");
      return
    }
    if (!formaPag) {
      console.log("ERRO FORMAPAG")

      setDialogMessageError(true);
      setMsgDialog("Selecione a forma de pagamento da venda!");
      return
    }
    if (produtos.length === 0) {
      console.log("ERRO PRODUTOS")
      setDialogMessageError(true);
      setMsgDialog("Insira o(s) produto(s) da venda!");
      return
    }

    let produtosFinal = []

    produtos.map((produto, index) => {
      const newProduto = {
        cod_ref: produto.produto._id,
        nome: produto.produto.nome,
        quantidade: parseInt(quantidadesFinais[index])
      }
      if (newProduto.quantidade > produto.produto.estoque) {
        setDialogMessageError(true)
        setMsgDialog(`o estoque de ${newProduto.nome} é de apenas ${produto.produto.estoque}`);
        return
      }
      else {
        produtosFinal.push(newProduto)
      }
    })

    if (produtosFinal.length === quantidadesFinais.length) {
      const objVendaInsert = {
        data: data,
        cliente: cliente,
        forma_pag: formaPag,
        produtos: produtosFinal,
        vlr_total: valorTotal
      }

      const res = await VendaActions.Insert(objVendaInsert)

      console.log(res)

      if (res.status === 200) {
        setDialogMessageSuccess(true)
        setMsgDialog("Venda realizada com sucesso!")
        setFormaPag('')
        setCliente('')
        setProdutos([])
        setQuantidadesFinais([])
      }
      else {
        setDialogMessageError(true)
        setMsgDialog("DEU RUIM INSERIR A VENDA")
      }
    }
  };

  useEffect(() => {
    let vlrTotalVenda = 0
    produtos.forEach((produto, index) => {
      let preco_venda_format = produto.produto.preco_venda.slice(0, produto.produto.preco_venda.length - 3);
      preco_venda_format = parseFloat(preco_venda_format)
      let vlrTotalProduto = preco_venda_format * quantidadesFinais[index]
      vlrTotalVenda += vlrTotalProduto
    });
    console.log(vlrTotalVenda)
    setValorTotal(decimalDigitsMask((vlrTotalVenda * 100).toString(), 2))
  }, [produtos, quantidadesFinais])


  const handleConfirm = () => {
    onSubmit()
    setDialogConfirm(false);
  };

  const handleCancel = () => {
    setDialogConfirm(false);
  };

  return (
    <View style={{ flex: 1 }}>

      <DialogConfirm
        visible={dialogConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={msgDialog}
      />

      <DialogMessage visible={dialogMessageError} setVisible={setDialogMessageError} message={msgDialog} onDismiss={() => setDialogMessageError(false)} type={'erro'}/>

      <DialogMessage visible={dialogMessageSuccess} setVisible={setDialogMessageSuccess} message={msgDialog} onDismiss={() => setDialogMessageSuccess(false)} type={'sucesso'}/>

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
          </View>
        </SafeAreaView>
      }

      {!cameraOpen &&
        <ScrollView style={{ flex: 1 }}>

          <View style={styles.container}>

            <MyDateTimePicker date={data} setDate={setData} />

            <Card style={styles.cardInformacoes}>
              <View style={{ borderBotto: 'solid 1px yellow' }}>
                <Text style={styles.titleInformacoes}>Informações da venda</Text>
              </View>
              <AutocompleteGeneric
                label={"Cliente"}
                fieldExtractor={(cliente) => cliente.nome}
                data={clientes.clientes}
                onValueChange={(value) => setCliente(value)}
                query={cliente}
                setQuery={setCliente}
              />

              <SelectGeneric
                label={"Forma de pagamento"}
                fieldExtractor={(formapag) => formapag.nome}
                data={formasPag.formasPag}
                onValueChange={(value) => setFormaPag(value)}
                query={formaPag}
                setQuery={setFormaPag}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, marginRight: 10 }}>Valor total:</Text>

                <TextInput
                  value={valorTotal}
                  onChangeText={(text) => {
                    setValorTotal(decimalDigitsMask(text, 2))
                  }}
                  keyboardType="numeric"
                  mode='outlined'
                />

              </View>

            </Card>

            <Card style={styles.cardInformacoes}>

              <Text style={styles.titleInformacoes}>Produtos</Text>

              {produtos && (
                <View>
                  {produtos.map((item, index) => (
                    <View style={styles.produtoContainer} key={item?.produto._id}>
                      <TouchableOpacity
                        onPress={() => {
                          const newProdutos = [...produtos];
                          const newQuantidadesFinais = [...quantidadesFinais];
                          newProdutos.splice(index, 1);
                          newQuantidadesFinais.splice(index, 1);
                          setProdutos(newProdutos);
                          setQuantidadesFinais(newQuantidadesFinais);
                        }}
                      >
                        <Icon name="times" size={23} color="red" style={{ marginRight: 15 }} />
                      </TouchableOpacity>
                      <Base64Image
                        base64ImageData={item?.produto.foto}
                        width={50}
                        height={50}
                      />
                      <Text style={styles.produtoNome}>{item?.produto.nome}</Text>
                      <View style={styles.quantidadeContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            const newQuantidadesFinais = [...quantidadesFinais];
                            if (parseInt(newQuantidadesFinais[index]) - 1 === 0) {
                              return
                            }
                            newQuantidadesFinais[index] = parseInt(newQuantidadesFinais[index]) - 1;
                            setQuantidadesFinais(newQuantidadesFinais);
                          }}
                        >
                          <Icon name="minus" size={23} color="black" />
                        </TouchableOpacity>
                        <View style={styles.produtoQuantidade}>
                          <NumberInput
                            label="Quantidade"
                            value={quantidadesFinais[index]}
                            onChangeText={(newValue) => {
                              const newQuantidadesFinais = [...quantidadesFinais];
                              if (newValue) {
                                newQuantidadesFinais[index] = parseInt(newValue);
                              } else {
                                newQuantidadesFinais[index] = '';
                              }
                              setQuantidadesFinais(newQuantidadesFinais);
                            }}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            const newQuantidadesFinais = [...quantidadesFinais];
                            newQuantidadesFinais[index] = parseInt(newQuantidadesFinais[index]) + 1;
                            setQuantidadesFinais(newQuantidadesFinais);
                          }}
                        >
                          <Icon name="plus" size={23} color="black" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>

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
              onPress={() => {setDialogConfirm(true) ; setMsgDialog('Finalizar venda?')}}
              title={'Finalizar venda'}
              backgroundColor={'green'}
            />
          </View>
        </ScrollView>

      }

      <Modal
        isVisible={modalProduto}
        onBackdropPress={closeModalProduto}
      >
        <SnackbarGeneric
          visible={dialogMessageError}
          message={msgDialog}
          setVisible={setDialogMessageError}
          type={'erro'}
          duration={2500}
          position={'top'}
        />
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
    fontSize: 18, // Tamanho da fonte do nome do produto
    marginRight: 20
  },
  produtoQuantidade: {
    marginHorizontal: 10, // Espaçamento à esquerda da quantidade do produto
    // fontSize: 16, // Tamanho da fonte da quantidade do produto
    color: 'gray', // Cor do texto da quantidade
  },
  cardInformacoes: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20
  },
  titleInformacoes: {
    marginBottom: 20,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  quantidadeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  }
});

export default Venda;
