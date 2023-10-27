import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons'; // Importe o ícone do pacote que você está usando
import { LOGO } from '../../assets/logo.png'
import { Image } from 'react-native';



export default function Home({ navigation }) {


  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 200, height: 200, marginBottom: 10 }}
          />
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'green' }}>INFOMOBILE</Text>
          <Text style={{ marginBottom: 40 }}>Gerindo suas vendas de forma fácil e moderna</Text>

          <TouchableOpacity onPress={() => navigation.navigate('Venda')} style={{ width: '100%' }} activeOpacity={0.9} elevation={5}>
            <Card style={styles.cardInformacoes}>
              <View style={styles.viewCard}>
                <SimpleLineIcons name="handbag" size={22} color="white" />
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white', textAlign: 'center', marginLeft: 10 }} >Venda</Text>
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('VendaHistorico')} style={{ width: '100%' }} activeOpacity={0.9} elevation={5}>
            <Card style={styles.cardInformacoes}>
              <View style={styles.viewCard}>
                <Ionicons name={"book-outline"} size={22} color="#ffff" />
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white', textAlign: 'center', marginLeft: 10 }} >Histórico</Text>
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Clientes')} style={{ width: '100%' }} activeOpacity={0.9} elevation={5}>
            <Card style={styles.cardInformacoes}>
              <View style={styles.viewCard}>
                <Ionicons name={"people-outline"} size={24} color="#ffff" />
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white', textAlign: 'center', marginLeft: 10 }} >Clientes</Text>
              </View>
            </Card>
          </TouchableOpacity>

        </View >
      </ScrollView>

    </>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardInformacoes: {
    padding: 20,
    backgroundColor: 'green',
    marginBottom: 10,
    width: '100%',
  },
  viewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

