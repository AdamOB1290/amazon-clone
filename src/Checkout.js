import React, { useEffect, useState } from "react";
import "./Checkout.css";
import Subtotal from "./Subtotal";
import { useStateValue } from "./StateProvider";
import { Link, useLocation } from "react-router-dom";
import CheckoutProduct from "./CheckoutProduct";
import SlickCarousel from "./SlickCarousel";
import { db } from "./firebase";
import ScaleLoader from "react-spinners/ScaleLoader";

function Checkout() {
  const [{ basket, user, username }, dispatch] = useStateValue();
  const [loader, setloader] = useState(true);

  const location = useLocation();

  useEffect(() => {
    // IF USER IS CONNECTED AND BASKET HAS SOMETHING IN IT, SAVE IT IN THE DATABASE
    if (user) {
      async function getBasket() {
        // const basketCollection = db
        //   .collection("users")
        //   .doc(user?.uid)
        //   .collection("basket");
        // const snapshot = await basketCollection.get();
        // setloader(false);
        // if (snapshot.empty) {
        //   console.log("No matching basket collection.");
        //   return;
        // }
        // snapshot.forEach((doc) => {
        //   console.log("basketsnapshot", doc.id, "=>", doc.data());
        //   const basketProduct = doc.data();
        //   for (let index = 0; index < doc.data().quantity; index++) {
        //     dispatch({
        //       type: "ADD_TO_BASKET",
        //       item: {
        //         docId: doc.id,
        //         id: basketProduct.id,
        //         title: basketProduct.title,
        //         image: basketProduct.image,
        //         price: basketProduct.price,
        //         rating: basketProduct.rating,
        //       },
        //     });
        //   }
        // });
      }
    }
    if (basket?.length > 0) {
      // getBasket();
      setloader(false);
    } else {
      setTimeout(() => {
        setloader(false);
      }, 3000);
    }
  }, [user, basket]);

  return (
    <div className="checkout flex flex-col w-10/12 mx-auto">
      <div className="checkout__basket flex flex-col bg-white p-6 sm:p-10 mx-3 rounded shadow">
        <img
          className="checkout__ad w-full hidden sm:block lg:hidden"
          src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
          alt=""
        />

        <div className="flex">
          <div className="checkout__left flex flex-col justify-end mr-2 w-full sm:w-9/12">
            <img
              className="checkout__ad hidden lg:block"
              src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
              alt=""
            />
            <h3 className="font-semibold">
              Hello,{" "}
              <span className="capitalize">{!user ? "Guest" : username}</span>
            </h3>
            <h2 className="checkout__title font-semibold mt-2 mr-3 mb-4 lg:mb-3">
              Your shopping Basket
            </h2>
          </div>
          <div className="checkout__right w-3/12 hidden sm:block">
            <Subtotal className="" />
          </div>
        </div>
        <div>
          {!basket.length > 0 || loader ? (
            <div
              className={`mt-5 w-full bg-gray-400 h-64 bg-opacity-25 flex items-center justify-center ${
                user && loader ? "animate-pulse" : ""
              }`}
            >
              {user && loader ? (
                <div className="sweet-loading opacity-100 bg-opacity-100">
                  <ScaleLoader
                    // css={override}
                    height={50}
                    color={"#2196f3"}
                    loading={true}
                  />
                </div>
              ) : (
                <div>
                  <p className="text-xl font-semibold text-gray-600">
                    Your basket is empty
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="checkout__wrapper">
              {basket.map((item, i) => (
                <CheckoutProduct
                  key={i}
                  docId={item.docId}
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  price={item.price}
                  rating={item.rating}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-5 block w-full sm:hidden">
          <Subtotal className="" />
        </div>
      </div>
      <div className="carousel__title mt-5 bg-white flex justify-center sm:justify-between items-center rounded py-2 px-5 mx-3 shadow">
        <span className="text-xl">Product Recommandations</span>
        <Link to="/home">
          <span className="hidden sm:inline-block text-base font-semibold text-orange-400">
            Get More Products
          </span>
        </Link>
      </div>
      <div className="carousel__wrapper mt-2 w-full mx-auto">
        <SlickCarousel products={location?.state?.products} />
      </div>
    </div>
  );
}

export default Checkout;
