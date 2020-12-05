import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BannerCarousel.css";
import WindowDimensions from "./WindowDimensions";

export const BannerCarousel = () => {
  const { width } = WindowDimensions();

  //   const bannerImgLength = [1, 2, 3, 4];
  const [mobileBanner, setMobileBanner] = useState(false);
  const [amazonBanners, setAmazonBanners] = useState([
    "./amazon_banner1.jpg",
    "./amazon_banner2.jpg",
    "./amazon_banner3.jpg",
    "./amazon_banner4.jpg",
    "./amazon_banner5.jpg",
    "./amazon_banner6.jpg",
    "./amazon_banner7.jpg",
    "./amazon_banner8.jpg",
    "./amazon_banner9.jpg",
  ]);
  var settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    if (width < 768) {
      setMobileBanner(true);
      setAmazonBanners("./amazon_banner_mobile.jpg");
    } else {
      setMobileBanner(false);
      setAmazonBanners([
        "./amazon_banner1.jpg",
        "./amazon_banner2.jpg",
        "./amazon_banner3.jpg",
        "./amazon_banner4.jpg",
        "./amazon_banner5.jpg",
        "./amazon_banner6.jpg",
        "./amazon_banner7.jpg",
        "./amazon_banner8.jpg",
        "./amazon_banner9.jpg",
      ]);
    }
  }, [width]);

  return (
    <div className="background_banner_wrapper">
      {!mobileBanner ? (
        <Slider {...settings}>
          {amazonBanners?.map((image, i) => (
            <img className="home__image" src={image} alt="" key={i} />
          ))}
        </Slider>
      ) : (
        <img className="home__image" src={amazonBanners} alt="" />
      )}
    </div>
  );
};

export default BannerCarousel;
