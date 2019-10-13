export default function (type, value, opacity = 1) {
  if (type === 'pm25') {
    if (value < 12.2) {
      return `rgba(11, 117, 169, ${opacity})`;
    } else if (value < 24.4) {
      return `rgba(32, 181, 187, ${opacity})`;
    } else if (value < 36.7) {
      return `rgba(143, 212, 217, ${opacity})`;
    } else if (value < 48.9) {
      return `rgba(191, 230, 236, ${opacity})`;
    } else if (value < 61.1) {
      return `rgba(227, 240, 217, ${opacity})`;
    } else if (value < 73.3) {
      return `rgba(246, 225, 158, ${opacity})`;
    } else if (value < 85.6) {
      return `rgba(250, 173, 91, ${opacity})`;
    } else if (value < 97.8) {
      return `rgba(243, 109, 60, ${opacity})`;
    } else {
      return `rgba(217, 49, 39, ${opacity})`;
    }
  }
}