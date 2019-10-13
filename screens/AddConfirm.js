import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import { IconButton } from 'react-native-paper';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useStoreActions } from 'easy-peasy';

import getFurnitureData from '../furnitureData';
import { slideHeight } from '../components/CarouselItem';
import Message from '../components/Message';
import Chart from '../components/Chart';
import fetchApi from '../utils/fetchApi';
import getValueColor from '../utils/getValueColor';

const furnitures = getFurnitureData(slideHeight);
const { height } = Dimensions.get('window');

const AddConfirm = ({ navigation }) => {
  const data = navigation.getParam('data', null);
  const [measurementState, setMeasurementState] = useState({
    loading: false,
    list: [],
    error: false,
  });
  const addLocation = useStoreActions(state => state.locations.addLocation);

  if (!data) {
    return null;
  }

  const topProps = furnitures.find(i => i.id === data.top);
  const botProps = furnitures.find(i => i.id === data.bot);
  topProps && delete topProps.position;
  botProps && delete botProps.position;

  const getMeasurementData = async () => {
    setMeasurementState({ ...measurementState, loading: true });
    try {
      const result = await fetchApi({
        endpoint: '/measurements',
        params: {
          limit: 6,
          parameter: ['pm25'],
          location: data.location,
        },
      });
      if (result.status === 200 && result.data.results.length > 0) {
        // console.log(result.data);
        setMeasurementState({ ...measurementState, loading: false, list: result.data.results });
      } else {
        setMeasurementState({ ...measurementState, loading: false, error: true });
        console.log(result)
      }
    } catch (error) {
      setMeasurementState({ ...measurementState, loading: false, error: true });
      console.log(error)
    }
  }

  useEffect(() => {
    getMeasurementData();
  }, [data.location]);

  const handleFinish = () => {
    // console.log(measurementState.list)
    addLocation({
      ...data,
      measurements: measurementState.list,
      updatedAt: new Date(),
    });
    navigation.navigate('Tab');
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: measurementState.list.length > 0
          ? getValueColor('pm25', measurementState.list[0].value, 0.2)
          : '#fff'
      }}
    >
      <Transition shared={topProps.id + data.id}>
        <Image {...topProps} />
      </Transition>
      <View style={{ marginTop: height / 3 - 10, width: '100%' }}>
        <Transition shared={'message' + data.id}>
          <Message location={data.location} loading={measurementState.loading} measurements={measurementState.list} />
        </Transition>
        <View style={{ marginTop: height * 3 / 100 }}>
          <Chart measurements={measurementState.list} />
        </View>
      </View>
      <Transition shared={botProps.id + data.id}>
        <Image {...botProps} />
      </Transition>
      <IconButton
        style={{ position: 'absolute', bottom: 40, left: 40, backgroundColor: '#fff' }}
        color='#333'
        icon={props => <Feather {...props} name='arrow-left' />}
        onPress={() => navigation.goBack()}
      />
      <IconButton
        style={{ position: 'absolute', bottom: 40, right: 40, backgroundColor: '#fff' }}
        color='#333'
        icon={props => <Feather {...props} name='check' />}
        onPress={handleFinish}
        disabled={measurementState.loading || measurementState.error}
      />
    </View>
  );
}

export default AddConfirm;
