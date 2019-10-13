export default function (type = 'pm25', value) {
  if (type === 'pm25') {
    if (value < 13) {
      return 'Good';
    } else if (value < 36) {
      return 'Moderate';
    } else if (value < 56) {
      return 'Unhealthy for Sensitive Groups';
    } else if (value < 151) {
      return 'Unhealthy';
    } else if (value < 251) {
      return 'Very Unhealthy';
    } else {
      return 'Hazardous';
    }
  }
}