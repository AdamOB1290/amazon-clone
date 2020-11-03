import React, { useState, useEffect } from "react";
import "./Footer.css";
import WindowDimensions from "./WindowDimensions";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

function Footer() {
  const [rootUrl] = useState("http://localhost:3000/");
  const [openFirst, setOpenFirst] = useState(true);
  const [openSecond, setOpenSecond] = useState(true);
  const [openThird, setOpenThird] = useState(true);
  const [openFourth, setOpenFourth] = useState(true);
  const [expandable, setExpandable] = useState(false);
  const { width } = WindowDimensions();
  useEffect(() => {
    if (width < 500) {
      setExpandable(true);
      setOpenFirst(true);
      setOpenSecond(false);
      setOpenThird(false);
      setOpenFourth(false);
    } else {
      setExpandable(false);
      setOpenFirst(true);
      setOpenSecond(true);
      setOpenThird(true);
      setOpenFourth(true);
    }
  }, [width]);
  const handleClick = (expression) => {
    switch (expression) {
      case "openFirst":
        setOpenFirst(!openFirst);
        break;
      case "openSecond":
        setOpenSecond(!openSecond);
        break;
      case "openThird":
        setOpenThird(!openThird);
        break;
      case "openFourth":
        setOpenFourth(!openFourth);
        break;
      default:
        console.log("No match found.");
    }
  };
  return (
    <div className="footer">
      <div className="footer__links">
        <div className="footer_links_container">
        <div className="footer__linksColumn">
          <ul>
            <li className="font-bold mb-1 footer__listParent" onClick={() =>
                    expandable? handleClick("openFirst") : undefined
                  }>
              Let Us Help You{" "}
              {openFirst ? (
                <ExpandLess
                  className="footer__expandIcon"
                />
              ) : (
                <ExpandMore
                  className="footer__expandIcon"
                  
                />
              )}
            </li>
            <Collapse in={openFirst} timeout="auto" unmountOnExit>
              <li className="text-sm footer__listChild">Amazon and COVID-19</li>
              <li className="text-sm footer__listChild">Your Account</li>
              <li className="text-sm footer__listChild">Your Orders</li>
              <li className="text-sm footer__listChild">
                Shipping Rates & Policies
              </li>
              <li className="text-sm footer__listChild">
                Returns & Replacements
              </li>
              <li className="text-sm footer__listChild">
                Manage Your Content and Devices
              </li>
              <li className="text-sm footer__listChild">Amazon Assistant</li>
              <li className="text-sm footer__listChild">Help</li>
            </Collapse>
          </ul>
        </div>
        <div className="footer__linksColumn">
          <ul>
            <li className="font-bold mb-1 footer__listParent" onClick={() =>
                    expandable? handleClick("openSecond") : undefined
                  }>
              Make Money with Us{" "}
              {openSecond ? (
                <ExpandLess
                  className="footer__expandIcon"
                  
                />
              ) : (
                <ExpandMore
                  className="footer__expandIcon"
                  
                />
              )}
            </li>
            <Collapse in={openSecond} timeout="auto" unmountOnExit>
              <li className="text-sm footer__listChild">
                Sell products on Amazon
              </li>
              <li className="text-sm footer__listChild">Sell apps on Amazon</li>
              <li className="text-sm footer__listChild">Become an Affiliate</li>
              <li className="text-sm footer__listChild">
                Advertise Your Products
              </li>
              <li className="text-sm footer__listChild">
                Self-Publish with Us
              </li>
              <li className="text-sm footer__listChild">Host an Amazon Hub</li>
              <li className="text-sm footer__listChild">
                See More Make Money with Us
              </li>
            </Collapse>
          </ul>
        </div>
        <div className="footer__linksColumn">
          <ul>
            <li className="font-bold mb-1 footer__listParent" onClick={() =>
                    expandable? handleClick("openThird") : undefined
                  }>
              Amazon Payment Products{" "}
              {openThird ? (
                <ExpandLess
                  className="footer__expandIcon"
                />
              ) : (
                <ExpandMore
                  className="footer__expandIcon"
                />
              )}
            </li>
            <Collapse in={openThird} timeout="auto" unmountOnExit>
              <li className="text-sm footer__listChild">
                Amazon Business Card
              </li>
              <li className="text-sm footer__listChild">Shop with Points</li>
              <li className="text-sm footer__listChild">Reload Your Balance</li>
              <li className="text-sm footer__listChild">
                Amazon Currency Converter
              </li>
            </Collapse>
          </ul>
        </div>
        <div className="footer__linksColumn">
          <ul>
            <li className="font-bold mb-1 footer__listParent"onClick={() =>
                    expandable? handleClick("openFourth") : undefined
                  }>
              Get to Know Us{" "}
              {openFourth ? (
                <ExpandLess
                  className="footer__expandIcon"
                />
              ) : (
                <ExpandMore
                  className="footer__expandIcon"
                />
              )}
            </li>
            <Collapse in={openFourth} timeout="auto" unmountOnExit>
              <li className="text-sm footer__listChild">Careers</li>
              <li className="text-sm footer__listChild">Blog</li>
              <li className="text-sm footer__listChild">About Amazon</li>
              <li className="text-sm footer__listChild">Sustainability</li>
              <li className="text-sm footer__listChild">Investor Relations</li>
              <li className="text-sm footer__listChild">Amazon Devices</li>
              <li className="text-sm footer__listChild">Amazon Tours</li>
            </Collapse>
          </ul>
        </div>
      </div>
      </div>
      <div className="footer__tradeMark ">
        <div className="footer__logoContainer">
          <img className="footer__logo ml-2" src={rootUrl + "./amazon_logo.png"} />
        </div>
        <a href="/#" className="footer__legal">
          Conditions of Use
        </a>
        <a href="/#" className="footer__legal">
          Privacy Notice
        </a>
        <a href="/#" className="footer__legal">
          Interest-Based Ads
        </a>
        <span className="footer__iso">
          © 1996-2020, Amazon.com, Inc. or its affiliates
        </span>
      </div>
    </div>
  );
}

export default Footer;