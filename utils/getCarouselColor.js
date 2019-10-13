export default function (aqi) {
  if (aqi < 51) {
    return '#f1f8e9';
  } else if (aqi < 101) {
    return '#fffde7';
  } else if (aqi < 151) {
    return '#fff3e0';
  } else if (aqi < 201) {
    return '#fbe9e7';
  } else if (aqi < 301) {
    return '#f3e5f5';
  } else if (aqi > 300) {
    return '#efebe9';
  } else {
    return '#fff';
  }
}