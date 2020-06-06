import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUfResponse {
  sigla: string,
}

interface IBGECityResponse {
  nome: string,
}

interface Item {
  label: string;
  value: any;
}

const Home: React.FC = () => {
  const [ufs, setUfs] = useState<Item[]>([]);
  const [cities, setCities] = useState<Item[]>([]);
  const [selectedUF, setSelectedUF] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => { return { label: uf.sigla, value: uf.sigla } })
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUF === '') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => { return { label: city.nome, value: city.nome } })

        setCities(cityNames);
      });

  }, [selectedUF]);

  function handleNavigateToPoints() {

    navigation.navigate('Points', { uf: selectedUF, city: selectedCity })
  }
  return (<ImageBackground
    source={require('../../assets/home-background.png')}
    style={styles.container}
    imageStyle={{ width: 274, height: 368 }}

  >
    <View style={styles.main}>
      <Image source={require('../../assets/logo.png')} />
      <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
      <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
    </View>
    <View style={styles.select}>

    </View>
    <View style={styles.footer}>
      <RNPickerSelect
        style={{ inputIOS: { ...styles.input }, inputAndroid: { ...styles.input } }}
        onValueChange={(value) => setSelectedUF(value)}
        items={ufs}
      />
      <RNPickerSelect
        style={{ inputIOS: { ...styles.input }, inputAndroid: { ...styles.input } }}
        onValueChange={(value) => setSelectedCity(value)}
        items={cities}
      />
      <RectButton style={styles.button} onPress={handleNavigateToPoints}>
        <View style={styles.buttonIcon}>
          <Text>
            <Icon name="arrow-right" color="#fff" size={24} />
          </Text>
        </View>
        <Text style={styles.buttonText}>
          Entrar
      </Text>
      </RectButton>
    </View>
  </ImageBackground>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: 'black',

  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;