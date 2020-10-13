import React, { useState } from "react";
import "./Product.css";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";

const Star = ({starId, previousRating, rating, onMouseEnter, onMouseLeave, onClick }) => {
  let styleClass = "star-rating-blank";
  if ( rating >= starId) {
    styleClass = "star-rating-filled";
  }

  return (
    <div
      className={" star"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <svg
        id={'starSvg'+starId}
        height="55px"
        width="53px"
        className={styleClass}
        viewBox="0 0 25 23"
        data-rating="1"
      >
        <polygon
          strokeWidth="0"
          points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78"
        />
      </svg>
    </div>
  );
};


function Product({ docId, id, title, image, price }) {

  const firebase = require('firebase');

  const [{ basket, user }, dispatch] = useStateValue();

  const [rating, setRating] = useState(0);

  const [previousRating, setPreviousRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);

  const stars = [1,2,3,4,5];

  const addToBasket = () => {
    // dispatch the item into the data layer
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating: rating,
      },
    });
  };

  const storeRating = (currentRating) => {
    
    setPreviousRating(rating)
    setRating(currentRating)
    if (currentRating == rating) {

      setRating(0)

      // db.collection('products').doc(docId).update({
      //   rating: firebase.firestore.FieldValue.arrayRemove(dataRating),
      // })

    } else {
      db.collection('products').doc(docId).collection('rating').doc(user.uid).set({
        rating: currentRating
      })
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
                starId={i+1}
                previousRating = {previousRating}
                rating={hoverRating || rating}
                onMouseEnter={() => setHoverRating(i+1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => storeRating(i+1)}
              />
            ))}
        </div>
      </div>

      <img src={image} alt="" />

      <button onClick={addToBasket}>Add to Basket</button>
    </div>
  );
}

export default Product;
