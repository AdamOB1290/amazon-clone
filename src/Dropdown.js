import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";

function Dropdown({ setReviewed, setEditClicked, setReview, reviewContent, productId, dropItems }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const firebase = require("firebase");

  const [{ user }, dispatch] = useStateValue();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const editReview = () => {
    setReview(reviewContent)
    setReviewed(false)
    setEditClicked(true)
    handleClose();
  };

  const deleteReview = () => {
    db.collection("products")
        .doc(productId)
        .collection("review_rating")
        .doc(user.uid)
        .update({
          created_at: firebase.firestore.FieldValue.delete(),
          review: firebase.firestore.FieldValue.delete(),
          username: firebase.firestore.FieldValue.delete()
        });
        handleClose();
        setReviewed(false)
  };

  

  return (
    <div>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHorizIcon style={{ fontSize: 25 }} />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        
          <MenuItem  onClick={editReview}>{dropItems[0]}</MenuItem>
          <MenuItem  onClick={deleteReview}>{dropItems[1]}</MenuItem>
        
      </Menu>
    </div>
  );
}

export default Dropdown;
