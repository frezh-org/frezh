import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import moment from 'moment';

import getValueColor from '../utils/getValueColor';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const Chart = ({ measurements }) => {
  const color = measurements.length > 0
    ? getValueColor('pm25', measurements[0].value, 0.2)
    : '#fff';

  const data = [...measurements].reverse();
  return (
    <LineChart
      data={{
        labels: data.map(i => moment(i.date.local).format('HH:mm')),
        datasets: [{
          data: data.map(i => i.value)
        }],
      }}
      height={HEIGHT / 4}
      width={WIDTH - 20}
      // withInnerLines={false}
      withOuterLines={false}
      // withHorizontalLabels={false}
      // withVerticalLabels={false}
      withShadow={false}
      chartConfig={{
        backgroundColor: color,
        backgroundGradientFrom: color,
        backgroundGradientTo: color,
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
      }}
      bezier
    />
  );
}

export default Chart;