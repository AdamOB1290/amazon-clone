import React, { useEffect, useState, useRef, Component, PropTypes } from "react";
import "./Header.css";
import SearchIcon from "@material-ui/icons/Search";
import { ShoppingBasket } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";
import { db } from "./firebase";
import Dropdown from "./Dropdown";

function Header() {
  const [rootUrl, setRootUrl] = useState("http://localhost:3000/");
  const [{ basket, user }, dispatch] = useStateValue();
  const [searchValue, setSearchValue] = useState("");
  const [searching, setSearching] = useState("hidden");
  const [products, setProducts] = useState([]);
  const options = useRef([]);

  useEffect(() => {
    db.collection("products")
    .orderBy("id", "asc")
    // when cloud firestore sends a snapshot of the data, iterate through it's elements
    .onSnapshot((snapshot) =>
      // map the content of each element to the defined properties
      setProducts(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      }))),
    );

  }, []);

  products.forEach(product => {
    options.current.push(product.data.title)
  });

  const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
    }
  };
  const showSearchResult = () => {
    setSearching('')
  };

  // const handleChange = event => {
  //   console.log(searchValue);
  //   setSearchValue(event.target);
  //   console.log(searchValue);
  // };

  return (
    <div className="header flex justify-between items-center w-full">
      <Link to="/">
        <img className="header__logo" src={rootUrl + "./amazon_logo.png"} />
      </Link>

      <div className="header__search__wrapper">
        
        <div className="header__search relative">
          <input className="header__searchInput" onChange={showSearchResult} type="text" />
          <SearchIcon className="header__searchIcon" />
          {/* <Dropdown
              /> */}
          {/* <div className={"search__results "+ searching}></div> */}
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
