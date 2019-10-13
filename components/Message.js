import React from 'react';
import { View, Dimensions } from 'react-native';
import { Paragraph } from 'react-native-paper';

import getValueMessage from '../utils/getValueMessage';

const { width } = Dimensions.get('window');

const Message = ({ loading, measurements, location }) => (
  <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
    {loading && <Paragraph style={{ fontSize: 20, marginHorizontal: 20, lineHeight: 25, textAlign: 'center' }}>
      Processing air quality data for {location}...
    </Paragraph>}
    {!loading && measurements.length > 0 && <View>
      <Paragraph style={{ width: width - 100, fontSize: 20, marginHorizontal: 20, lineHeight: 25, textAlign: 'center' }}>Looks like the air in {location} is {getValueMessage('pm25', measurements[0].value)}.</Paragraph>
      <Paragraph style={{ fontSize: 20, marginHorizontal: 20, lineHeight: 25, textAlign: 'center' }}>PM2.5: {measurements[0].value}µg/m³.</Paragraph>
    </View>}
  </View>
);

export default Message;
