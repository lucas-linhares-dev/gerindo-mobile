import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { apiCorreios } from '../services/apiCorreios';
import { TextInput, Text, Card } from 'react-native-paper';
import ButtonGeneric from '../components/Button/ButtonGeneric';
import { MaterialIcons } from '@expo/vector-icons';
import { maskCpf, maskPhone } from '../helpers/masks';
import DialogConfirm from '../components/Dialog/DialogConfirm';
import DialogMessage from '../components/Dialog/DialogMessage';
import { ClienteActions } from '../actions/ClienteActions';


export default function Clientes() {

  const [CEP, setCEP] = useState('')
  const [bairro, setBairro] = useState('')
  const [localidade, setLocalidade] = useState('')
  const [UF, setUF] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cpf, setCpf] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')

  const [msgDialog, setMsgDialog] = useState('')
  const [dialogConfirm, setDialogConfirm] = useState('')

  const [dialogMessageSuccess, setDialogMessageSuccess] = useState(false)
  const [dialogMessageError, setDialogMessageError] = useState(false)


  async function buscarCEP() {
    try {
      const response = await apiCorreios.get(`/${CEP}/json/`)
      console.log(response.data)
      setLogradouro(response.data.logradouro)
      setBairro(response.data.bairro)
      setLocalidade(response.data.localidade)
      setUF(response.data.uf)
    }
    catch (error) {
      console.log(error)
    }
  }

  const onSubmit = async () => {

    if (!nome) {
      setDialogMessageError(true);
      setMsgDialog("Informe o NOME!");
      return
    }
    if (!cpf) {
      setDialogMessageError(true);
      setMsgDialog("Informe o CPF!");
      return
    }
    if (!telefone) {
      setDialogMessageError(true);
      setMsgDialog("Informe o TELEFONE!");
      return
    }

    const objClienteInsert = {
      nome: nome,
      email: email,
      telefone: telefone,
      cpf: cpf,
      cep: CEP,
      endereco: logradouro,
      bairro: bairro,
      municipio: localidade,
      numero: numero
    }

    const res = ClienteActions.Insert(objClienteInsert)

    setMsgDialog("Cliente cadastrado com sucesso!")
    setDialogMessageSuccess(true)

    setNome('')
    setTelefone('')
    setCpf('')
    setEmail('')
    setCEP('')
    setLogradouro('')
    setBairro('')
    setNumero('')
    setLocalidade('')
  };

  const handleConfirm = () => {
    onSubmit()
    setDialogConfirm(false);
  };

  return (
    <>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>

          <DialogConfirm
            visible={dialogConfirm}
            onConfirm={handleConfirm}
            onCancel={() => setDialogConfirm(false)}
            message={msgDialog}
          />

          <DialogMessage visible={dialogMessageError} setVisible={setDialogMessageError} message={msgDialog} onDismiss={() => setDialogMessageError(false)} type={'erro'} />
          <DialogMessage visible={dialogMessageSuccess} setVisible={setDialogMessageSuccess} message={msgDialog} onDismiss={() => setDialogMessageSuccess(false)} type={'sucesso'} />


          <Card style={styles.cardInformacoes}>

            <View style={{ borderBotto: 'solid 1px yellow' }}>
              <Text style={styles.titleInformacoes}>Informações pessoais</Text>
            </View>

            <TextInput label="Nome" value={nome} onChangeText={text => setNome(text)} mode='outlined' style={{ marginVertical: 2 }} />
            <TextInput value={email} onChangeText={(txt) => setEmail(txt)} label='Email' mode='outlined' style={{ marginVertical: 2 }} />
            <View style={styles.rowContainer}>
              <TextInput value={telefone} onChangeText={(txt) => setTelefone(maskPhone(txt))} label='Telefone' mode='outlined' style={{ flex: 1, marginRight: 3, marginVertical: 2 }} />
              <TextInput value={cpf} onChangeText={(txt) => setCpf(maskCpf(txt))} label='CPF' mode='outlined' style={{ flex: 1, marginLeft: 3, marginVertical: 2 }} />
            </View>
          </Card>

          <Card style={styles.cardInformacoes}>

            <View style={{ borderBotto: 'solid 1px yellow' }}>
              <Text style={styles.titleInformacoes}>Logradouro</Text>
            </View>

            <View style={styles.rowContainer}>
              <TextInput value={CEP} onChangeText={(txt) => setCEP(txt)} label='CEP' onBlur={buscarCEP} mode='outlined' style={{ width: 130, marginRight: 3, marginVertical: 2 }} />
              <TextInput value={bairro} onChangeText={(txt) => setBairro(txt)} label='Bairro' mode='outlined' style={{ flex: 1, marginLeft: 3, marginVertical: 2 }} />
            </View>
            <View style={styles.rowContainer}>
              <TextInput value={logradouro} onChangeText={(txt) => setLogradouro(txt)} label='Logradouro' mode='outlined' style={{ flex: 1, marginRight: 3, marginVertical: 2 }} />
              <TextInput value={numero} onChangeText={(txt) => setNumero(txt)} label='Número' mode='outlined' style={{ marginLeft: 3, width: 100, marginVertical: 2 }} />
            </View>
            <View style={styles.rowContainer}>
              <TextInput value={localidade} onChangeText={(txt) => setLocalidade(txt)} label='Municipio' mode='outlined' style={{ flex: 1, marginRight: 3, marginVertical: 2 }} />
              <TextInput value={UF} onChangeText={(txt) => setUF(txt)} label='Estado' mode='outlined' style={{ width: 100, marginLeft: 3, marginVertical: 2 }} />
            </View>
          </Card>

          <ButtonGeneric
            onPress={() => { setDialogConfirm(true); setMsgDialog('Cadastrar cliente?') }}
            title={'Cadastrar cliente'}
            backgroundColor={'green'}
            marginBottom={15}
            icon={<MaterialIcons name="save-alt" size={22} color="white" />}
          />

        </View>
      </ScrollView>

    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginHorizontal: 5
  },
})

