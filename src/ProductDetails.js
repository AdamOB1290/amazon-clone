import React, { useState, useEffect, useRef } from "react";
import "./ProductDetails.css";
import RatingBar from "./RatingBar";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";
import { getStarTotal } from "./reducer";
import Star from "./Star";
import { useLocation } from "react-router-dom";
import Magnifier from "react-magnifier";
import { Rating } from "@material-ui/lab";
import Box from "@material-ui/core/Box";
import moment from "moment";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";

const faker = require("faker");

function ProductDetails() {
  const location = useLocation();

  const [rootUrl, setRootUrl] = useState("http://localhost:3000/");

  const [productId, setProductId] = useState(location.pathname.split("/")[2]);

  const [product, setProduct] = useState([]);

  const firebase = require("firebase");

  const [{ user }, dispatch] = useStateValue();

  const [productRatings, setProductRatings] = useState([]);

  const [userRating, setUserRating] = useState(null);

  const [review, setReview] = useState("");

  const [reviews, setReviews] = useState([]);

  const avgRating = useRef(null);

  const [dropdownValue, setDropdownValue] = useState("");

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <i
      className="fas fa-ellipsis-h absolute top-0 right-0 cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </i>
  ));

  const CustomMenu = React.forwardRef(
    ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !dropdownValue ||
                child.props.children.toLowerCase().startsWith(dropdownValue)
            )}
          </ul>
        </div>
      );
    }
  );

  useEffect(() => {
    db.collection("products")
      // get the specific product
      .doc(productId)
      .onSnapshot((snapshot) => {
        setProduct(snapshot.data());
      });

    db.collection("products")
      .doc(productId)
      .collection("review_rating")
      .onSnapshot((snapshot) => {
        setReviews(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().username,
            review: doc.data().review,
            rating: doc.data().rating,
            created_at: doc.data().created_at.toDate().toDateString(),
          }))
        );
      });

    const updateRating = () => {
      setProductRatings([]);
      db.collection("products")
        // get the specific product
        .doc(productId)
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

    updateRating();

    // Use an empty array as 2nd parameter of useEffect to make it execute on mount and unmount
    // thus avoiding an infinite loop
  }, [user]);
  avgRating.current = getStarTotal(productRatings) / productRatings.length;
  if (isNaN(avgRating.current)) {
    avgRating.current = 0;
  }
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

  const addReview = (e) => {
    e.preventDefault();
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
  };

  sortRating(productRatings);

  return (
    <div>
      <div className="max-w-10/12 product__wrapper bg-white w-content p-10 flex justify-center mx-auto">
        <div className="product__img__wrapper w-4/12 flex flex-col items-center">
          <Magnifier src={rootUrl + product.image} />
          <hr />
          <p className="mt-4 text-center text-lg ">Rate this product :</p>
          <Box component="fieldset" mb={3} borderColor="transparent">
            <Rating
              name="simple-controlled"
              size="large"
              value={userRating}
              precision={0.5}
              onChange={(event, newValue) => {
                setUserRating(newValue);
                db.collection("products")
                  .doc(productId)
                  .collection("review_rating")
                  .doc(user?.uid)
                  .update({
                    rating: newValue,
                  });
              }}
            />
          </Box>
        </div>
        <div className="product__detail__wrapper w-8/12">
          <h1 className=" text-4xl mb-3">{product.title}</h1>
          <div className="product__rating mb-3">
            <span>avg :</span>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Rating
                name="half-rating-read"
                value={avgRating.current}
                precision={0.5}
                size="large"
                readOnly
              />
            </Box>
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
                  {avgRating.current}/5
                </span>
                <Box component="fieldset" mb={3} borderColor="transparent">
                  <Rating
                    name="half-rating-read"
                    value={avgRating.current}
                    precision={0.5}
                    readOnly
                  />
                </Box>
                <span>{productRatings.length} review</span>
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
            <form
              onSubmit={addReview}
              className="textArea__wrapper flex flex-col items-center mb-10"
            >
              <h2 className="font-normal mb-5 text-2xl">
                Write your own review
              </h2>

              <textarea
                name="review"
                className="resize-none border border-gray-500 rounded focus:outline-none focus:shadow-outline w-7/12 mb-4"
                rows="5"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-1 px-10 rounded btn_inner_shadow border border-black"
              >
                Submit
              </button>
            </form>
            <h1 className="font-semibold text-2xl mb-5">Reviews</h1>
            <div className=" w-full">
              {reviews?.map((user, i) => (
                <div className="w-full" key={i}>
                  <div className=" w-full flex relative justify-between">
                    <div className="mr-2 font-bold">{user.username}</div>
                    <Box component="fieldset" borderColor="transparent">
                      <Rating
                        name="half-rating-read"
                        value={user.rating}
                        precision={0.5}
                        readOnly
                      />
                    </Box>
                    <Dropdown className="bg-red-900">
                      <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                      ></Dropdown.Toggle>

                      <Dropdown.Menu as={CustomMenu}>
                        <Dropdown.Item eventKey="1" active>
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="2">Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                      <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                      ></Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item>Edit</Dropdown.Item>
                        <Dropdown.Item>Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="mb-5 break-all">
                    <span>{user.review}</span>
                  </div>
                  <span className="text-gray-600 text-sm font-hairline">
                    {moment(user.created_at).fromNow()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
