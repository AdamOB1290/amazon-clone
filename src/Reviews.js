import React, { useState, useEffect } from "react";
import moment from "moment";
import Dropdown from "./Dropdown";
import { db } from "./firebase";
import { Rating } from "@material-ui/lab";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import "./ProductDetails.css";
import { useStateValue } from "./StateProvider";

export default function Reviews({ setReviewed, setReview, productId }) {
  const [reviews, setReviews] = useState([]);

  const [editClicked, setEditClicked] = useState(false);

  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    db.collection("products")
      .doc(productId)
      .collection("review_rating")
      .onSnapshot((snapshot) => {
        //   setReviews(
        //   snapshot.docs.map((doc) => ({
        //     id: doc?.id,
        //     username: doc?.data().username,
        //     review: doc?.data().review,
        //     rating: doc?.data().rating,
        //     created_at: doc?.data().created_at?.toDate().toDateString(),
        //   }))
        // );
        setReviews([]);
        snapshot.docs.forEach((doc) => {
          if (doc.data().review != undefined) {
            setReviews((reviews) => [
              ...reviews,
              {
                id: doc.id,
                username: doc.data().username,
                review: doc.data().review,
                rating: doc.data().rating,
                created_at: doc.data().created_at?.toDate().toDateString(),
              },
            ]);
          }
        });
      });
  }, [productId]);

  useEffect(() => {
    if (!editClicked) {
      if (reviews.length > 0) {
        reviews.forEach((review) => {
          if (review.id == user?.uid) {
            setReviewed(true);
          }
        });
      } else {
        setReviewed(false);
      }
    }
  }, [editClicked]);

  return (
    <div className="mb-6">
      <h1 className="font-semibold text-2xl mb-5">Reviews</h1>
      <div className=" w-full">
        {reviews?.map((reviewer, i) => (
          <div className="w-full" key={i}>
            <div className=" w-full flex relative justify-between items-center">
              <div className="w-full flex items-center">
                <div className="mr-2 font-bold">{reviewer.username}</div>
                <Tooltip
                  title={
                    reviewer.rating == null ? 0 + " ★" : reviewer.rating + " ★"
                  }
                  placement="top"
                  arrow
                  interactive
                >
                  <Box component="fieldset" borderColor="transparent">
                    <Rating
                      name="half-rating-read"
                      value={reviewer.rating}
                      size="small"
                      precision={0.5}
                      readOnly
                    />
                  </Box>
                </Tooltip>
              </div>
              {console.log(reviewer)}
              {user?.uid == reviewer.id ? (
                <Dropdown
                  dropItems={["Edit", "Delete"]}
                  productId={productId}
                  setEditClicked={setEditClicked}
                  setReview={setReview}
                  reviewContent={reviewer.review}
                  setReviewed={setReviewed}
                />
              ) : (
                ""
              )}
            </div>
            <div className="mb-2 break-all">
              <span>{reviewer.review}</span>
            </div>
            <span className="text-gray-600 text-sm font-hairline">
              {moment(reviewer.created_at).fromNow()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
