import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { Paragraph, IconButton, TouchableRipple } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { Transition } from 'react-navigation-fluid-transitions';

const { height } = Dimensions.get('window');

const About = ({ navigation }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    <TouchableRipple style={{ width: '100%' }} onPress={() => WebBrowser.openBrowserAsync('https://buiquockhanh.com')}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50, width: '100%', paddingHorizontal: 40 }}>
        <Paragraph style={{ fontSize: 18 }}>Author:</Paragraph>
        <Paragraph style={{ fontSize: 18 }}>Quoc Khanh</Paragraph>
      </View>
    </TouchableRipple>
    <TouchableRipple style={{ width: '100%' }} onPress={() => WebBrowser.openBrowserAsync('https://lenikauffman.com')}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50, width: '100%', paddingHorizontal: 40 }}>
        <Paragraph style={{ fontSize: 18 }}>Illustrations:</Paragraph>
        <Paragraph style={{ fontSize: 18 }}>Leni Kauffman</Paragraph>
      </View>
    </TouchableRipple>
    <TouchableRipple style={{ width: '100%' }} onPress={() => WebBrowser.openBrowserAsync('https://openaq.org')}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50, width: '100%', paddingHorizontal: 40 }}>
        <Paragraph style={{ fontSize: 18 }}>Data source:</Paragraph>
        <Paragraph style={{ fontSize: 18 }}>OpenAQ</Paragraph>
      </View>
    </TouchableRipple>
    <TouchableRipple style={{ width: '100%' }} onPress={() => WebBrowser.openBrowserAsync('https://frezh.org/privacy-policy')}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50, width: '100%', paddingHorizontal: 40 }}>
        <Paragraph style={{ fontSize: 18 }}>Privacy policy</Paragraph>
      </View>
    </TouchableRipple>
    <IconButton
      style={{ position: 'absolute', bottom: 40, left: 40 }}
      color='#333'
      icon={props => <Feather {...props} name='arrow-left' />}
      onPress={() => navigation.goBack()}
    />
    <Transition appear="right" disappear="right">
      <Image
        source={require('../assets/images/about.png')}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 40,
          height: height / 2.8,
          width: 500 * height / 2.8 / 1314,
        }}
      />
    </Transition>
  </View>
);

export default About;
