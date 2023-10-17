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
import { MaterialIcons } from '@expo/vector-icons'; 

import { decimalDigitsMask } from '../helpers/decimalDigitsMask';
import Icon from 'react-native-vector-icons/FontAwesome';
import { VendaActions } from '../actions/VendaActions';
import DialogConfirm from '../components/Dialog/DialogConfirm';
import DialogMessage from '../components/Dialog/DialogMessage';
import { parseISO } from 'date-fns';




const Venda = ({ route }) => {

  const clientes = useCliente()
  const formasPag = useFormaPag()

  const navigation = useNavigation();

  const [editMode, setEditMode] = useState(false)
  const [idVenda, setIdVenda] = useState(false)


  const [formaPag, setFormaPag] = useState('');
  const [formaPagId, setFormaPagId] = useState(null)

  const [cliente, setCliente] = useState('');
  const [clienteId, setClienteId] = useState(null)

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
  const [dialogMessageErrorProduto, setDialogMessageErrorProduto] = useState(false)
  const [msgDialog, setMsgDialog] = useState()
  const [dialogMessageSuccess, setDialogMessageSuccess] = useState(false)

  const [modalProduto, setModalProduto] = useState(false)

  useEffect(() => {
    if (route.params) {
      const { venda } = route.params;
      setFormaPag(venda.forma_pag.nome)
      setCliente(venda.cliente.nome)
      setFormaPagId(venda.forma_pag._id)
      setClienteId(venda.cliente._id)
      setData(parseISO(venda.data))
      setIdVenda(venda._id)
      const produtos = []
      const quantidadesFinais = []
      venda.produtos.map((produto) => {
        const newProduto = {
          produto: produto,
          quantidade: produto.quantidade
        }
        produtos.push(newProduto)
        quantidadesFinais.push(produto.quantidade)
      })
      setQuantidadesFinais(quantidadesFinais)
      setProdutos(produtos)
      setEditMode(true)
    }
  }, [route.params])

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

    const produtoJaExiste = produtos.some((produto) => editMode ? produto.produto.cod_ref : produto.produto._id === newProduto.produto._id);

    if (!produtoJaExiste) {
      setProdutos([...produtos, newProduto]);
      setQuantidadesFinais([...quantidadesFinais, quantidade]);
      closeModalProduto();
    }
    else {
      setDialogMessageErrorProduto(true);
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
        foto: produto.produto.foto,
        preco_venda: produto.produto.preco_venda,
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
      let res = 0
      if (editMode) {
        const objVendaUpdate = {
          _id: idVenda,
          data: data,
          cliente: clienteId,
          forma_pag: formaPagId,
          produtos: produtosFinal,
          vlr_total: valorTotal
        }

        console.log("ACTION EDITAR VENDA")
        res = await VendaActions.Update(objVendaUpdate)
      }
      else {
        const objVendaInsert = {
          data: data,
          cliente: clienteId,
          forma_pag: formaPagId,
          produtos: produtosFinal,
          vlr_total: valorTotal
        }

        res = await VendaActions.Insert(objVendaInsert)
      }

      if (res.status === 200) {
        if (editMode) {
          setMsgDialog("Venda alterada com sucesso!")
          setTimeout(() => {
            navigation.navigate('VendaHistorico');

          }, 2300)
        }
        else {
          setMsgDialog("Venda realizada com sucesso!")
        }
        setDialogMessageSuccess(true)
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

      <DialogMessage visible={dialogMessageError} setVisible={setDialogMessageError} message={msgDialog} onDismiss={() => setDialogMessageError(false)} type={'erro'} />

      <DialogMessage visible={dialogMessageSuccess} setVisible={setDialogMessageSuccess} message={msgDialog} onDismiss={() => setDialogMessageSuccess(false)} type={'sucesso'} />

      {cameraOpen &&
        <SafeAreaView style={styles.containerCamera}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 20, }}>  
            <ButtonGeneric backgroundColor={'red'} marginBottom={0} title={'Fechar'} onPress={() => {
              cancelarProduto()
              setCameraOpen(false)
            }} />
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
                setId={setClienteId}
              />

              <SelectGeneric
                label={"Forma de pagamento"}
                fieldExtractor={(formapag) => formapag.nome}
                data={formasPag.formasPag}
                onValueChange={(value) => setFormaPag(value)}
                query={formaPag}
                setQuery={setFormaPag}
                setId={setFormaPagId}
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
                icon={<AntDesign name="camera" size={22} color="white" />} // Passe o ícone como um componente
              />
            </Card>



            {editMode ?

              <ButtonGeneric
                onPress={() => { setDialogConfirm(true); setMsgDialog('Salvar alterações?') }}
                title={'Salvar alterações'}
                backgroundColor={'green'}
                marginBottom={15}
                icon={<MaterialIcons name="save-alt" size={22} color="white" />}
              />

              :

              <ButtonGeneric
                onPress={() => { setDialogConfirm(true); setMsgDialog('Finalizar venda?') }}
                title={'Finalizar venda'}
                backgroundColor={'green'}
                marginBottom={15}
                icon={<MaterialIcons name="save-alt" size={22} color="white" />}
              />

            }
          </View>
        </ScrollView>

      }

      <Modal
        isVisible={modalProduto}
        backdropOpacity={0.8} // Defina o valor desejado
        onBackdropPress={() => { }} // Não faz nada quando o fundo é pressionado
      >
        <SnackbarGeneric
          visible={dialogMessageErrorProduto}
          message={msgDialog}
          setVisible={setDialogMessageErrorProduto}
          type={'erro'}
          position={'top'}
        />
        <View style={styles.modalContainer}>
          <View style={{ alignItems: 'center' }}>
            {/* <Card>
              <Card.Content style={styles.cardContent}> */}
            <Base64Image base64ImageData={produto?.foto} width={250} height={200} />
            <Text style={styles.title}>{produto?.nome}</Text>

            {/* </Card.Content>
            </Card> */}
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
          <ButtonGeneric onPress={finalizarProdutos} title={"Inserir e Finalizar"} marginBottom={10}backgroundColor={'blue'} />
          <ButtonGeneric onPress={continuarProdutos} title={"Inserir e Scannear"} backgroundColor={'green'} marginBottom={10} />
          <ButtonGeneric onPress={cancelarProduto} title={"Cancelar"} backgroundColor={'red'} />
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
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  cardContent: {
    alignItems: 'center',
    borderRadius: 5,
    width: 270,
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  title: {
    color: 'white',
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
    borderRadius: 20,
    marginTop: 50,
    marginBottom: 20,

  },
  buttonContainer: {
    // flexDirection: 'row', // Define o layout como uma linha horizontal
    // justifyContent: 'space-between', // Distribui os botões uniformemente no espaço disponível
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
