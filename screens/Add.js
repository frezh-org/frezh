import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import { IconButton, Paragraph, Caption, Title, Button, TouchableRipple } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import Modalize from 'react-native-modalize';
import { useStoreState } from 'easy-peasy';

import getFurnitureData from '../furnitureData';
import { slideHeight } from '../components/CarouselItem';
import fetchApi from '../utils/fetchApi';

const furnitures = getFurnitureData(slideHeight);

const { height } = Dimensions.get('window');

const Add = ({ navigation }) => {
  const data = navigation.getParam('data', null);
  const [page, setPage] = useState(1);
  const [state, setState] = useState({
    data: [],
    loading: false,
    lastPage: 1,
  });
  const [countryState, setCountryState] = useState({
    list: [],
    loading: false,
    selected: [],
  });
  const filterRef = useRef(null);
  const userLocation = useStoreState(state => state.locations.userLocation);
  const selectedLocation = useStoreState(state => state.locations.items);

  if (!data) {
    return null;
  }

  const topProps = furnitures.find(i => i.id === data.top);
  const botProps = furnitures.find(i => i.id === data.bot);
  topProps && delete topProps.position;
  botProps && delete botProps.position;

  const handleFetch = async p => {
    setState({ ...state, loading: true, data: p === 1 ? [] : state.data });
    try {
      let params = {
        parameter: ['pm25'],
        country: countryState.selected.map(item => item.code),
        limit: 50,
        page: p,
      };
      if (userLocation.latitude !== 0) {
        // The results show China locations so turned off for now.
        // params.order_by = 'distance';
        // params.coordinates = `${userLocation.latitude},${userLocation.longitude}`;
        // params.radius = 99999999;
      };
      const result = await fetchApi({
        endpoint: '/locations',
        params,
      });
      if (result.status === 200) {
        setState({
          ...state,
          loading: false,
          data: p === 1 ? result.data.results : [...state.data, ...result.data.results],
          lastPage: Math.ceil(result.data.meta.found / 50),
        });
      } else {
        setState({ ...state, loading: false });
        console.log(result);
      }
    } catch (error) {
      setState({ ...state, loading: false });
      console.log(error);
    }
  }

  const handleFetchCountry = async () => {
    setCountryState({ ...countryState, loading: true, list: [] });
    try {
      const result = await fetchApi({ endpoint: '/countries' });
      if (result.status === 200) {
        setCountryState({ ...countryState, loading: false, list: result.data.results });
      } else {
        setCountryState({ ...countryState, loading: false });
        console.log(result);
      }
    } catch (error) {
      setCountryState({ ...countryState, loading: false });
      console.log(error);
    }
  }

  const handleLoadMore = () => {
    if (page < state.lastPage) {
      setPage(page + 1);
      handleFetch(page + 1);
    }
  }

  useEffect(() => {
    handleFetch(1);
    handleFetchCountry();
  }, []);

  useEffect(() => {
    handleFetch(1);
  }, [countryState.selected]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Transition shared={topProps.id + data.id}>
        <Image {...topProps} style={{ ...topProps.style, opacity: 0 }} />
      </Transition>
      <View style={{ paddingHorizontal: 20, marginTop: 40, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title style={{ fontSize: 23, color: '#333333' }}>Select locations</Title>
        <Button
          onPress={() => filterRef.current.open()}
          color='#333333'
          labelStyle={{ fontSize: 16 }}
          icon='filter-outline'
        >
          Filter
        </Button>
      </View>
      <FlatList
        data={state.data.filter(item => !selectedLocation.find(i => i.location === item.location))}
        keyExtractor={item => item.id}
        contentContainerStyle={{ minHeight: height - 100 }}
        ListEmptyComponent={state.loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Paragraph style={{ fontSize: 18 }}>Loading...</Paragraph>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Paragraph style={{ fontSize: 18 }}>No location found</Paragraph>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableRipple onPress={() => navigation.navigate('AddConfirm', { data: {...data, location: item.location} })}>
            <View style={{ display: 'flex', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
              <Paragraph style={{ fontSize: 16 }}>{item.location}</Paragraph>
              <Paragraph style={{ fontSize: 14 }}>{item.count} measurements</Paragraph>
            </View>
          </TouchableRipple>
        )}
        onEndReachedThreshold={0.5}
        initialNumToRender={50}
        onEndReached={handleLoadMore}
      />
      <Transition shared={botProps.id + data.id}>
        <Image {...botProps} style={{ ...botProps.style, opacity: 0 }} />
      </Transition>
      <IconButton
        style={{ position: 'absolute', bottom: 40, left: 40, backgroundColor: '#fff' }}
        color='#333'
        icon={props => <Feather {...props} name='arrow-left' />}
        onPress={() => navigation.goBack()}
      />
      <Modalize
        ref={filterRef}
        // modalHeight={height / 2}
        // handlePosition='inside'
        HeaderComponent={<View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <Title style={{ fontSize: 22 }}>Filter location</Title>
        </View>}
        sectionListProps={{
          renderSectionHeader: ({ section: { title } }) => (
            <View style={{ paddingHorizontal: 20, backgroundColor: '#eee' }}>
              <Title style={{ fontSize: 16, fontFamily: 'amatic-sc-bold' }}>{title}</Title>
            </View>
          ),
          ListEmptyComponent: countryState.loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Paragraph style={{ fontSize: 18 }}>Loading...</Paragraph>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Paragraph style={{ fontSize: 18 }}>No country found</Paragraph>
            </View>
          ),
          sections: [
            {
              title: 'Countries',
              data: countryState.list.filter(item => item.name),
            },
          ],
          stickySectionHeadersEnabled: true,
          renderItem: ({ item }) => (
            <TouchableRipple
              onPress={() => {
                setPage(1);
                setCountryState({
                  ...countryState,
                  selected: countryState.selected.find(i => i.code === item.code)
                    ? countryState.selected.filter(i => i.code === item.code)
                    : [item, ...countryState.selected],
                });
                filterRef.current.close();
              }}
            >
              <View style={{ display: 'flex', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                <Paragraph style={{ fontSize: 16 }}>{item.name}</Paragraph>
                {countryState.selected.find(i => i.code === item.code) && <Feather name='check' />}
              </View>
            </TouchableRipple>
          ),
          keyExtractor: item => item.code,
          showsVerticalScrollIndicator: false,
        }}
      />
    </View>
  );
}

export default Add;
