import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import "./Product.css";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";
import { getStarTotal } from "./reducer";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import Star from "./Star";
import { Rating } from "@material-ui/lab";
import Box from "@material-ui/core/Box";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import {
  ExpandMore,
  Favorite,
  MoreHoriz,
  Share,
  AddShoppingCart,
} from "@material-ui/icons";
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

function Product({ docId, id, title, brand, image, price, savedProp }) {
  
  const history = useHistory();

  const firebase = require("firebase");

  const [{ user }, dispatch] = useStateValue();

  const [rating, setRating] = useState(0);

  const [saved, setSaved] = useState(false);

  const [dialogState, setDialogState] = React.useState(false);

  const [previousRating, setPreviousRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);

  const [productRatings, setProductRatings] = useState([]);

  const [imgsloaded, setimgsloaded] = useState(false);

  let loadedCount = useRef(0);

  const stars = [1, 2, 3, 4, 5];

  const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 400,
      width: "23%",
    },
    header: {
      width: "100%",
      paddingBottom: 0,
    },
    rating: {
      padding: 0,
      marginBottom: 5,
    },
    content: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: 0,
      width: "100%",
      "&:last-child": {
        paddingBottom: 0,
      },
    },
    media: {
      paddingTop: "81.25%", // 16:9
    },
    footer: {
      padding: 16,
      width: "100%",
    },
  }));

  const classes = useStyles();

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

    if (savedProp) {
      setSaved(true);
    } else {
      setSaved(false);
    }

    // Use an empty array as 2nd parameter of useEffect to make it execute on mount and unmount
    // thus avoiding an infinite loop
  }, [docId, savedProp]);

  const handleDialogClickOpen = () => {
    setDialogState(true);
  };

  const handleDialogClose = () => {
    setDialogState(false);
  };

  let avgRating = getStarTotal(productRatings) / productRatings.length;
  // console.log(getStarTotal(productRatings), productRatings.length);

  const addToBasket = async () => {
    if (user) {
      
    
    const basketCollection = db
      .collection("users")
      .doc(user?.uid)
      .collection("basket");

    basketCollection
      .doc(docId)
      .set(
        {
          id: id,
          title: title,
          price: price,
          rating: avgRating,
          image: image,
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
            docId: docId,
            id: id,
            title: title,
            image: image,
            price: price,
            rating: avgRating,
          },
        });
      })
      .catch(() => console.log("ADD TO BASKET FAILED"));
    } else {
      dispatch({
        type: "ADD_TO_BASKET",
        item: {
          docId: docId,
          id: id,
          title: title,
          image: image,
          price: price,
          rating: avgRating,
        },
      });
    }
  };

  // IF PRODUCT IS SAVED CHANGE COLOR NOT DONE, NEED TO FIGURE OUT A CHECK TO TURN SAVED STATE TO TRUE
  async function saveProduct() {
    console.log("Save Process started");
    if (user) {
      let favorited = db
        .collection("users")
        .doc(user?.uid)
        .collection("favorited");

      const snapshot = await favorited.get();
      // IF THERE IS NO COLLECTION, SAVE PRODUCT TO FAVORITE LIST AND SETSAVED TO TRUE
      if (snapshot.empty) {
        console.log("No matching SAVE PRODUCT collection.");
        favorited
          .doc(docId)
          .set({
            id: id,
            title: title,
            price: price,
            rating: avgRating,
            image: image,
          })
          .then(console.log("successfully saved"), setSaved(true))
          .catch((error) => console.log(error));
        return;
      }
      // IF THERE IS A COLLECTION, CHECK IF PRODUCT IS ALREADY SAVED, SAVE IF IT IS NOT, UNSAVE IF IT IS.
      snapshot.forEach((doc) => {
        if (doc.id !== docId) {
          favorited
            .doc(docId)
            .set({
              id: id,
              title: title,
              price: price,
              rating: avgRating,
              image: image,
            })
            .then(console.log("successfully saved"), setSaved(true))
            .catch((error) => console.log(error));
        }
      });
    } else {
      console.log(
        "Save process aborted, you need to sign in order to save products"
      );
    }
  }

  async function unSaveProduct() {
    console.log("Delete Process started");
    if (user) {
      let favorited = db
        .collection("users")
        .doc(user?.uid)
        .collection("favorited");

      const snapshot = await favorited.get();

      // IF THERE IS NO COLLECTION STOP PROCESS

      if (snapshot.empty) {
        console.log("No matching SaveProduct collection.");
        return;
      }

      // IF THERE IS A COLLECTION, CHECK IF PRODUCT IS ALREADY SAVED, SAVE IF IT IS NOT, UNSAVE IF IT IS.
      snapshot.forEach((doc) => {
        if (doc.id === docId) {
          favorited
            .doc(docId)
            .delete()
            .then(console.log("successfully deleted"), setSaved(false))
            .catch((error) => console.log(error));
        }
      });
    }
  }

  function goToProduct() {
    // console.log(docId, id, title, brand, image, price);
    history.push({
      pathname: "/product/" + docId,
      state: { docId, id, title, brand, image, price },
    });
  }

  function rendered() {
    //Render complete
    // console.log("rendered");
    // console.log(id);
    // console.log("before: "+loadedCount.current);
    // loadedCount.current++;
    // console.log("after: "+loadedCount.current);
    // if (loadedCount.current == 9) {
    //   console.log('ALL RENDERED');
    //   setimgsloaded(true)
    // }
  }

  function startRender() {
    //Rendering start
    requestAnimationFrame(rendered);
  }

  function loaded() {
    requestAnimationFrame(startRender);
  }

  return (
    <Card className="product">
      <CardHeader
        className={classes.header}
        title={
          <Tooltip
            classes={{ tooltip: "capitalize" }}
            title={title}
            interactive
            placement="top-start"
            fontSize={50}
          >
            <p
              className="product__title text-sm font-semibold cursor-pointer hover:text-orange-600 capitalize"
              onClick={goToProduct}
            >
              {title}
            </p>
          </Tooltip>
        }
        subheader={
          <p className="product__price">
            <small>$</small>
            <strong>{price}</strong>
          </p>
        }
      />
      <CardContent className={classes.content}>
        <Box
          className="flex items-center justify-between px-2 mb-1"
          component="fieldset"
          borderColor="transparent"
        >
          <Rating
            name="half-rating-read"
            value={avgRating}
            precision={0.5}
            readOnly
          />
          <Tooltip title={"Share"} arrow interactive placement="top">
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
                  url={"http://localhost:3000/product/" + docId}
                  quote={"Buy this product now by clicking on the link"}
                  hashtag="#amazonClone"
                >
                  <FacebookIcon logoFillColor="white" size={40} round={true} />
                </FacebookShareButton>
                <FacebookMessengerShareButton
                  url={"http://localhost:3000/product/" + docId}
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
                  url={"http://localhost:3000/product/" + docId}
                  quote={"Buy this product now by clicking on the link"}
                  hashtag="#amazonClone"
                >
                  <EmailIcon logoFillColor="white" size={40} round={true} />
                </EmailShareButton>
                <RedditShareButton
                  url={"http://localhost:3000/product/" + docId}
                  quote={"Buy this product now by clicking on the link"}
                  hashtag="#amazonClone"
                >
                  <RedditIcon logoFillColor="white" size={40} round={true} />
                </RedditShareButton>
                <TwitterShareButton
                  url={"http://localhost:3000/product/" + docId}
                  quote={"Buy this product now by clicking on the link"}
                  hashtag="#amazonClone"
                >
                  <TwitterIcon logoFillColor="white" size={40} round={true} />
                </TwitterShareButton>
                <WhatsappShareButton
                  url={"http://localhost:3000/product/" + docId}
                  quote={"Buy this product now by clicking on the link"}
                  hashtag="#amazonClone"
                >
                  <WhatsappIcon logoFillColor="white" size={40} round={true} />
                </WhatsappShareButton>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <CardMedia
          className={classes.media + " product__img"}
          image={image}
          onClick={goToProduct}
          // onLoad={loaded}
          // className={`cursor-pointer ${loadedCount.current ? "" : ""}`}
          // src={image}
          // alt=""
        />

        <CardActions className={classes.footer + " flex justify-between"}>
          {saved ? (
            <Tooltip title={"Remove from favorites"} arrow interactive>
              <IconButton
                aria-label="remove from favorites"
                onClick={unSaveProduct}
              >
                <Favorite className="text-red-500" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={"Add to favorites"} arrow interactive>
              <IconButton aria-label="add to favorites" onClick={saveProduct}>
                <Favorite />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={"Add to basket"} arrow interactive>
            <button
              className="bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-1 px-2 rounded button_effect border"
              onClick={addToBasket}
            >
              <AddShoppingCart />
            </button>
          </Tooltip>
        </CardActions>
      </CardContent>
    </Card>
  );
}
// <div>
/* <div className="product"> */
/* <div className="product__info">
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
  onLoad={loaded}
  className={`cursor-pointer ${loadedCount.current ? "" : ""}`}
  onClick={goToProduct}
  src={image}
  alt=""
/>

<button
  className="mt-2 bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-1 px-2 rounded button_effect border"
  onClick={addToBasket}
>
  Add to Basket
</button> */
/* </div> */

export default Product;
