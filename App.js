import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { Provider as PaperProvider, Headline } from 'react-native-paper';
import { StoreProvider } from 'easy-peasy';
import { PersistGate } from "redux-persist/integration/react";
import { Asset } from 'expo-asset';
// import * as Sentry from 'sentry-expo';

import theme from './theme';
import Navigation from './Navigation';
import store, { persistor } from './store';
import getFurnitures from './furnitureData';
import { slideHeight } from './components/CarouselItem';

// Sentry.init({
//   dsn: 'DSN',
//   enableInExpoDevelopment: true,
//   debug: false,
// });

const furnitures = getFurnitures(slideHeight);

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const loadAssets = async () => {
    await Font.loadAsync({
      'amatic-sc-bold': require('./assets/fonts/AmaticSC-Bold.ttf'),
      'amatic-sc-regular': require('./assets/fonts/AmaticSC-Regular.ttf'),
    });
    await Asset.loadAsync(furnitures.map(item => item.source));
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadAssets}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    )
  }

  return (
    <PersistGate loading={null} persistor={persistor}>
      <StoreProvider store={store}>
        <PaperProvider theme={theme}>
          <>
            <Navigation />
            <StatusBar
              barStyle='dark-content'
              translucent
            />
          </>
        </PaperProvider>
      </StoreProvider>
    </PersistGate>
  );
}
