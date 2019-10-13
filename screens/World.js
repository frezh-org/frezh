import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { useStoreState } from 'easy-peasy';
import { Dimensions, View } from 'react-native';
import { Paragraph, Caption } from 'react-native-paper';
import axios from 'axios';
import moment from 'moment';

import mapStyle from '../mapStyle.json';
import getBoundaries from '../utils/getBoundaries';
import fetchApi from '../utils/fetchApi';
import getValueColor from '../utils/getValueColor';
import getRadius from '../utils/getRadius';

const { width, height } = Dimensions.get('window');

const World = () => {
  const userLocation = useStoreState(state => state.locations.userLocation);
  const [state, setState] = useState({ loading: false, data: [] });
  const [isDragging, setIsDragging] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 9.22,
    longitudeDelta: 9.22 * (width / height),
  });

  const getStationData = async (region) => {
    if (isDragging) {
      setIsDragging(false);
    } else if (!isDragging && state.data.length === 0) {
      // force fetch
    } else {
      return;
    }
    setState({ ...state, loading: true });
    try {
      const radius = getRadius(region.latitude, region.longitude, region.longitudeDelta);
      const coordinates = `${region.latitude},${region.longitude}`;
      const result = await fetchApi({
        endpoint: `/latest`,
        params: {
          parameter: 'pm25',
          coordinates,
          radius,
          limit: 1000,
        },
        // cancelToken: source.token,
      });
      if (result.status === 200) {
        setState({
          loading: false,
          data: [
            ...state.data.filter(item => !result.data.results.find(i => item.location === i.location)),
            ...result.data.results,
          ],
        });
      } else {
        // console.log(result);
        setState({ ...state, loading: false });
      }
    } catch (error) {
      // console.log(error)
      setState({ ...state, loading: false });
    }
  }

  const handleRegionChange = async region => {
    setMapRegion(region);
  }

  useEffect(() => {
    // const source = axios.CancelToken.source();
    getStationData(mapRegion);
    // return function cleanup() {
    //   source.cancel();
    // }
  }, [mapRegion]);

  // useEffect(() => {
  //   if (userLocation.latitude !== mapRegion.latitude || userLocation.longitude !== mapRegion.longitude) {
  //     const region = {
  //       latitude: userLocation.latitude,
  //       longitude: userLocation.longitude,
  //       latitudeDelta: 9.22,
  //       longitudeDelta: 9.22 * (width / height),
  //     };
  //     setIsDragging(true);
  //     setMapRegion(region);
  //   }
  // }, [userLocation]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        onPanDrag={() => !isDragging && setIsDragging(true)}
        // region={mapRegion}
        onRegionChangeComplete={handleRegionChange}
        style={{ flex: 1 }}
        initialRegion={mapRegion}
        provider={MapView.PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
      >
        {state.data && state.data
          .map(item => (
            <Marker
              key={item.location}
              coordinate={{ latitude: item.coordinates.latitude, longitude: item.coordinates.longitude }}
              title={item.location}
              description={`Last reading ${item.measurements[0].value} ${item.measurements[0].unit} at ${moment(item.measurements[0].lastUpdated).format('LT L')}`}
              tracksViewChanges={false}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: getValueColor('pm25', item.measurements[0].value),
                  backgroundColor: getValueColor('pm25', item.measurements[0].value, 0.5),
                }}
              />
            </Marker>
          ))}
      </MapView>
      <View
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 20,
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderRadius: 5,
        }}
      >
        <Paragraph style={{ fontSize: 16 }}>Showing the most recent values for PM2.5</Paragraph>
        <View style={{
          marginTop: 10,
          height: 40,
          flexDirection: 'row',
          width: '100%',
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ height: 20, backgroundColor: getValueColor('pm25', 0) }} />
            <Caption>0µg/m³</Caption>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ height: 20, backgroundColor: getValueColor('pm25', 12.2) }} />
            <Caption>12.2</Caption>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ height: 20, backgroundColor: getValueColor('pm25', 24.4) }} />
            <Caption>24.4</Caption>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ height: 20, backgroundColor: getValueColor('pm25', 36.7) }} />
            <Caption>36.7</Caption>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ height: 20, backgroundColor: getValueColor('pm25', 48.9) }} />
            <Caption>48.9</Caption>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ height: 20, backgroundColor: getValueColor('pm25', 61.1) }} />
            <Caption>61.1</Caption>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ height: 20, backgroundColor: getValueColor('pm25', 73.3) }} />
            <Caption>73.3</Caption>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ height: 20, backgroundColor: getValueColor('pm25', 85.6) }} />
            <Caption>85.6</Caption>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ height: 20, backgroundColor: getValueColor('pm25', 97.8) }} />
            <Caption>97.8+</Caption>
          </View>
        </View>
      </View>
      {state.loading && (
        <Paragraph style={{
          fontSize: 18,
          position: 'absolute',
          top: 40,
          right: 20,
        }}>
          Processing...
        </Paragraph>
      )}
    </View>
  );
}

export default World;
