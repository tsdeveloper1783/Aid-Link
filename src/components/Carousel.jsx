import React from "react";
import Slider from "react-slick";

// react-slick ke styles already tumne style.css se import kar liye hain 👍

const Carousel = () => {
  const settings = {
    dots: true,           // neeche dots show honge
    infinite: true,       // loop chalta rahega
    speed: 500,           // animation speed
    slidesToShow: 3,      // ek waqt me kitne slides dikhne
    slidesToScroll: 1,    // scroll hone par kitne slides move hon
    autoplay: true,       // auto move kare
    autoplaySpeed: 2000,  // har 2s me move kare
    arrows: true,         // next/prev arrows
  };

  return (
    <div style={{ width: "80%", margin: "0 auto", padding: "40px 0" }}>
      <h2 className="text-center text-xl font-bold mb-4">React Slick Carousel</h2>
      <Slider {...settings}>
        <div><img src="https://picsum.photos/400/200?random=1" alt="1" /></div>
        <div><img src="https://picsum.photos/400/200?random=2" alt="2" /></div>
        <div><img src="https://picsum.photos/400/200?random=3" alt="3" /></div>
        <div><img src="https://picsum.photos/400/200?random=4" alt="4" /></div>
        <div><img src="https://picsum.photos/400/200?random=5" alt="5" /></div>
      </Slider>
    </div>
  );
};

export default Carousel;
