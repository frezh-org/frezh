import React, { useRef } from 'react';
import { View, Image, Dimensions, Share, Platform } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import { IconButton, Paragraph, List } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import Modalize from 'react-native-modalize';
import { useStoreActions } from 'easy-peasy';
import { captureRef as takeSnapshotAsync } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import getFurnitureData from '../furnitureData';
import { slideHeight } from '../components/CarouselItem';
import Chart from '../components/Chart';
import Message from '../components/Message';
import getValueColor from '../utils/getValueColor';

const furnitures = getFurnitureData(slideHeight);

const { width, height } = Dimensions.get('window');

const Detail = ({ navigation }) => {
  const data = navigation.getParam('data', null);
  const menuRef = useRef(null);
  const detailRef = useRef(null);
  const removeLocation = useStoreActions(state => state.locations.removeLocation);

  if (!data) {
    return null;
  }

  const topProps = furnitures.find(i => i.id === data.top);
  const botProps = furnitures.find(i => i.id === data.bot);
  topProps && delete topProps.position;
  botProps && delete botProps.position;

  const handleShare = async () => {
    const url = await takeSnapshotAsync(detailRef, {
      format: 'jpg',
      quality: 0.5,
      result: 'tmpfile',
      height,
      width,
    });
    if (Platform.OS === 'android') {
      await Sharing.shareAsync(url, {
        dialogTitle: `Air quality in ${data.location} - Frezh.org.`,
      });
    } else {
      Share.share({
        url,
        title: 'Frezh.org',
        message: `Air quality in ${data.location}.`,
      });
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View ref={detailRef} style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            flex: 1,
            backgroundColor: data.measurements.length > 0
              ? getValueColor('pm25', data.measurements[0].value, 0.2)
              : '#fff',
          }}
        />
        <Transition shared={topProps.id + data.id}>
          <Image {...topProps} />
        </Transition>
        <View style={{ marginTop: height / 3 - 10, width: '100%' }}>
          <Transition shared={'message' + data.id}>
            <Message measurements={data.measurements} location={data.location} />
          </Transition>
          <View style={{ marginTop: height * 3 / 100 }}>
            <Chart measurements={data.measurements} />
          </View>
        </View>
        <Transition shared={botProps.id + data.id}>
          <Image {...botProps} />
        </Transition>
      </View>
      <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
        <IconButton
          onPress={() => menuRef.current.open()}
          color='#333'
          icon={props => <Feather {...props} name='menu' />}
          style={{ position: 'absolute', top: 50, right: 40, backgroundColor: '#fff' }}
        />
        <IconButton
          style={{ position: 'absolute', bottom: 40, left: 40, backgroundColor: '#fff' }}
          color='#333'
          icon={props => <Feather {...props} name='arrow-left' />}
          onPress={() => navigation.goBack()}
        />
        <Modalize
          ref={menuRef}
          modalHeight={130}
        >
          <View style={{ paddingVertical: 10 }}>
            <List.Item
              onPress={handleShare}
              title='Share'
              left={props => <List.Icon {...props} icon='share-outline' />}
            />
            <List.Item
              onPress={() => {
                menuRef.current.close();
                removeLocation(data.id);
                navigation.goBack();
              }}
              title='Remove'
              left={props => <List.Icon {...props} icon='trash-can-outline' />}
            />
          </View>
        </Modalize>
      </View>
    </View>
  );
}

export default Detail;
