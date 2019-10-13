import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Dimensions, View, Image, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Transition } from 'react-navigation-fluid-transitions';
import { useStoreActions } from 'easy-peasy';
import moment from 'moment';
import Constants from 'expo-constants';

import getFurnitureData from '../furnitureData';
import Message from './Message';
import getValueColor from '../utils/getValueColor';
import fetchApi from '../utils/fetchApi';

const isiPhoneX = Platform.OS == 'ios' && (
  Constants.platform.ios.model.toLowerCase().includes('iphone x') ||
  Constants.deviceName.toLowerCase().includes('iphone x')
);
const footerSpaceHeight = isiPhoneX ? 34 : 0;

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

function wp (percentage) {
  const value = (percentage * WIDTH) / 100;
  return Math.round(value);
}

export const slideHeight = HEIGHT - 180 - footerSpaceHeight;
const slideWidth = wp(80);
const itemHorizontalMargin = wp(2);

export const sliderWidth = WIDTH;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

const furnitures = getFurnitureData(slideHeight);

const CarouselItem = ({ data, navigation }) => {
  const setMeasurements = useStoreActions(state => state.locations.setMeasurements);
  const [measurementState, setMeasurementState] = useState({
    loading: false,
    list: data.measurements,
  });

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
      if (result.status === 200) {
        // console.log(result.data);
        setMeasurementState({ ...measurementState, loading: false, list: result.data.results });
        setMeasurements({ id: data.id, measurements: result.data.results });
      } else {
        setMeasurementState({ ...measurementState, loading: false });
        console.log(result)
      }
    } catch (error) {
      setMeasurementState({ ...measurementState, loading: false });
      console.log(error)
    }
  }

  useEffect(() => {
    if (data.measurements.length > 0) {
      const duration = moment.duration(moment().diff(moment(data.updatedAt)));
      // console.log(data.location, duration.asHours())
      if (duration.asHours() > 1) {
        getMeasurementData();
      }
    } else {
      getMeasurementData();
    }
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.navigate('Detail', { data })}
      style={{
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
      }}
    >
      <View style={{
        flex: 1,
        backgroundColor: data.measurements.length > 0
          ? getValueColor('pm25', data.measurements[0].value, 0.2)
          : '#fff',
        borderRadius: entryBorderRadius,
        justifyContent: 'center',
      }}>
        <Transition shared={topProps.id + data.id}>
          <Image {...topProps} />
        </Transition>
        <Transition shared={'message' + data.id}>
          <Message location={data.location} loading={measurementState.loading} measurements={data.measurements} />
        </Transition>
        <Transition shared={botProps.id + data.id}>
          <Image {...botProps} />
        </Transition>
      </View>
    </TouchableOpacity>
  );
}

export default withNavigation(CarouselItem);
