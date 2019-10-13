import React, { useEffect, useState } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import { Paragraph } from 'react-native-paper';

import majorCities from '../majorCities';
import fetchApi from '../utils/fetchApi';
import getValueColor from '../utils/getValueColor';

const Ranking = () => {
  const [state, setState] = useState({
    loading: false,
    refreshing: false,
    data: [],
  });

  const getCityValue = async (cityName) => {
    try {
      const result = await fetchApi({ endpoint: `/latest`, params: {
        city: cityName,
        parameter: 'pm25',
      } });
      if (result.status === 200) {
        if (result.data.results.length > 0 && result.data.results[0].measurements.length > 0) {
          return result.data.results[0].measurements[0].value;
        } else {
          return null;
        }
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const queryRanking = async () => {
    setState({ ...state, loading: true });
    const data = await Promise.all(majorCities.map(async city => ({
      ...city,
      value: await getCityValue(city.name),
    })));
    setState({ ...state, loading: false, data });
  }

  const refreshRanking = async () => {
    setState({ ...state, refreshing: true });
    const data = await Promise.all(majorCities.map(async city => ({
      ...city,
      value: await getCityValue(city.name),
    })));
    setState({ ...state, refreshing: false, data });
  }

  useEffect(() => {
    queryRanking();
  }, []);

  return (
    <FlatList
      data={state.data.filter(i => i.value).sort((a, b) => b.value - a.value)}
      keyExtractor={i => i.name}
      contentContainerStyle={{ paddingTop: 40, paddingHorizontal: 20, minHeight: '100%' }}
      ListHeaderComponent={<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
        <Paragraph style={{ fontSize: 18, marginLeft: 42 }}>Major cities</Paragraph>
        <Paragraph style={{ fontSize: 18 }}>PM2.5 (µg/m³)</Paragraph>
      </View>}
      refreshControl={
        <RefreshControl refreshing={state.refreshing} onRefresh={refreshRanking} />
      }
      ListEmptyComponent={state.loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Paragraph style={{ fontSize: 18 }}>Processing...</Paragraph>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Paragraph style={{ fontSize: 18 }}>No result</Paragraph>
        </View>
      )}
      renderItem={({ item, index }) => (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Paragraph style={{ fontSize: 18, marginRight: 20 }}># {('0' + (index + 1)).slice(-2)}</Paragraph>
            <Paragraph style={{ fontSize: 18 }}>{item.name}, {item.country}</Paragraph>
          </View>
          <View style={{
            width: 35,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 3,
            backgroundColor: getValueColor('pm25', item.value, 0.5),
          }}>
            <Paragraph
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: '#333',
              }}
            >
              {item.value}
            </Paragraph>
          </View>
        </View>
      )}
    />
  );
}

export default Ranking;
