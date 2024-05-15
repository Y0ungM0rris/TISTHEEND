import Carousel from 'react-bootstrap/Carousel';
import './App.css';
import Slider_Img_1 from './assets/slider_img_1.png'
import Slider_Img_2 from './assets/slider_img_2.png'
import Slider_Img_3 from './assets/slider_img_3.png'

function UncontrolledExample() {
  return (
    <div className='SliderContainer'>
    <Carousel>
      <Carousel.Item>
      <img src={Slider_Img_1} alt="Мое изображение" className='SliderImg'/>
        <Carousel.Caption>
          <h3>Очень интересная выставка</h3>
          <p>Ну прям очень очень интересная выставка</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img src={Slider_Img_2} alt="Мое изображение" className='SliderImg'/>
        <Carousel.Caption>
          <h3>Очень интересная выставка</h3>
          <p>Ну прям очень очень интересная выставка</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img src={Slider_Img_3} alt="Мое изображение" className='SliderImg'/>
        <Carousel.Caption>
          <h3>Очень интересная выставка</h3>
          <p>
            Ну прям очень очень интересная выставка
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </div>
  );
}

export default UncontrolledExample;