import React, { useState, useEffect, useRef } from "react";
import "./ProductDetails.css";
import RatingBar from "./RatingBar";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";
import { getStarTotal } from "./reducer";
import { useLocation } from "react-router-dom";
import Magnifier from "react-magnifier";
import { Rating } from "@material-ui/lab";
import Box from "@material-ui/core/Box";
import Reviews from "./Reviews";
import Tooltip from "@material-ui/core/Tooltip";

const faker = require("faker");

function ProductDetails() {
  const location = useLocation();

  const [rootUrl, setRootUrl] = useState("http://localhost:3000/");

  const [productId, setProductId] = useState(location.pathname.split("/")[2]);

  const [product, setProduct] = useState([]);

  const firebase = require("firebase");

  const [{ user }, dispatch] = useStateValue();

  const [productRatings, setProductRatings] = useState([]);

  const [userRating, setUserRating] = useState(0);

  const [review, setReview] = useState("");

  const [validationError, setValidationError] = useState(false);

  const avgRating = useRef(null);

  const [starHover, setStarHover] = useState(-1);

  const [reviewed, setReviewed] = useState(true);

  const starLabels = {
    0.5: 0.5 + " ★",
    1: 1 + " ★",
    1.5: 1.5 + " ★",
    2: 2 + " ★",
    2.5: 2.5 + " ★",
    3: 3 + " ★",
    3.5: 3.5 + " ★",
    4: 4 + " ★",
    4.5: 4.5 + " ★",
    5: 5 + " ★",
  };

  useEffect(() => {
    db.collection("products")
      // get the specific product
      .doc(productId)
      .onSnapshot((snapshot) => {
        setProduct(snapshot.data());
      });

    updateRating(productId);
    if (
      location?.state?.productRatings != undefined &&
      location?.state?.productRatings != ""
    ) {
      setProductRatings(location?.state?.productRatings);
    }
    // Use an empty array as 2nd parameter of useEffect to make it execute on mount and unmount
    // thus avoiding an infinite loop
  }, [user, productId]);

  if (location?.state?.docId && location?.state?.docId != productId) {
    setProductId(location?.state?.docId);
  }

  const pushAvgRating = (productIdParam, avgRating) => {
    db.collection("products")
      // get the specific product
      .doc(productIdParam)
      .update({
        avgRating: avgRating,
      });
  };
  if (productRatings) {
    avgRating.current = getStarTotal(productRatings) / productRatings.length;
  }

  if (isNaN(avgRating.current)) {
    avgRating.current = 0;
  }

  pushAvgRating(productId, avgRating.current);

  let oneStarPct = 0;
  let twoStarsPct = 0;
  let threeStarsPct = 0;
  let fourStarsPct = 0;
  let fiveStarsPct = 0;
  let oneStar = 0;
  let twoStars = 0;
  let threeStars = 0;
  let fourStars = 0;
  let fiveStars = 0;
  const sortRating = (ratings) => {
    let totalStars = ratings.length;

    ratings.forEach((rating) => {
      switch (rating) {
        case 0.5:
          oneStar++;
          break;
        case 1:
          oneStar++;
          break;
        case 1.5:
          twoStars++;
          break;
        case 2:
          twoStars++;
          break;
        case 2.5:
          threeStars++;
          break;
        case 3:
          threeStars++;
          break;
        case 3.5:
          fourStars++;
          break;
        case 4:
          fourStars++;
          break;
        case 4.5:
          fiveStars++;
          break;
        case 5:
          fiveStars++;
          break;
        case null:
          console.log("null");
          break;
        default:
          console.log("no match found");
      }
    });

    oneStarPct = (oneStar / totalStars) * 100;
    twoStarsPct = (twoStars / totalStars) * 100;
    threeStarsPct = (threeStars / totalStars) * 100;
    fourStarsPct = (fourStars / totalStars) * 100;
    fiveStarsPct = (fiveStars / totalStars) * 100;
  };

  const addToBasket = () => {
    // dispatch the item into the data layer
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: product?.id,
        title: product?.title,
        image: product?.image,
        price: product?.price,
        rating: avgRating,
      },
    });
  };

  const updateRating = (productIdParam) => {
    setProductRatings([]);
    db.collection("products")
      // get the specific product
      .doc(productIdParam)
      .collection("review_rating")
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

  const addReview = (e) => {
    e.preventDefault();
    if (!review == "" || !review == null) {
      db.collection("products")
        .doc(productId)
        .collection("review_rating")
        .doc(user.uid)
        .update({
          username: user.username,
          review: review,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
        });

      setReview("");
      setReviewed(true);
    } else {
      setValidationError(true);
    }
  };

  if (location?.state?.productRatings) {
    sortRating(location?.state?.productRatings);
  } else if (productRatings) {
    sortRating(productRatings);
  }
  // console.log('location?.state?.rating : '+location?.state?.rating, 'userRating : '+userRating, 'productId : '+productId);
  return (
    <div>
      <div className="max-w-10/12 product__wrapper bg-white w-content p-10 flex justify-center mx-auto">
        <div className="product__img__wrapper w-4/12 flex flex-col items-center">
          <Magnifier
            src={
              location?.state?.image
                ? location?.state?.image
                : product?.image
            }
          />
          <hr />
          <Box
            component="fieldset"
            width={0.9}
            mt={6}
            my={2}
            py={3}
            borderColor="transparent"
            boxShadow={1}
            className="flex flex-col justify-center items-center"
          >
            <p className="text-center text-lg underline mb-1">
              Rate this product :
            </p>
            <Tooltip
              title={starLabels[starHover != -1 ? starHover : userRating]}
              placement="left"
              arrow
            >
              <Rating
                name="simple-controlled"
                size="large"
                value={
                  location?.state?.rating !=undefined ? location?.state?.rating : userRating
                }
                precision={0.5}
                onChange={(event, newValue) => {
                  setUserRating(newValue);
                  db.collection("products")
                    .doc(productId)
                    .collection("review_rating")
                    .doc(user?.uid)
                    .set(
                      {
                        rating: newValue,
                      },
                      {
                        merge: true,
                      }
                    );
                }}
                onChangeActive={(event, newHover) => {
                  setStarHover(newHover);
                }}
              />
            </Tooltip>
          </Box>
        </div>
        <div className="product__detail__wrapper w-8/12">
          <h1 className=" text-4xl mb-3">
            {location?.state?.title ? location?.state?.title : product?.title}
          </h1>
          <p className="mb-2">
            Marque: XIAOMI |{" "}
            <span className="hover:underline hover:text-orange-600 cursor-pointer">
              Similar products from XIAOMI
            </span>
          </p>
          <div className="product__rating">
            <Tooltip
              title={
                location?.state?.avgRating
                  ? "average rating: " + location?.state?.avgRating + " ★"
                  : "average rating: " + avgRating.current + " ★"
              }
              placement="top"
              arrow
              interactive
            >
              <Box component="fieldset" mb={1} borderColor="transparent">
                <Rating
                  name="half-rating-read"
                  value={
                    location?.state?.avgRating
                      ? location?.state?.avgRating
                      : avgRating.current
                  }
                  precision={0.5}
                  size="large"
                  readOnly
                />
              </Box>
            </Tooltip>
          </div>
          <hr />
          <p className="product__price text-2xl mb-5">
            <small>$</small>
            <strong>
              {location?.state?.price ? location?.state?.price : product?.price}
            </strong>
          </p>
          <button
            onClick={addToBasket}
            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-2 px-4 rounded btn_inner_shadow border border-black"
          >
            Add To Basket
          </button>
          <div className="mt-8">
            <h1 className="text-xl">Description:</h1>
            <span className="break-all">
              {location?.state?.description
                ? location?.state?.description
                : product?.description}
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
              Ratings{" "}
              <span className="text-sm">
                (
                {location?.state?.productRatings
                  ? location?.state?.productRatings.length
                  : productRatings.length}
                )
              </span>
            </h1>
            <div className="rating__breakdown__wrapper ">
              <div className="rating__block my-5 flex flex-col items-center justify-center bg-gray-300 bg-opacity-50 p-10">
                <span className="text-orange-400 font-semibold text-xl">
                  {location?.state?.avgRating
                    ? location?.state?.avgRating
                    : avgRating.current}
                  /5
                </span>
                <Box component="fieldset" mb={3} borderColor="transparent">
                  <Rating
                    name="half-rating-read"
                    value={
                      location?.state?.avgRating
                        ? location?.state?.avgRating
                        : avgRating.current
                    }
                    precision={0.5}
                    readOnly
                  />
                </Box>
                <span>
                  {location?.state?.productRatings
                    ? location?.state?.productRatings.length
                    : productRatings.length}{" "}
                  review(s)
                </span>
              </div>
              <ul className="rating__breakdown mb-5">
                <RatingBar
                  starNb="5"
                  ratingNb={fiveStars}
                  starPct={fiveStarsPct}
                />
                <RatingBar
                  starNb="4"
                  ratingNb={fourStars}
                  starPct={fourStarsPct}
                />
                <RatingBar
                  starNb="3"
                  ratingNb={threeStars}
                  starPct={threeStarsPct}
                />
                <RatingBar
                  starNb="2"
                  ratingNb={twoStars}
                  starPct={twoStarsPct}
                />
                <RatingBar starNb="1" ratingNb={oneStar} starPct={oneStarPct} />
              </ul>
            </div>
          </div>
          <div className="ratings flex flex-col w-full ml-20">
            {!reviewed ? (
              <form
                onSubmit={addReview}
                className="textArea__wrapper flex flex-col items-center mb-10"
              >
                <h2 className="font-normal mb-5 text-2xl">
                  Write your own review
                </h2>
                <textarea
                  name="review"
                  className="resize-none border border-gray-500 rounded focus:outline-none focus:shadow-outline w-7/12 mb-2 p-4"
                  rows="5"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                ></textarea>
                {validationError ? (
                  <span className="text-red-600 text-sm font-semibold mb-2">
                    Please write your review before you submit it !
                  </span>
                ) : (
                  ""
                )}
                <button
                  type="submit"
                  className="mt-2 bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-1 px-10 rounded btn_inner_shadow border border-black"
                >
                  Submit
                </button>
              </form>
            ) : (
              ""
            )}
            <Reviews
              reviewed={reviewed}
              setReviewed={setReviewed}
              setReview={setReview}
              productId={productId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
