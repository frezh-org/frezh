import getFurnitureData from '../furnitureData';
import { slideHeight } from '../components/CarouselItem';

export default function () {
  const topFurnitures = getFurnitureData(slideHeight).filter(i => i.position === 'top');
  const botFurnitures = getFurnitureData(slideHeight).filter(i => i.position === 'bottom');
  return {
    top: topFurnitures[Math.floor(Math.random()*topFurnitures.length)].id,
    bot: botFurnitures[Math.floor(Math.random()*botFurnitures.length)].id,
  }
}
