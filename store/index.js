import { createStore } from 'easy-peasy';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import storeModel from '../model';

const store = createStore(storeModel, {
  disableImmer: true,
  reducerEnhancer: reducer => persistReducer(
    {
      key: 'com.buiquockhanh.frezh',
      storage: AsyncStorage,
    },
    reducer,
  ),
});

export const persistor = persistStore(store);

export default store;
