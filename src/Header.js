import React, { useEffect, useState, useRef } from "react";
import "./Header.css";
import SearchIcon from "@material-ui/icons/Search";
import MenuItem from "@material-ui/core/MenuItem";
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";
import { db } from "./firebase";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";

var Highlight = require("react-highlighter");

function Header() {
  const history = useHistory();
  const [rootUrl, setRootUrl] = useState("http://localhost:3000/");
  const [{ basket, user, username }, dispatch] = useStateValue();
  const [products, setProducts] = useState([]);
  // const [userBasket, setuserBasket] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [typedProduct, setTypedProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [searchByEnter, setSearchByEnter] = useState(false);
  const options = useRef([]);
  const ITEM_HEIGHT = 48;
  const [productRatings, setProductRatings] = useState([]);
  const userRating = useRef(0);
  const [open, setOpen] = useState(false);
  const [openUserOptions, setOpenUserOptions] = useState(false);
  const [highlighted, setHighlighted] = useState("");
  const anchorRef = useRef(null);
  const anchorRefUser = useRef(null);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  const handleCloseUser = (event) => {
    if (anchorRefUser.current && anchorRefUser.current.contains(event.target)) {
      return;
    }

    setOpenUserOptions(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);

  useEffect(() => {

    if (selectedProduct) {
      db.collection("products")
        // get the specific product
        .doc(selectedProduct?.id)
        .collection("review_rating")
        // when cloud firestore sends a snapshot of the data, iterate through it's elements
        .onSnapshot((snapshot) => {
          //   loop over each user who rated the product
          snapshot.docs.forEach((doc) => {
            //   add all the ratings to the array
            setProductRatings((productRatings) => [
              ...productRatings,
              doc.data().rating,
            ]);
            if (doc.id === user?.uid) {
              // add his rating to the variable
              // setUserRating(doc.data().rating);
              userRating.current = doc.data().rating;
            }
          });
        });
    }
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

   if (user) { 
     const keepBasket = async () => {
      dispatch({
        type: "EMPTY_BASKET",
      });
      const basketCollection = db
        .collection("users")
        .doc(user?.uid)
        .collection("basket");
      const snapshot = await basketCollection.get();
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          // console.log('basket fetch',doc, doc.data());
          dispatch({
            type: "ADD_TO_BASKET",
            item: {
              docId: doc.id,
              id: doc.data().id,
              title: doc.data().title,
              image: doc.data().image,
              price: doc.data().price,
              rating: doc.data().rating,
            },
          });
        });
      }
    }
    if (basket?.length === 0) {
      keepBasket()
    }
      
    }
  }, [open, user]);

  products.forEach((product) => {
    options.current.push(product.data.title);
  });

  const handleOpenUser = (e) => {
    setOpenUserOptions(!openUserOptions);
  };

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
    setTypedProduct(product?.data?.title);
    setSelectedProduct(product);
    setOpen(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (filteredProducts[0]) {
        sendToSeachBar(filteredProducts[0]);
        setSearchByEnter(true);
      }
    }
  };

  useEffect(() => {
    if (selectedProduct && searchByEnter) {
      goToProduct();
      setSearchByEnter(false);
    }
  }, [searchByEnter]);

  const goToProduct = () => {
    if (selectedProduct) {
      const docId = selectedProduct.id;
      const id = selectedProduct.data.id;
      const title = selectedProduct.data.title;
      const brand = selectedProduct.data.brand;
      const image = selectedProduct.data.image;
      const price = selectedProduct.data.price;
      const rating = userRating.current;
      const avgRating = selectedProduct.data.avgRating;
      history.push({
        pathname: "/product/" + docId,
        state: {
          docId,
          id,
          title,
          brand,
          image,
          price,
          avgRating,
          rating,
          productRatings,
        },
      });

      userRating.current = 0;
      setProductRatings([]);
    }
  };
  
  return (
    <nav className="header w-full">
      <div className="header__containerSmall ">
        <div className="header__topNav ">
          <Link to="/">
            <img
              className="header__logo w-24 "
              alt="Amazon Logo"
              src={rootUrl + "./amazon_logo.png"}
            />
          </Link>
          <div className="header__rightSide ">
            <div
              ref={anchorRefUser}
              className="header__user flex items-center relative"
            >
              {/* <span
                onClick={handleOpenUser}
                className=" header__mobileText mt-2 mx-2"
              >
                Hello {!user ? "Guest" : user.username}
              </span> */}

              <img
                onClick={handleOpenUser}
                className="header__gif"
                src="https://images-na.ssl-images-amazon.com/images/G/01/gno/sprites/account-wave2x._CB403841047_.gif"
                alt=""
              />

              <Popper
                open={openUserOptions}
                anchorEl={anchorRefUser.current}
                transition
                disablePortal
                className="user_list"
              >
                <Paper
                  id="menu-list-container-user"
                  style={{
                    maxHeight: ITEM_HEIGHT * 5,
                  }}
                >
                  <ClickAwayListener onClickAway={handleCloseUser}>
                    <MenuList id="menu-list">
                      <MenuItem>
                        <Link to={{ pathname: "/orders" }}>
                          <span className="text-white font-semibold">
                            Returns & Orders
                          </span>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          onClick={handleAuthenticaton}
                          to={!user ? "/login" : ''}
                        >
                          <span className="text-red-600 font-semibold">
                            {user ? "Sign Out" : "Sign In"}
                          </span>
                        </Link>
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Popper>
            </div>
            <Link className="flex items-center" to={{ pathname: "/checkout" }}>
              <div className="header__optionBasket">
                <img
                  className="header__basketIcon"
                  alt="Basket Icon"
                  src={rootUrl + "./cart.png"}
                />
                <span className="header__basketCount">{basket?.length}</span>
                <div className="header__basketOption">
                  <span className=" header__optionLineTwo header__optionCart">
                    Cart
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="header__search__wrapper w-full mb-3 sm:mb-0">
          <div className="header__search relative">
            <input
              className="header__searchInput"
              onKeyUp={handleKeyUp}
              type="text"
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onChange={(e) => setTypedProduct(e.target.value)}
              value={typedProduct}
              onKeyPress={handleKeyPress}
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
                          src={product?.data.image}
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
      </div>
      <div className="header__containerBig flex flex-col sm:flex-row justify-between items-center mx-auto px-5 sm:px-0">
        <Link to="/">
          <img
            className="header__logo w-40 sm:w-24 mb-3 sm:mb-0 sm:mx-5"
            alt="Amazon Logo"
            src={rootUrl + "./amazon_logo.png"}
          />
        </Link>

        <div className="header__search__wrapper w-full mb-3 sm:mb-0">
          <div className="header__search relative">
            <input
              className="header__searchInput"
              onKeyUp={handleKeyUp}
              type="text"
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onChange={(e) => setTypedProduct(e.target.value)}
              value={typedProduct}
              onKeyPress={handleKeyPress}
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
                          src={product?.data.image}
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
        <div className="header__nav justify-evenly">
          <Link to={user ? "/" : "/login"}>
            <div onClick={handleAuthenticaton} className="header__option">
              <span className="header__optionLineOne">
                Hello <span className="capitalize">{!user ? "Guest" : username}</span>
              </span>
              <span className="header__optionLineTwo">
                {user ? "Sign Out" : "Sign In"}
              </span>
            </div>
          </Link>
          <Link to={{ pathname: "/orders" }}>
            <div className="header__option  ">
              <span className="header__optionLineOne">Returns</span>
              <span className="header__optionLineTwo">& Orders</span>
            </div>
          </Link>
          <div className="header__option  ">
            <span className="header__optionLineOne">Your</span>
            <span className="header__optionLineTwo">Prime</span>
          </div>
          <Link className="flex items-center" to={{ pathname: "/checkout" }}>
            <div className="header__optionBasket">
              <img
                className="header__basketIcon"
                alt="Basket Icon"
                src={rootUrl + "./cart.png"}
              />
              <span className="header__basketCount">{basket?.length}</span>
              <div className="header__basketOption">
                <span className="header__optionLineOne invisible">Your</span>
                <span className="header__optionLineTwo">Cart</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
