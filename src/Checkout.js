import React, { useEffect } from "react";
import "./Checkout.css";
import Subtotal from "./Subtotal";
import { useStateValue } from "./StateProvider";
import { Link, useLocation } from "react-router-dom";
import CheckoutProduct from "./CheckoutProduct";
import SlickCarousel from "./SlickCarousel";
import { db } from "./firebase";

function Checkout() {
  const [{ basket, user }] = useStateValue();
  const location = useLocation();
  console.log(basket);

  // NEED TO CONNECT DATABASE WITH BASKET SO THAT THEY ARE ALWAYS LINKED
  useEffect(() => {
    console.log(basket);
    // IF USER IS CONNECTED AND BASKET HAS SOMETHING IN IT, SAVE IT IN THE DATABASE
    if (user) {
      async function getMultiple() {
        // [START get_multiple]
        const basketColl = db
          .collection("users")
          .doc(user?.uid)
          .collection("basket");
        const snapshot = await basketColl.get();
        // if (snapshot.empty) {
        //   console.log("No matching collection.");
        //   return;
        // }

        snapshot.forEach((doc) => {
          // console.log(doc.id, "=>", doc.data());
        });
        // [END get_multiple]
        if (basket) {
          basket.forEach((product, i) => {
            basketColl.doc(product.docId).set({
              id: product.id,
              title: product.title,
              price: product.price,
              rating: product.rating,
              image: product.image,
            });
          });
        }
      }
      getMultiple();
    }
  });

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
            <h3 className="font-semibold">Hello, {user?.email}</h3>
            <h2 className="checkout__title font-semibold mt-2 mr-3 mb-4 lg:mb-3">
              Your shopping Basket
            </h2>
          </div>
          <div className="checkout__right w-3/12 hidden sm:block">
            <Subtotal className="" />
          </div>
        </div>
        <div>
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
