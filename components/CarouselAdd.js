import React from 'react';
import { TouchableOpacity, Dimensions, View, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Transition } from 'react-navigation-fluid-transitions';
import { Paragraph } from 'react-native-paper';
import shortid from 'shortid';

import getRandomFurniture from '../utils/getRandomFurniture';
import getFurnitureData from '../furnitureData';
import { slideHeight } from './CarouselItem';

const { width: WIDTH } = Dimensions.get('window');

function wp (percentage) {
  const value = (percentage * WIDTH) / 100;
  return Math.round(value);
}

const slideWidth = wp(80);
const itemHorizontalMargin = wp(2);

export const sliderWidth = WIDTH;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const furnitures = getFurnitureData(slideHeight);
const entryBorderRadius = 8;

const CarouselAdd = ({ navigation }) => {
  const { top, bot } = getRandomFurniture();

  const topProps = furnitures.find(i => i.id === top);
  const botProps = furnitures.find(i => i.id === bot);
  topProps && delete topProps.position;
  botProps && delete botProps.position;
  const id = shortid.generate();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.navigate('Add', { data: { id, top, bot } })}
      style={{
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: itemHorizontalMargin,
          right: itemHorizontalMargin,
          bottom: 18,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 10,
          borderRadius: entryBorderRadius,
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#FFF', borderRadius: entryBorderRadius, justifyContent: 'center' }}>
        <Transition shared={topProps.id + id}>
          <Image {...topProps} style={{ ...topProps.style, opacity: 0 }} />
        </Transition>
        <Transition shared={'search-message' + id}>
          <Paragraph style={{ fontSize: 20, marginHorizontal: 20, lineHeight: 25, textAlign: 'center' }}>+ Add location</Paragraph>
        </Transition>
        <Transition shared={botProps.id + id}>
          <Image {...botProps} style={{ ...botProps.style, opacity: 0 }} />
        </Transition>
      </View>
    </TouchableOpacity>
  );
}

export default withNavigation(CarouselAdd);