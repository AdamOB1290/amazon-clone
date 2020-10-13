import React, { useState, useEffect } from "react";
import "./Product.css";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";
import { getTotal } from "./reducer";
import Star from "./Star";



function Product({ docId, id, title, image, price }) {
  const firebase = require("firebase");

  const [{ basket, user }, dispatch] = useStateValue();

  const [rating, setRating] = useState(0);

  const [previousRating, setPreviousRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);

  const [avgRating, setAvgRating] = useState(0);

  const [productRatings, setProductRatings] = useState([]);

  const stars = [1, 2, 3, 4, 5];

  useEffect(() => {
    
    const updateRating = () => {
      setProductRatings([])
      db.collection("products")
      .doc(docId)
      .collection("rating")
      // when cloud firestore sends a snapshot of the data, iterate through it's elements
      .onSnapshot((snapshot) =>{
        setProductRatings([])
        snapshot.docs.forEach((doc) => {
          
          setProductRatings((productRatings) => [
            ...productRatings,
            doc.data().rating,
          ]);
        })
      }
      
      );
    };

    updateRating();

    // Use an empty array as 2nd parameter of useEffect to make it execute on mount and unmount
    // thus avoiding an infinite loop
  }, []);

  let total =  getTotal(productRatings) / productRatings.length;
  console.log(getTotal(productRatings), productRatings.length);

  const addToBasket = () => {
    // dispatch the item into the data layer
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating:total,
      },
    });
  };

  const storeRating = (currentRating) => {
    setRating(currentRating);
    if (currentRating == rating) {
      setRating(0);

      db.collection("products")
        .doc(docId)
        .collection("rating")
        .doc(user.uid)
        .delete();
    } else {
      db.collection("products")
        .doc(docId)
        .collection("rating")
        .doc(user.uid)
        .set({
          rating: currentRating,
        });
    }
  };

  return (
    <div className="product">
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          {stars.map((star, i) => (
            <Star
              key={i}
              starId={i + 1}
              previousRating={previousRating}
              rating={hoverRating || total}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => storeRating(i + 1)}
            />
          ))}
          <div>({productRatings.length})</div>
        </div>
      </div>

      <img src={image} alt="" />

      <button onClick={addToBasket}>Add to Basket</button>
    </div>
  );
}

export default Product;
