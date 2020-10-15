import React, { useState, useEffect } from "react";
import "./ProductDetails.css";
import Product from "./Product";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";
import { getStarTotal } from "./reducer";
import Star from "./Star";
import { useLocation } from "react-router-dom";
import Magnifier from "react-magnifier";
import { Rating } from "@material-ui/lab";
import Box from "@material-ui/core/Box";
import StarIcon from "@material-ui/icons/Star";
const faker = require("faker");

function ProductDetails() {
  const location = useLocation();

  const [rootUrl, setRootUrl] = useState("http://localhost:3000/");

  const [productId, setProductId] = useState(location.pathname.split("/")[2]);

  const [product, setProduct] = useState([]);

  const firebase = require("firebase");

  const [{ basket, user }, dispatch] = useStateValue();

  const [rating, setRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);

  const [productRatings, setProductRatings] = useState([]);

  const [userRating, setUserRating] = useState(null);

  const [percentRating, setPercentRating] = useState({ width: "65%" });

  const stars = [1, 2, 3, 4, 5];

  useEffect(() => {
    db.collection("products")
      // get the specific product
      .doc(productId)
      .onSnapshot((snapshot) => {
        setProduct(snapshot.data());
      });

    const updateRating = () => {
      setProductRatings([]);
      db.collection("products")
        // get the specific product
        .doc(productId)
        .collection("rating")
        // when cloud firestore sends a snapshot of the data, iterate through it's elements
        .onSnapshot((snapshot) => {
          // reset the array
          setProductRatings([]);
          //   loop over each user who rated the product
          snapshot.docs.forEach((doc) => {
            //   add all the ratings to the array
            setProductRatings((productRatings) => [
              ...productRatings,
              doc.data().rating,
            ]);
            // if we find the user rating of the session user
            if (doc.id == user?.uid) {
              // add his rating to the variable
              setUserRating(doc.data().rating);
            }
          });
        });
    };

    updateRating();

    // Use an empty array as 2nd parameter of useEffect to make it execute on mount and unmount
    // thus avoiding an infinite loop
  }, [user]);
  let avgRating = getStarTotal(productRatings) / productRatings.length;

  const storeRating = (currentRating) => {
    setRating(currentRating);
    if (currentRating == rating) {
      setRating(0);
      db.collection("products")
        .doc(productId)
        .collection("rating")
        .doc(user?.uid)
        .delete();
    } else {
      db.collection("products")
        .doc(productId)
        .collection("rating")
        .doc(user?.uid)
        .set({
          rating: currentRating,
        });
    }
  };

  return (
    <div>
      <div className="max-w-10/12 product__wrapper bg-white w-content p-10 flex justify-center mx-auto">
        <div className="product__img__wrapper w-4/12">
          <Magnifier src={rootUrl + product.image} />
          <hr />
          <p className="mt-4 text-center text-xl hover:text-orange-600 cursor-pointer">
            Rate this product
            <i className="fas fa-angle-down align-middle ml-2"></i>{" "}
          </p>
        </div>
        <div className="product__detail__wrapper w-8/12">
          <h1 className=" text-4xl mb-3">{product.title}</h1>
          <div className="product__rating mb-3">
            <span>avg :</span>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Rating
                name="half-rating-read"
                value={avgRating}
                precision={0.5}
                size="large"
                readOnly
              />
            </Box>
            <span>userRating:</span>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Rating
                name="simple-controlled"
                value={userRating}
                precision={0.5}
                onChange={(event, newValue) => {
                  setUserRating(newValue);
                  if (newValue == null) {
                    db.collection("products")
                      .doc(productId)
                      .collection("rating")
                      .doc(user?.uid)
                      .delete();
                  } else {
                    db.collection("products")
                      .doc(productId)
                      .collection("rating")
                      .doc(user?.uid)
                      .set({
                        rating: newValue,
                      });
                  }
                }}
              />
            </Box>
            <span>(userRating : {userRating})</span>
          </div>
          <hr />
          <p className="product__price text-2xl mb-5">
            <small>$</small>
            <strong>{product.price}</strong>
          </p>
          <button className="w-full mt-2 bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-2 px-4 rounded btn_inner_shadow border border-black">
            Add To Basket
          </button>
          <div className="mt-8">
            <h1 className="text-xl">Description:</h1>
            <span className="break-all">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio
              officiis enim, atque accusamus debitis et ea commodi recusandae
              minus modi deleniti. Numquam recusandae asperiores unde doloremque
              excepturi velit odio a provident accusantium quae. Ad, nihil.{" "}
            </span>
          </div>
        </div>
      </div>

      <div className=" py-3 reviews__wrapper w-full bg-white mt-10 flex justify-center flex-col">
        <div className="header__reviews px-20 pb-4 flex justify-between items-center border-b border-gray-400 ">
          <h1 className="text-3xl">User Reviews</h1>
          <span className="text-orange-400 font-semibold text-xl">
            Read More <i className="fas fa-angle-right align-middle ml-2"></i>
          </span>
        </div>
        <div className="body__reviews flex px-20 mt-5">
          <div className="ratings">
            <h1 className="text-lg font-semibold ">
              Ratings <span className="text-sm">({productRatings.length})</span>
            </h1>
            <div className="rating__breakdown__wrapper ">
              <div className="rating__block my-5 flex flex-col items-center justify-center bg-gray-300 bg-opacity-50 p-10">
                <span className="text-orange-400 font-semibold text-xl">
                  {avgRating}/5
                </span>
                <Box component="fieldset" mb={3} borderColor="transparent">
                  <Rating
                    name="half-rating-read"
                    value={avgRating}
                    precision={0.5}
                    readOnly
                  />
                </Box>
                <span>{productRatings.length} review</span>
              </div>
              <ul className="rating__breakdown mb-5">
                <li className="flex items-center">
                  <strong className="mr-2">5</strong>
                  <StarIcon style={{ fontSize: 20, color: "FFB400" }} />
                  <div className="shadow w-full bg-grey-light mt-2 rounded-full ml-2">
                    <div
                      className="bg-orange-400 text-xs leading-none h-full text-center rounded-full text-white"
                      style={percentRating}
                    >
                      65%
                    </div>
                  </div>
                </li>
                <li className="flex items-center">
                  <strong className="mr-2">4</strong>
                  <StarIcon style={{ fontSize: 20, color: "FFB400" }} />
                  <div className="shadow w-full bg-grey-light mt-2 rounded-full ml-2">
                    <div
                      className="bg-orange-400 text-xs leading-none h-full text-center rounded-full text-white"
                      style={percentRating}
                    >
                      65%
                    </div>
                  </div>
                </li>
                <li className="flex items-center">
                  <strong className="mr-2">3</strong>
                  <StarIcon style={{ fontSize: 20, color: "FFB400" }} />
                  <div className="shadow w-full bg-grey-light mt-2 rounded-full ml-2">
                    <div
                      className="bg-orange-400 text-xs leading-none h-full text-center rounded-full text-white"
                      style={percentRating}
                    >
                      65%
                    </div>
                  </div>
                </li>
                <li className="flex items-center">
                  <strong className="mr-2">2</strong>
                  <StarIcon style={{ fontSize: 20, color: "FFB400" }} />
                  <div className="shadow w-full bg-grey-light mt-2 rounded-full ml-2">
                    <div
                      className="bg-orange-400 text-xs leading-none h-full text-center rounded-full text-white"
                      style={percentRating}
                    >
                      65%
                    </div>
                  </div>
                </li>
                <li className="flex items-center">
                  <strong className="mr-2">1</strong>
                  <StarIcon style={{ fontSize: 20, color: "FFB400" }} />
                  <div className="shadow w-full bg-grey-light mt-2 rounded-full ml-2">
                    <div
                      className="bg-orange-400 text-xs leading-none h-full text-center rounded-full text-white"
                      style={percentRating}
                    >
                      65%
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="ratings">
            <h1>reviews</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
