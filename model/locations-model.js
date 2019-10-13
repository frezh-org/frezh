import { action } from 'easy-peasy';

const locationsModel = {
  items: [],
  userLocation: {
    latitude: 37.78825,
    longitude: -122.4324,
  },
  setUserLocation: action((state, payload) => ({
    ...state,
    userLocation: payload,
  })),
  addLocation: action((state, payload) => ({
    ...state,
    items: [...state.items, payload],
  })),
  setMeasurements: action((state, payload) => ({
    ...state,
    items: state.items.map(item => item.id === payload.id
      ? { ...item, measurements: payload.measurements, updatedAt: new Date() }
      : item),
  })),
  removeLocation: action((state, payload) => ({
    ...state,
    items: state.items.filter(item => item.id !== payload),
  })),
};

export default locationsModel;
