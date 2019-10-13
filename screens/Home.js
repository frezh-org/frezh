import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import { Title, Button, IconButton } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import shortid from 'shortid';

import Carousel from '../components/Carousel';
import fetchApi from '../utils/fetchApi';
import getRandomFurniture from '../utils/getRandomFurniture';

const Home = ({ navigation }) => {
  const data = useStoreState(state => state.locations.items);
  const userLocation = useStoreState(state => state.locations.userLocation);
  const setUserLocation = useStoreActions(state => state.locations.setUserLocation);
  const addLocation = useStoreActions(state => state.locations.addLocation);
  const [state, setState] = useState({ loading: false });

  const getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    setUserLocation(location.coords);
    if (data.length === 0) {
      initFirstLocation(`${location.coords.latitude},${location.coords.longitude}`);
    }
  };

  const initFirstLocation = async (coordinates) => {
    setState({ ...state, loading: true });
    const result = await fetchApi({
      endpoint: '/measurements',
      coordinates,
      limit: 1,
      parameter: ['pm25'],
    });
    if (result.status === 200 && result.data.results.length > 0) {
      const { top, bot } = getRandomFurniture();
      addLocation({
        id: shortid.generate(),
        top,
        bot,
        location: result.data.results[0].location,
        measurements: [],
      });
    }
    setState({ ...state, loading: false });
  }

  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      alert('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      getLocationAsync();
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 40, marginTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title style={{ fontSize: 30, color: '#333333' }}>Frezh</Title>
        <Button
          onPress={() => navigation.navigate('About')}
          color='#333333'
          labelStyle={{ fontSize: 16 }}
        >
          About
        </Button>
      </View>
      <Carousel data={data} />
    </View>
  );
}

export default Home;
