import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Product.css";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";
import { getStarTotal } from "./reducer";
import Star from "./Star";
import { Rating } from "@material-ui/lab";
import Box from "@material-ui/core/Box";

function Product({ docId, id, title, image, price }) {
  const history = useHistory();

  const [{ user }, dispatch] = useStateValue();

  const [rating, setRating] = useState(0);

  const [previousRating, setPreviousRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);

  const [productRatings, setProductRatings] = useState([]);

  const stars = [1, 2, 3, 4, 5];

  useEffect(() => {
    const updateRating = () => {
      setProductRatings([]);
      db.collection("products")
        .doc(docId)
        .collection("review_rating")
        // when cloud firestore sends a snapshot of the data, iterate through it's elements
        .onSnapshot((snapshot) => {
          setProductRatings([]);
          snapshot.docs.forEach((doc) => {
            setProductRatings((productRatings) => [
              ...productRatings,
              doc.data().rating,
            ]);
          });
        });
    };

    updateRating();

    // Use an empty array as 2nd parameter of useEffect to make it execute on mount and unmount
    // thus avoiding an infinite loop
  }, []);

  let avgRating = getStarTotal(productRatings) / productRatings.length;
  // console.log(getStarTotal(productRatings), productRatings.length);

  const addToBasket = () => {
    // dispatch the item into the data layer
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating: avgRating,
      },
    });
  };

  const goToProduct = () => {
    // console.log(docId, id, title, image, price);
    history.push({
      pathname: "/product/" + docId,
      state: { docId, id, title, image, price },
    });
  };

  return (
    <div className="product">
      <div className="product__info">
        <p
          className="cursor-pointer hover:text-orange-600"
          onClick={goToProduct}
        >
          {title}
        </p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          <Box component="fieldset" mb={3} borderColor="transparent">
            <Rating
              name="half-rating-read"
              value={avgRating}
              precision={0.5}
              readOnly
            />
          </Box>
          <div>({productRatings.length})</div>
        </div>
      </div>

      <img
        className="cursor-pointer"
        onClick={goToProduct}
        src={image}
        alt=""
      />

      <button onClick={addToBasket}>Add to Basket</button>
    </div>
  );
}

export default Product;
