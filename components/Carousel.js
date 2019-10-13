import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import CarouselItem, { sliderWidth, itemWidth } from './CarouselItem';
import CarouselAdd from './CarouselAdd';

const MyCarousel = ({ data }) => {
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(1);

  return (
    <View style={{ flex: 1, paddingTop: 20, paddingBottom: 10 }}>
      <Carousel
        ref={carouselRef}
        data={[...data, {}]}
        renderItem={({ item, index }) => index < data.length ? <CarouselItem data={item} /> : <CarouselAdd />}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        hasParallaxImages={false}
        firstItem={0}
        inactiveSlideScale={0.94}
        inactiveSlideOpacity={0.7}
        containerCustomStyle={{ overflow: 'visible' }}
        autoplay={false}
        onSnapToItem={(index) => setActiveSlide(index) }
      />
      <Pagination
        dotsLength={data.length + 1}
        activeDotIndex={activeSlide}
        containerStyle={{ paddingVertical: 8 }}
        dotColor='#ffffff'
        dotStyle={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 8 }}
        inactiveDotColor='#FFCEC8'
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        carouselRef={carouselRef}
        tappableDots={!!carouselRef}
      />
    </View>
  );
}

export default MyCarousel;