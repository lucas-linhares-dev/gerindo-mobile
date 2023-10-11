import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ButtonGeneric from '../components/Button/ButtonGeneric';
import DialogConfirm from '../components/Dialog/DialogConfirm';
import DialogMessage from '../components/Dialog/DialogMessage';
import formatarData from "../helpers/formatarData";

// const API_BASE_URL = "http://10.50.46.113:3001" // NOTBOOK HOMES
const API_BASE_URL = "http://192.168.1.70:3001" // NOTBOOK HOME

const VendaHistorico = () => {
  const navigation = useNavigation();

  const [vendas, setVendas] = useState([]);
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [dialogMessageError, setDialogMessageError] = useState(false);
  const [msgDialog, setMsgDialog] = useState();
  const [dialogMessageSuccess, setDialogMessageSuccess] = useState(false);

  const handleConfirm = () => {
    onSubmit();
    setDialogConfirm(false);
  };

  const handleCancel = () => {
    setDialogConfirm(false);
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

  useEffect(() => {
    getVendas();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DialogConfirm
        visible={dialogConfirm}
        onConfirm={handleConfirm}
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
          {vendas.length > 0 && (
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
                      navigation.navigate('Venda', {venda});
                    }}
                    title={'Editar venda'}
                    backgroundColor={'gold'}
                  />
                  <ButtonGeneric
                    marginTop={10}
                    onPress={() => {
                      setDialogConfirm(true);
                      setMsgDialog('Finalizar venda?');
                    }}
                    title={'Cancelar venda'}
                    backgroundColor={'red'}
                  />
                </Card>
              ))}
            </View>
          )}
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
  }
});

export default VendaHistorico;
