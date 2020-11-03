import React, { useState, useEffect } from "react";
import Product from "./Product";
import Slider from "react-slick";
import { db } from "./firebase";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const SlickCarousel = () => {
  const [products, setProducts] = useState([]);
  const currentProducts = products.slice(9, 18);
  var settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 810,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 490,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    db.collection("products")
      .orderBy("id", "asc")
      // when cloud firestore sends a snapshot of the data, iterate through it's elements
      .onSnapshot((snapshot) =>
        // map the content of each element to the defined properties
        setProducts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  return (
    <Slider {...settings}>
      {currentProducts?.map((product, i) => (
        <Product
          key={i}
          docId={product.id}
          id={product.data.id}
          title={product.data.title}
          price={product.data.price}
          rating={product.data.rating}
          image={product.data.image}
        />
      ))}
    </Slider>
  );
};

export default SlickCarousel;
