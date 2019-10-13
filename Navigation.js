import React from 'react';
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createStackNavigator } from 'react-navigation-stack';
import { Feather } from '@expo/vector-icons';
import { createFluidNavigator } from 'react-navigation-fluid-transitions';

import HomeScreen from './screens/Home';
import WorldScreen from './screens/World';
import RankingScreen from './screens/Ranking';
import DetailScreen from './screens/Detail';
import AboutScreen from './screens/About';
import AddScreen from './screens/Add';
import AddConfirmScreen from './screens/AddConfirm';

const AppTab = createMaterialBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => <Feather name='map-pin' color={tintColor} size={21} />,
    },
  },
  World: {
    screen: WorldScreen,
    navigationOptions: {
      title: 'World',
      tabBarIcon: ({ tintColor }) => <Feather name='map' color={tintColor} size={21} />,
    },
  },
  Ranking: {
    screen: RankingScreen,
    navigationOptions: {
      title: 'Ranking',
      tabBarIcon: ({ tintColor }) => <Feather name='bar-chart-2' color={tintColor} size={21} />,
    },
  },
}, {
  shifting: true,
  keyboardHidesNavigationBar: false,
  activeTintColor: '#333333',
  inactiveTintColor: '#FFCEC8',
  barStyle: { backgroundColor: '#fff' },
});

const AppStack = createFluidNavigator({
  Tab: {
    screen: AppTab,
    navigationOptions: {
      header: null,
    },
  },
  Detail: {
    screen: DetailScreen,
    navigationOptions: {
      header: null,
    },
  },
  Add: {
    screen: AddScreen,
    navigationOptions: {
      header: null,
    },
  },
  AddConfirm: {
    screen: AddConfirmScreen,
    navigationOptions: {
      header: null,
    },
  },
  About: {
    screen: AboutScreen,
    navigationOptions: {
      header: null,
    },
  },
});

export default createAppContainer(AppStack);
