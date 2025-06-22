'use client';

import React from 'react';
import { Slide } from 'react-slideshow-image';

type ImageSlideshowProps = {
  images: string[];
};

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ images }) => {
  const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    arrows: true,
    autoplay: true,
    easing: 'ease',
  };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md">
      <Slide {...properties}>
        {images.map((img, index) => (
          <div key={index} className="each-slide-effect">
            <div
              className="w-full h-[350px] md:h-[950px] bg-center bg-cover"
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default ImageSlideshow;
