'use client';

import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

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
    <div className="w-full overflow-hidden">
      <Slide {...properties}>
        {images.map((img, index) => (
          <div key={index} className="flex justify-center items-center bg-black">
            <img
              src={img}
              alt={`slide-${index}`}
              className="w-full max-h-[350px] md:max-h-[650px] object-contain"
            />
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default ImageSlideshow;
