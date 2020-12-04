import React from "react";
import "./Order.css";
import moment from "moment";
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";

function Order({ order }) {
  console.log();
  return (
    <div className="order">
      <h2 className="text-xl font-semibold">
        Order :{" "}
        <span className="text-base border-b bg-gray-200 px-2 py-1 mb-2 rounded">
          {order.id}
        </span>
      </h2>
      <p className="text-xl font-semibold">
        {moment.unix(order.data.created).format("MMMM Do YYYY, h:mma")}
      </p>
      <div className="checkout_products_wrapper flex flex-wrap">
        {order.data.basket?.map((item, i) => (
          <CheckoutProduct
            key={i}
            docId={order.id}
            id={item.id}
            title={item.title}
            image={item.image}
            price={item.price}
            rating={item.rating}
            hideButton
          />
        ))}
      </div>
      <CurrencyFormat
        renderText={(value) => (
          <h3 className="order__total text-2xl font-bold mt-8">
            Order Total: {value}
          </h3>
        )}
        decimalScale={2}
        value={order.data.amount / 100}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />
    </div>
  );
}

export default Order;
