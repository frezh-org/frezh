function getRadius(lat, lng, lngDelta) {
  const lngRadius = lngDelta * 1000;
  // console.log('lngRadius', lngRadius)
  const radius = getDistanceBetweenPoints(
    { lat: lat, lng: lng - lngRadius / 2 },
    { lat: lat, lng: lng + lngRadius / 2 } ,
  );
  // console.log('radius', radius);
  return radius;
}

function getDistanceBetweenPoints(point1, point2) {
  const earthRadius = 6371;
  const [dLat, dLng] = [
      degToRadians(point2.lat - point1.lat),
      degToRadians(point2.lng - point1.lng)
  ];
  const  a =
      Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
      Math.cos(degToRadians(point1.lat)) * Math.cos(degToRadians(point2.lat)) *
      Math.sin( dLng / 2 ) * Math.sin( dLng / 2 );
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt( 1 - a ));
  return Math.abs(( earthRadius * c ) * 350);
}

function degToRadians(deg) {
 return deg * ( Math.PI / 180 );
}

export default getRadius;
