import React from "react";
import "./CheckoutProduct.css";
import { useStateValue } from "./StateProvider";
import { Rating } from "@material-ui/lab";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import { Card, CardActions, CardContent, makeStyles } from "@material-ui/core";
import { RemoveShoppingCart } from "@material-ui/icons";
import { db } from "./firebase";

function CheckoutProduct({
  docId,
  id,
  image,
  title,
  price,
  rating,
  hideButton,
}) {
  const history = useHistory();

  const firebase = require("firebase");

  const [{ user }, dispatch] = useStateValue();

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      // maxWidth: "400px",
      // heigth: 260,
    },
    details: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    content: {
      flex: "1 0 auto",
      paddingBottom: 0,
    },
    actions: {
      paddingTop: 0,
    },
  }));
  const classes = useStyles();

  const removeFromBasket = async () => {
    if (user) {
      const basketCollection = db
        .collection("users")
        .doc(user?.uid)
        .collection("basket");

      const docsnapshot = await basketCollection.doc(docId).get();
      if (!docsnapshot.exists) {
        console.log("No such document!");
      } else {
        console.log("Document data:", docsnapshot.data());
        const basketProduct = docsnapshot.data();
        console.log("QUANTITY", basketProduct?.quantity);
        if (basketProduct?.quantity < 2) {
          basketCollection
            .doc(docId)
            .delete()
            .then(() => {
              console.log("successfully deleted");
              // remove the item from the basket
              dispatch({
                type: "REMOVE_FROM_BASKET",
                id: id,
              });
            })
            .catch(() => console.log("ADD TO BASKET FAILED"));
        } else {
          basketCollection
            .doc(docId)
            .set(
              {
                id: id,
                title: title,
                price: price,
                rating: rating,
                image: image,
                quantity: firebase.firestore.FieldValue.increment(-1),
              },
              { merge: true }
            )
            .then(() => {
              console.log("ADD TO BASKET SUCCESS");
              // remove the item from the basket
              dispatch({
                type: "REMOVE_FROM_BASKET",
                id: id,
              });
            })
            .catch(() => console.log("ADD TO BASKET FAILED"));
        }
      }
    } else {
      // remove the item from the basket
      dispatch({
        type: "REMOVE_FROM_BASKET",
        id: id,
      });
    }
  };

  const goToProduct = () => {
    console.log(docId, id, title, image, price);
    history.push({
      pathname: "/product/" + docId,
      state: { docId, id, title, image, price },
    });
  };

  return (
    <Card className={classes.root + " my-6 w-full lg:w-9/12 mr-2"}>
      <img
        className="object-contain w-40 h-40 sm:w-56 sm:h-56"
        onClick={goToProduct}
        src={image}
        alt=""
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Tooltip
            title={<span classeName="text-2xl capitalize">{title}</span>}
            interactive
            placement="top-start"
          >
            <h6
              className="checkoutProduct__title text-md sm:text-xl font-semibold capitalize"
              onClick={goToProduct}
            >
              {title}
            </h6>
          </Tooltip>
          <div className="price_removeBtn_div flex justify-between sm:block ">
            <span className="checkoutProduct__price text-xl">
              <small>$</small>
              <strong>{price}</strong>
            </span>
            {!hideButton && (
              <Tooltip title={"Remove from basket"} arrow interactive>
                <button
                  className=" remove_cart_up sm:hidden bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-1 px-2 rounded button_effect border my-2 mr-2 ml-auto"
                  onClick={removeFromBasket}
                >
                  <RemoveShoppingCart />
                </button>
              </Tooltip>
            )}
          </div>
          <Tooltip title={"average rating: " + rating + " ★"} arrow interactive>
            <Box component="fieldset" mb={1} borderColor="transparent" mt={0.5}>
              <Rating
                name="half-rating-read"
                value={rating}
                precision={0.5}
                size="large"
                readOnly
              />
            </Box>
          </Tooltip>
        </CardContent>
        {!hideButton && (
          <CardActions className={classes.actions}>
            <button
              className=" remove_cart_down hidden sm:block bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-1 px-2 rounded button_effect border my-2 mr-2 ml-auto"
              onClick={removeFromBasket}
            >
              <RemoveShoppingCart />
            </button>
          </CardActions>
        )}
      </div>
    </Card>
  );
}

export default CheckoutProduct;
