import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./Orders.css";
import { useStateValue } from "./StateProvider";
import Order from "./Order";
import { Link, useLocation } from "react-router-dom";
import SlickCarousel from "./SlickCarousel";
import { Card } from "@material-ui/core";

function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user?.uid)
        .collection("orders")
        .orderBy("created", "desc")
        // when cloud firestore sends a snapshot of the data, iterate through it's elements
        .onSnapshot((snapshot) =>
          // map the content of each element to the defined properties
          setOrders(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <div className="orders mx-auto w-full sm:w-10/12 sm:py-5">
      <div
        className="py-5 sm:px-10 sm:p-10 w-full rounded shadow"
        style={{ background: "#edf2f747" }}
      >
        <Card className="px-8 py-2 mb-3 flex justify-between items-center font-semibold">
          <h1 className="text-3xl ">Your Orders</h1>
          <span className="text-xl">Nb° : {orders?.length}</span>
        </Card>
        <div className="orders__order">
          {orders?.map((order, i) => (
            <Card key={i}>
              <Order  order={order} />
            </Card>
          ))}
        </div>
      </div>
      <div className="carousel__title sm:mt-5 bg-white flex justify-center sm:justify-between items-center rounded py-2 px-5 shadow">
        <span className="text-xl">Product Recommendations</span>
        <Link to="/home">
          <span className="hidden sm:inline-block text-base font-semibold text-orange-400">
            Buy More Products
          </span>
        </Link>
      </div>
      <div className=" carousel__wrapper mt-2 w-10/12 sm:w-full mx-auto">
        <SlickCarousel products={location?.state?.products} />
      </div>
    </div>
  );
}

export default Orders;
