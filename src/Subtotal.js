import React, { useState } from "react";
import "./Subtotal.css";
import CurrencyFormat from "react-currency-format";
import { useStateValue } from "./StateProvider";
import { getBasketTotal } from "./reducer";
import { Link, useHistory } from "react-router-dom";
import { ClickAwayListener, Popper } from "@material-ui/core";

function Subtotal() {
  const history = useHistory();
  const [{ user, basket }, dispatch] = useStateValue();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleClick = (event) => {
    if (basket?.length > 0) {
      history.push("/payment")
    } else {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    }
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  return (
    <div className="subtotal">
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal ({basket.length} items): <strong>{value}</strong>
            </p>
            <small className="subtotal__gift">
              <input type="checkbox" /> This order contains a gift
            </small>
          </>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />
      <Link
        to={{
          pathname: !user ? "/login" : "",
          state: {
            loginMessage:
              "You need to sign in order to proceed with the payment",
          },
        }}
      >
        <button
          className="w-full mt-2 bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-1 px-2 rounded button_effect border"
          onClick={handleClick}
        >
          Proceed to Checkout
        </button>
      </Link>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className="mt-5 bg-red-600 px-3 pb-1 rounded shadow warning_shake">
            <span className="text-white text-xs">
              Checkout unavailable whilst your basket is empty
            </span>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}

export default Subtotal;
