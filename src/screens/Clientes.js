import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { apiCorreios } from '../services/apiCorreios';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons'
import { Button, useTheme } from 'react-native-paper';


export default function Clientes() {

  const { colors } = useTheme();

  const [CEP, setCEP] = useState('')
  const [bairro, setBairro] = useState('')
  const [localidade, setLocalidade] = useState('')
  const [UF, setUF] = useState('')
  const [hora, setHora] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cpf, setCpf] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [typeCamera, setTypeCamera] = useState(Camera.Constants.Type.back)
  const [hasPermissionCamera, setHasPermissionCamera] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const cameraRef = useRef(null)
  const [foto, setFoto] = useState(null)
  const [openModal, setOpenModal] = useState(null)



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

  const inserirCliente = async () => {
    try {
      const response = await fetch("http://192.168.1.69:3001/insert_cliente/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          telefone: telefone,
          cpf: cpf,
          cep: CEP,
          endereco: logradouro,
          bairro: bairro,
          municipio: localidade,
          foto: foto
        }),
      });
      Alert.alert("Cliente cadastrado com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };

  async function abrirCamera() {
    setFoto(null)
    const { status } = await Camera.requestCameraPermissionsAsync()
    setShowCamera(true)
    setHasPermissionCamera(status === 'granted')
    if (status !== 'granted') {
      setShowCamera(false)
    }
  }

  async function tirarFoto() {
    if (cameraRef) {
      const data = await cameraRef.current.takePictureAsync();
      console.log(data)
      setFoto(data.uri)
      setOpenModal(true)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString(); // Obtém a hora atual no formato desejado
      setHora(timeString);
    }, 1000);

    return () => clearInterval(interval); // Limpa o intervalo quando o componente for desmontado
  }, []);

  return (
    <>

      {showCamera &&
        <SafeAreaView style={styles.containerCamera}>
          <Camera style={{ flex: 1 }} type={typeCamera} ref={cameraRef}>
            <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
              <Button mode="text" style={{ position: 'absolute', bottom: 20, left: 20 }} onPress={() => {
                setTypeCamera(
                  typeCamera === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                )
              }}>
                Inverter
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
          </Camera>

          <TouchableOpacity style={styles.buttonCamera} onPress={() => tirarFoto()}>
            <FontAwesome name='camera' size={23} color={'#fff'} />
          </TouchableOpacity>

          {foto &&
            <Modal animationType='slide' transparent={false} visible={openModal}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                <TouchableOpacity style={{ margin: 10 }} onPress={() => setOpenModal(false)}>
                  <FontAwesome name='window-close' size={50} color="#ff0000" />
                </TouchableOpacity>

                <Image style={{ width: '100%', height: 300, borderRadius: 20 }} source={{ uri: foto }} />

                <TouchableOpacity style={styles.botaoBuscar} onPress={() => setShowCamera(false)}>
                  <Text style={styles.textoBotao}>Usar foto</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          }

        </SafeAreaView>
      }

      {!showCamera &&
        <ScrollView>
          <View View style={styles.containerPrincipal}>
            <View style={styles.topBar}>
              <Text style={styles.title}>Cadastro de cliente</Text>
              <Text style={styles.timeText}>{hora}</Text>
            </View>

            <View style={styles.containerGeneric}>
              {foto && <Image style={{ width: '100%', height: 300, }} source={{ uri: foto }} />}
              <Button icon="camera" mode="contained" onPress={abrirCamera} style={{backgroundColor: 'red'}}>
                Tirar foto
              </Button>
              {/* <TouchableOpacity style={styles.botaoBuscar} onPress={abrirCamera}>
                <Text style={styles.textoBotao}>Tirar foto</Text>
              </TouchableOpacity> */}
            </View>

            <TextInput value={nome} onChangeText={(txt) => setNome(txt)} placeholder='Nome'
              style={styles.campos}
            />

            <TextInput value={email} onChangeText={(txt) => setEmail(txt)} placeholder='Email'
              style={styles.campos}
            />
            <View style={styles.containerCep}>
              <TextInput value={telefone} onChangeText={(txt) => setTelefone(txt)} placeholder='Telefone'
                style={styles.camposInline}
              />

              <TextInput value={cpf} onChangeText={(txt) => setCpf(txt)} placeholder='CPF'
                style={styles.camposInline}
              />
            </View>

            <View style={styles.containerCep}>
              <TextInput value={CEP} onChangeText={(txt) => setCEP(txt)} placeholder='CEP' onBlur={buscarCEP}
                style={styles.camposInline}
              />

              <TextInput value={bairro} onChangeText={(txt) => setBairro(txt)} placeholder='Bairro'
                style={styles.camposInline}
              />
            </View>

            <TextInput value={logradouro} onChangeText={(txt) => setLogradouro(txt)} placeholder='Logradouro'
              style={styles.campos}
            />

            <View style={styles.containerCep}>
              <TextInput value={localidade} onChangeText={(txt) => setLocalidade(txt)} placeholder='Municipio'
                style={styles.camposInline}
              />
              <TextInput value={UF} onChangeText={(txt) => setUF(txt)} placeholder='Estado'
                style={styles.camposInline}
              />
            </View>

            <TouchableOpacity style={styles.botaoBuscar} onPress={inserirCliente}>
              <Text style={styles.textoBotao}>CADASTRAR</Text>
            </TouchableOpacity>

          </View >
        </ScrollView>
      }
    </>
  );
}



const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  topBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#006ba8'
  },
  title: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
    margin: 20,
  },
  containerCep: {
    flexDirection: 'row',
    height: 70,
    marginHorizontal: 1,
  },
  botaoBuscar: {
    backgroundColor: '#006ba8',
    width: "97%",
    height: 70,
    marginTop: 20,
    borderRadius: 5,
    padding: 20,
    alignSelf: 'center'
  },
  textoBotao: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  campos: {
    borderColor: 'blue',
    borderWidth: 2,
    padding: 15,
    fontSize: 18,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 8
  },
  camposInline: {
    borderColor: 'blue',
    borderWidth: 2,
    padding: 15,
    fontSize: 18,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 5,
    width: '47%'
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    right: 10,
    color: 'white'
  },
  containerGeneric: {
    width: '100%',
    height: 400,
  },
  containerCamera: {
    flex: 1,
    justifyContent: 'center'
  },
  buttonCamera: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    margin: 20,
    borderRadius: 10,
    height: 50,
  }
})

