import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ButtonGeneric from '../components/Button/ButtonGeneric';
import DialogConfirm from '../components/Dialog/DialogConfirm';
import DialogMessage from '../components/Dialog/DialogMessage';

const API_BASE_URL = "http://192.168.1.70:3001" // NOTBOOK HOME



const VendaHistorico = () => {

  const navigation = useNavigation();

  const [vendas, setVendas] = useState([])

  const [dialogConfirm, setDialogConfirm] = useState(false)
  const [dialogMessageError, setDialogMessageError] = useState(false)
  const [msgDialog, setMsgDialog] = useState()
  const [dialogMessageSuccess, setDialogMessageSuccess] = useState(false)


  const handleConfirm = () => {
    onSubmit()
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
        const vendas = await res.json()
        console.log|(vendas)
        setVendas(vendas);
    } catch (error) {
        console.log("DEU RUIM PEGAR VENDAS")
    }
}

  useEffect( () => {
    getVendas()
  }, [])

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

        <ScrollView style={{ flex: 1 }}>

          <View style={styles.container}>

            <Card style={styles.cardInformacoes}>

              <Text style={styles.titleInformacoes}>Vendas</Text>

              {vendas.length > 0 && 
                <View>
                  {vendas.map((venda, index) => (
                    // <View style={styles.produtoContainer} key={venda?._id}>
                      <Text style={styles.produtoNome}>{venda?.vlr_total}</Text>
                    // </View>
                  ))}
                </View>

                }
            </Card>

            <ButtonGeneric
              onPress={() => {setDialogConfirm(true) ; setMsgDialog('Finalizar venda?')}}
              title={'Finalizar venda'}
              backgroundColor={'green'}
            />
          </View>
        </ScrollView>
    </View >

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  produtoContainer: {
    flexDirection: 'row', // Para alinhar os elementos horizontalmente
    alignvendas: 'center', // Para alinhar os elementos verticalmente ao centro
    marginBottom: 20, // Espaçamento inferior entre os produtos
  },
  produtoNome: {
    marginLeft: 10, // Espaçamento à esquerda do nome do produto
    fontSize: 18, // Tamanho da fonte do nome do produto
    marginRight: 20,
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
});

export default VendaHistorico;
