import React, { useEffect, useState, useRef } from "react";
import "./Header.css";
import SearchIcon from "@material-ui/icons/Search";
import Menu from "@material-ui/core/Menu";
import Fade from "@material-ui/core/Fade";
import MenuItem from "@material-ui/core/MenuItem";
import { ShoppingBasket } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";
import { db } from "./firebase";
import Dropdown from "./Dropdown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";

var Highlight = require("react-highlighter");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

function Header() {
  const history = useHistory();
  const [rootUrl, setRootUrl] = useState("http://localhost:3000/");
  const [{ basket, user }, dispatch] = useStateValue();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const options = useRef([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const ITEM_HEIGHT = 48;
  const [productRatings, setProductRatings] = useState([]);

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState("");
  const anchorRef = useRef(null);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);

  useEffect(() => {
    db.collection("products")
      .orderBy("id", "asc")
      // when cloud firestore sends a snapshot of the data, iterate through it's elements
      .onSnapshot((snapshot) =>
        // map the content of each element to the defined properties
        setProducts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  products.forEach((product) => {
    options.current.push(product.data.title);
  });

  const handleKeyUp = (e) => {
    setHighlighted(e.target.value);
    const updatedList = products.filter((product) => {
      return (
        product.data.title
          .toLowerCase()
          .search(e.target.value.toLowerCase()) !== -1
      );
    });
    setFilteredProducts(updatedList);
    setOpen(true);
  };

  const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
    }
  };
  const sendToSeachBar = (product) => {
    console.log(product);
    setSelectedProduct(product);
    setOpen(false);
  };

  const goToProduct = () => {
    // console.log(selectedProduct.id);
    db.collection("products")
      // get the specific product
      .doc(selectedProduct.id)
      .collection("review_rating")
      // when cloud firestore sends a snapshot of the data, iterate through it's elements
      .onSnapshot((snapshot) => {
        // reset the array
        setProductRatings([]);
        //   loop over each user who rated the product
        snapshot.docs.forEach((doc) => {
          console.log('rating is:'+ doc.data().rating);
          //   add all the ratings to the array
          setProductRatings((productRatings) => [
            ...productRatings,
            doc.data().rating,
          ]);
        });
      });

    const docId = selectedProduct.id;
    const id = selectedProduct.data.id;
    const title = selectedProduct.data.title;
    const image = selectedProduct.data.image;
    const price = selectedProduct.data.price;
    // console.log(docId, id, title, image, price, productRatings);
    history.push({
      pathname: "/product/" + docId,
      state: { docId, id, title, image, price, productRatings },
    });
  };
  return (
    <div className="header flex justify-between items-center w-full">
      <Link to="/">
        <img className="header__logo" src={rootUrl + "./amazon_logo.png"} />
      </Link>

      <div className="header__search__wrapper">
        <div className="header__search relative">
          <input
            className="header__searchInput"
            onKeyUp={handleKeyUp}
            type="text"
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onChange={(e) => setSelectedProduct(e.target.value)}
            value={selectedProduct?.data?.title}
          />
          <SearchIcon onClick={goToProduct} className="header__searchIcon" />
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            className="product_search_list"
          >
            <Paper
              id="menu-list-container"
              style={{
                maxHeight: ITEM_HEIGHT * 8.8,
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="menu-list">
                  {filteredProducts?.map((product, i) => (
                    <MenuItem onClick={() => sendToSeachBar(product)} key={i}>
                      <img
                        className="h-10 w-10"
                        src={rootUrl + product?.data.image}
                        alt=""
                      />
                      <Highlight matchElement="strong" search={highlighted}>
                        {product?.data.title}
                      </Highlight>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Popper>
        </div>
      </div>

      <div className="header__nav">
        <Link to={!user && "/login"}>
          <div onClick={handleAuthenticaton} className="header__option">
            <span className="header__optionLineOne">
              Hello {!user ? "Guest" : user.email}
            </span>
            <span className="header__optionLineTwo">
              {user ? "Sign Out" : "Sign In"}
            </span>
          </div>
        </Link>
        <Link to="/orders">
          <div className="header__option">
            <span className="header__optionLineOne">Returns</span>
            <span className="header__optionLineTwo">& Orders</span>
          </div>
        </Link>
        <div className="header__option">
          <span className="header__optionLineOne">Your</span>
          <span className="header__optionLineTwo">Prime</span>
        </div>
        <Link className="flex items-center" to="/checkout">
          <div className="heaver__optionBasket">
            <ShoppingBasket />
            <span className="header__optionLineTwo header__basketCount">
              {basket?.length}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
