import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ButtonGeneric from '../components/Button/ButtonGeneric';
import DialogConfirm from '../components/Dialog/DialogConfirm';
import DialogMessage from '../components/Dialog/DialogMessage';
import formatarData from "../helpers/formatarData";
import { VendaActions } from '../actions/VendaActions';
import { useFormaPag } from '../providers/FormaPagProvider';
import { useCliente } from '../providers/ClienteProvider';
import MyDateTimePicker from '../components/DateTimePicker/DateTimePicker';
import AutocompleteGeneric from '../components/AutoComplete/AutoCompleteGeneric';
import SelectGeneric from '../components/Select/SelectGeneric';
import LoadingSpinner from '../components/Dialog/LoadingSpinner';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// const API_BASE_URL = "http://10.50.46.113:3001" // NOTBOOK HOMES
const API_BASE_URL = "http://192.168.1.70:3001" // NOTBOOK HOME

const VendaHistorico = () => {
  const navigation = useNavigation();

  const [vendas, setVendas] = useState([]);
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [dialogMessageError, setDialogMessageError] = useState(false);
  const [msgDialog, setMsgDialog] = useState();
  const [dialogMessageSuccess, setDialogMessageSuccess] = useState(false);

  const [idDelete, setIdDelete] = useState(null)

  const [formaPag, setFormaPag] = useState('');
  const [formaPagId, setFormaPagId] = useState(null)

  const [cliente, setCliente] = useState('');
  const [clienteId, setClienteId] = useState(null)

  const clientes = useCliente()
  const formasPag = useFormaPag()

  const [dataInicial, setDataInicial] = useState(new Date())
  const [dataFinal, setDataFinal] = useState(new Date())

  const [buscaVazia, setBuscaVazia] = useState(false)


  const deleteVenda = async () => {
    setDialogConfirm(false);
    const res = await VendaActions.Delete(idDelete)
    if (res.status === 200) {
      setDialogMessageSuccess(true)
      setMsgDialog("Venda excluida com sucesso!")
    }
    else {
      setDialogMessageSuccess(true)
      setMsgDialog("Não foi possível excluir a venda!")
    }
    getVendas()
  };

  const handleCancel = () => {
    setDialogConfirm(false);
    setMsgDialog(null)
  };

  async function getVendas() {
    try {
      const res = await fetch(`${API_BASE_URL}/vendas/getAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const vendas = await res.json();
      setVendas(vendas);
    } catch (error) {
      console.log("DEU RUIM PEGAR VENDAS");
    }
  }

  async function filtrarVendas() {
    setBuscaVazia(false)
    setVendas([])
    const objFilters = {
      dt_inicial: dataInicial,
      dt_final: dataFinal,
      cliente: clienteId,
      forma_pag: formaPagId
    };

    // Converte o objeto de filtro em uma string de consulta
    const queryString = new URLSearchParams(objFilters).toString();

    try {
      const res = await fetch(`${API_BASE_URL}/vendas/filtrar?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const vendas = await res.json();
      if (vendas.length === 0) {
        setBuscaVazia(true)
      }
      setVendas(vendas);
    } catch (error) {
      console.log("DEU RUIM PEGAR VENDAS");
    }
  }


  useEffect(() => {
    getVendas();
  }, []);


  const vendaDelete = async (_id) => {
    if (dialogMessageError) {

    }
  }

  return (
    <View style={{ flex: 1 }}>
      <DialogConfirm
        visible={dialogConfirm}
        onConfirm={deleteVenda}
        onCancel={handleCancel}
        message={msgDialog}
      />

      <DialogMessage
        visible={dialogMessageError}
        setVisible={setDialogMessageError}
        message={msgDialog}
        onDismiss={() => setDialogMessageError(false)}
        type={'erro'}
      />

      <DialogMessage
        visible={dialogMessageSuccess}
        setVisible={setDialogMessageSuccess}
        message={msgDialog}
        onDismiss={() => setDialogMessageSuccess(false)}
        type={'sucesso'}
      />

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Card style={styles.cardInformacoes}>

            <View style={styles.dateContainer}>
              <MyDateTimePicker date={dataInicial} setDate={setDataInicial} disablePadding={true} />
              <Text style={{marginHorizontal: 10, paddingBottom: 10}}>__</Text>
              <MyDateTimePicker date={dataFinal} setDate={setDataFinal} disablePadding={true}/>
            </View>
            <View style={{ marginVertical: 10 }}>

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
            <ButtonGeneric
              marginTop={10}
              onPress={() => {
                filtrarVendas()
              }}
              title={'Filtrar'}
              backgroundColor={'blue'}
              icon={<Ionicons name="filter" size={18} color="white" />}
            />
          </Card>


          {vendas.length > 0 ? (
            <View>
              {vendas.map((venda, index) => (
                <Card style={styles.cardInformacoes} key={venda?._id}>
                  <Text style={styles.titleInformacoes}>{formatarData(venda?.data)}</Text>
                  <Text style={styles.informacoesText}>Valor Total: <Text style={styles.valor}>{venda?.vlr_total}</Text></Text>
                  <Text style={styles.informacoesText}>Forma de Pagamento: <Text style={styles.negrito}>{venda?.forma_pag.nome}</Text></Text>
                  <Text style={styles.informacoesText}>Cliente: <Text style={styles.negrito}>{venda?.cliente.nome}</Text></Text>
                  <ButtonGeneric
                    marginTop={10}
                    onPress={() => {
                      navigation.navigate('Venda', { venda });
                    }}
                    title={'Editar venda'}
                    backgroundColor={'#fcc200'}
                    icon={<Feather name="edit" size={18} color="white" />}
                  />
                  <ButtonGeneric
                    marginTop={10}
                    onPress={() => {
                      setIdDelete(null)
                      setDialogConfirm(true)
                      setMsgDialog('Excluir venda?')
                      setIdDelete(venda._id)
                    }}
                    title={'Cancelar venda'}
                    backgroundColor={'red'}
                    icon={<FontAwesome5 name="trash" size={14} color="white" />}
                  />
                </Card>
              ))}
            </View>
          )

            :

            buscaVazia ?
              <View style={{marginTop: 20}}>
                <Text style={styles.notFoundText}>Nenhuma venda encontrada</Text>
              </View>
              :

              <LoadingSpinner />
          }
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  cardInformacoes: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  titleInformacoes: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  informacoesText: {
    fontSize: 16,
    marginBottom: 10,
  },
  negrito: {
    fontWeight: 'bold',
  },
  valor: {
    fontWeight: 'bold',
    fontSize: 17,
    textDecorationLine: 'underline'
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  notFoundText: {
    fontSize: 20, // Tamanho de fonte maior
    fontWeight: 'bold', // Deixa o texto mais forte
    textAlign: 'center', // Alinha o texto ao centro
    marginTop: 'auto', // Move para o meio vertical
  },

});

export default VendaHistorico;
