import React, { useState, useEffect, useRef } from "react";
import "./ProductDetails.css";
import RatingBar from "./RatingBar";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";
import { getStarTotal } from "./reducer";
import { Link, useLocation } from "react-router-dom";
import Magnifier from "react-magnifier";
import { Rating } from "@material-ui/lab";
import Box from "@material-ui/core/Box";
import Reviews from "./Reviews";
import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@material-ui/core";

import { Share } from "@material-ui/icons";

import {
  //////BUTTONS///////
  EmailShareButton,
  FacebookShareButton,
  FacebookMessengerShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  ///////ICONS/////////
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  RedditIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

function ProductDetails() {
  const location = useLocation();

  const [productId, setProductId] = useState(location.pathname.split("/")[2]);

  const [product, setProduct] = useState([]);

  const firebase = require("firebase");

  const [{ user, username }, dispatch] = useStateValue();

  const [productRatings, setProductRatings] = useState([]);

  const [userRating, setUserRating] = useState(0);

  const [review, setReview] = useState("");

  const avgRating = useRef(null);

  const [starHover, setStarHover] = useState(-1);

  const [reviewed, setReviewed] = useState(true);

  const [ratingError, setRatingError] = useState(false);

  const [dialogState, setDialogState] = useState(false);

  const [noUserError, setNoUserError] = useState(false);

  const [noReviewError, setNoReviewError] = useState(false);

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

  const handleDialogClickOpen = () => {
    setDialogState(true);
  };

  const handleDialogClose = () => {
    setDialogState(false);
  };

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
          console.log("no ratings match found");
      }
    });

    oneStarPct = (oneStar / totalStars) * 100;
    twoStarsPct = (twoStars / totalStars) * 100;
    threeStarsPct = (threeStars / totalStars) * 100;
    fourStarsPct = (fourStars / totalStars) * 100;
    fiveStarsPct = (fiveStars / totalStars) * 100;
  };

  const addToBasket = () => {
    if (user) {
      const basketCollection = db
        .collection("users")
        .doc(user?.uid)
        .collection("basket");

      basketCollection
        .doc(productId)
        .set(
          {
            id: product?.id,
            title: product?.title,
            price: product?.price,
            rating: avgRating,
            image: product?.image,
            quantity: firebase.firestore.FieldValue.increment(1),
          },
          { merge: true }
        )
        .then(() => {
          console.log("ADD TO BASKET SUCCESS");
          // dispatch the item into the data layer
          dispatch({
            type: "ADD_TO_BASKET",
            item: {
              docId: productId,
              id: product?.id,
              title: product?.title,
              image: product?.image,
              price: product?.price,
              rating: avgRating,
            },
          });
        })
        .catch(() => console.log("ADD TO BASKET FAILED"));
    } else {
      dispatch({
        type: "ADD_TO_BASKET",
        item: {
          docId: productId,
          id: product?.id,
          title: product?.title,
          image: product?.image,
          price: product?.price,
          rating: avgRating,
        },
      });
    }
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
    if (user) {
      if (!review == "" || !review == null) {
        db.collection("products")
          .doc(productId)
          .collection("review_rating")
          .doc(user.uid)
          .set(
            {
              username: username,
              review: review,
              created_at: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );

        setReview("");
        setReviewed(true);
      } else {
        setNoReviewError(true);
      }
    } else {
      setNoUserError(true);
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
      <div className="product__wrapper bg-white w-content flex flex-col md:flex-row  justify-center mx-auto">
        <Card>
          <div className="block md:hidden">
            <CardHeader
              title={
                location?.state?.title ? location?.state?.title : product?.title
              }
            />
            <div className="mb-3 md:w-6/12 lg:w-4/12 flex-col items-center">
              <Box
                component="fieldset"
                width={0.9}
                className="flex  items-center"
              >
                <p className="text-center text-md mx-4 my-2">
                  Rate this product :
                </p>
                <Tooltip
                  title={starLabels[starHover !== -1 ? starHover : userRating]}
                  placement="left"
                  arrow
                >
                  <Rating
                    name="simple-controlled"
                    value={
                      location?.state?.rating !== undefined
                        ? location?.state?.rating
                        : userRating
                    }
                    precision={0.5}
                    onChange={(event, newValue) => {
                      if (user?.uid) {
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
                      } else {
                        setRatingError(true);
                      }
                    }}
                    onChangeActive={(event, newHover) => {
                      setStarHover(newHover);
                    }}
                  />
                </Tooltip>
                {ratingError ? (
                  <span className="text-red-600 text-sm font-semibold">
                    In order to give a rating you have to be Signed In
                  </span>
                ) : (
                  ""
                )}
              </Box>
            </div>
          </div>
          <div className="product__img__wrapper md:w-full flex flex-col items-center">
            <Magnifier
              mgWidth={300}
              mgHeight={300}
              zoomFactor={0.8}
              src={
                location?.state?.image ? location?.state?.image : product?.image
              }
            />
            <hr />
          </div>

          <div className="hidden md:flex md:w-full md:my-4 flex-col items-center">
            <Box
              component="fieldset"
              width={0.9}
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
                    location?.state?.rating != undefined
                      ? location?.state?.rating
                      : userRating
                  }
                  precision={0.5}
                  onChange={(event, newValue) => {
                    if (user?.uid) {
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
                    } else {
                      setRatingError(true);
                    }
                  }}
                  onChangeActive={(event, newHover) => {
                    setStarHover(newHover);
                  }}
                />
              </Tooltip>
              {ratingError ? (
                <span className="text-red-600 text-sm font-semibold">
                  In order to give a rating you have to be Signed In
                </span>
              ) : (
                ""
              )}
            </Box>
          </div>
        </Card>

        <div className="product__detail__wrapper my-5 mx-3 md:w-6/12 lg:w-8/12">
          <h1 className="text-2xl font-bold hidden md:block sm:text-3xl mb-3 capitalize">
            {location?.state?.title ? location?.state?.title : product?.title}
          </h1>
          <p className="mb-2">
            Brand:{" "}
            <span>
              {location?.state?.brand ? location?.state?.brand : product?.brand}
            </span>{" "}
            |{" "}
            <span className="hover:underline hover:text-orange-600 cursor-pointer">
              Similar products from{" "}
              {location?.state?.brand ? location?.state?.brand : product?.brand}
            </span>
          </p>
          <div className="product__rating flex justify-between items-center">
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
            <Tooltip title={"Share"} arrow interactive>
              <IconButton aria-label="share" onClick={handleDialogClickOpen}>
                <Share className="text-blue-600" />
              </IconButton>
            </Tooltip>
            <Dialog
              open={dialogState}
              onClose={handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle
                id="alert-dialog-title"
                className="border-b text-center"
              >
                {"Share This Product"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Choose one of the following social medias :
                </DialogContentText>
                <div className="w-full flex justify-between items-center">
                  <FacebookShareButton
                    url={"http://localhost:3000" + location.pathname}
                    quote={"Buy this product now by clicking on the link"}
                    hashtag="#amazonClone"
                  >
                    <FacebookIcon
                      logoFillColor="white"
                      size={40}
                      round={true}
                    />
                  </FacebookShareButton>
                  <FacebookMessengerShareButton
                    url={"http://localhost:3000" + location.pathname}
                    quote={"Buy this product now by clicking on the link"}
                    hashtag="#amazonClone"
                  >
                    <FacebookMessengerIcon
                      logoFillColor="white"
                      size={40}
                      round={true}
                    />
                  </FacebookMessengerShareButton>
                  <EmailShareButton
                    url={"http://localhost:3000" + location.pathname}
                    quote={"Buy this product now by clicking on the link"}
                    hashtag="#amazonClone"
                  >
                    <EmailIcon logoFillColor="white" size={40} round={true} />
                  </EmailShareButton>
                  <RedditShareButton
                    url={"http://localhost:3000" + location.pathname}
                    quote={"Buy this product now by clicking on the link"}
                    hashtag="#amazonClone"
                  >
                    <RedditIcon logoFillColor="white" size={40} round={true} />
                  </RedditShareButton>
                  <TwitterShareButton
                    url={"http://localhost:3000" + location.pathname}
                    quote={"Buy this product now by clicking on the link"}
                    hashtag="#amazonClone"
                  >
                    <TwitterIcon logoFillColor="white" size={40} round={true} />
                  </TwitterShareButton>
                  <WhatsappShareButton
                    url={"http://localhost:3000" + location.pathname}
                    quote={"Buy this product now by clicking on the link"}
                    hashtag="#amazonClone"
                  >
                    <WhatsappIcon
                      logoFillColor="white"
                      size={40}
                      round={true}
                    />
                  </WhatsappShareButton>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
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
            className="w-full font-semibold mt-2 bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-2 px-4 rounded button_effect border border-black"
          >
            Add To Basket
          </button>
          <div className="mt-8">
            <h1 className="text-xl font-semibold">Description:</h1>
            <span className="break">
              {location?.state?.description
                ? location?.state?.description
                : product?.description}
            </span>
          </div>
        </div>
      </div>

      <div className=" py-3 reviews__wrapper mx-auto w-full bg-white mt-10 flex justify-center flex-col">
        <div className="header__reviews whitespace-no-wrap px-20 pb-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-400 ">
          <h1 className="text-3xl">User Reviews</h1>
          <span className="hidden sm:block text-orange-400 font-semibold text-xl cursor-pointer">
            Read More <i className="fas fa-angle-right align-middle ml-2"></i>
          </span>
        </div>
        <div className="body__reviews flex flex-col md:flex-row px-5 md:px-20 mt-5">
          <div className="ratings">
            <h1 className="text-lg font-semibold ">
              Ratings
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
          <div className="flex flex-col w-full md:ml-10 lg:ml-20">
            {!reviewed ? (
              <form
                onSubmit={addReview}
                className="textArea__wrapper flex flex-col w-full items-center mb-10"
              >
                <h2 className="font-normal whitespace-no-wrap mb-5 text-2xl">
                  Write your own review
                </h2>
                <textarea
                  name="review"
                  className="resize-none border border-gray-500 rounded focus:outline-none focus:shadow-outline w-full md:w-10/12 mb-2 p-4"
                  rows="5"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                ></textarea>
                {noUserError || noReviewError ? (
                  <div className="mb-2 font-semibold text-red-600 text-sm">
                    {noUserError ? (
                      <span>
                        You need to{" "}
                        <Link to="/login">
                          <span className="underline font-bold text-red-600">
                            Sign In
                          </span>
                        </Link>{" "}
                        before you can submit a review !
                      </span>
                    ) : (
                      <span>
                        Please write your review before you submit it !
                      </span>
                    )}
                  </div>
                ) : (
                  ""
                )}
                <button
                  type="submit"
                  className="mt-2 bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-1 px-10 rounded button_effect border"
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
