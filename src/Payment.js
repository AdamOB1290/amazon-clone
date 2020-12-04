import React, { useState, useEffect } from "react";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from "./axios";
import { db } from "./firebase";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const history = useHistory();

  const firebase = require("firebase");

  const stripe = useStripe();

  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);

  const [processing, setProcessing] = useState("");

  const [error, setError] = useState(null);

  const [disabled, setDisabled] = useState(true);

  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    console.log("BASKETPAYMENT", basket, user);
    // IF USER IS CONNECTED AND BASKET HAS SOMETHING IN IT, SAVE IT IN THE DATABASE
    if (user) {
      async function getBasket() {
        const basketCollection = db
          .collection("users")
          .doc(user?.uid)
          .collection("basket");
        console.log("PATH", basketCollection);
        const snapshot = await basketCollection.get();
        if (snapshot.empty) {
          console.log("No matching basket collection.");
          return;
        }

        snapshot.forEach((doc) => {
          console.log("basketsnapshot", doc.id, "=>", doc.data());
          const basketProduct = doc.data();
          for (let index = 0; index < doc.data().quantity; index++) {
            dispatch({
              type: "ADD_TO_BASKET",
              item: {
                docId: doc.id,
                id: basketProduct.id,
                title: basketProduct.title,
                image: basketProduct.image,
                price: basketProduct.price,
                rating: basketProduct.rating,
              },
            });
          }
        });
      }

      if (basket?.length === 0) {
        getBasket();
      }

      ////////////////////////////////////////////////////////////
    }
    /////////////////////////////////////////////////////////////

    console.log("THE SECRET before IS >>>", clientSecret);

    // console.log(basket);
    // generate the special stripe secret which allows us to charge a customer
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        // Stripe expects the total in a currencies subunits
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });
      console.log("client secret", response.data.clientSecret);
      setClientSecret(response.data.clientSecret);
      console.log("total", getBasketTotal(basket) * 100);
    };

    getClientSecret();
  }, [user, basket]);

  console.log("THE SECRET after IS >>>", clientSecret);
  // console.log('👱', user)

  const handleSubmit = async (event) => {
    // do all the fancy stripe stuff...
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        // paymentIntent = payment confirmation

        db.collection("users")
          .doc(user?.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            basket: basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          });

        setSucceeded(true);
        setError(null);
        setProcessing(false);
        deleteCollection();
        // Use history.replace() instead of history.push() to prevent user from going back to paiement page once the paiement was processed
        history.replace("/orders");
      });
  };

  const deleteCollection = async () => {
    const basketCollection = db
      .collection("users")
      .doc(user?.uid)
      .collection("basket");
    const snapshot = await basketCollection.get();
    if (snapshot.empty) {
      console.log("No matching basket collection.");
      return;
    }
    snapshot.forEach((doc) => {
      basketCollection.doc(doc.id).delete();
      console.log(snapshot.docs.length);
      if (snapshot.docs.length > 1) {
        console.log(snapshot.docs.length === 0);
        dispatch({
          type: "EMPTY_BASKET",
        });
        console.log("EMPTY BASKET SUCCCESS");
      }
    });
  };

  const handleChange = (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  return (
    <div className="payment w-full sm:w-9/12 mx-auto">
      <div className="payment__container mb-10">
        <h1 className="text-xl font-semibold">
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>

        {/* Payment section - delivery address */}
        <div className="payment__section border-b">
          <div className="payment__title">
            <h3 className="font-semibold">Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>123 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>

        {/* Payment section - Review Items */}
        <div className="payment__section border-b">
          <div className="payment__title">
            <h3 className="font-semibold">Review items and delivery</h3>
          </div>
          <div className="payment__items">
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

        {/* Payment section - Payment method */}
        <div className="payment__section">
          <div className="payment__title">
            <h3 className="font-semibold">Payment Method</h3>
          </div>
          <div className="payment__details">
            {/* Stripe magic will go */}

            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <h3>
                      Order Total: <span className="font-bold">{value}</span>{" "}
                    </h3>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button
                  className="mt-2 bg-orange-500 hover:bg-orange-600 focus:outline-none text-gray-800 font-normal py-1 rounded button_effect border w-full"
                  disabled={processing || disabled || succeeded}
                >
                  <span className="font-semibold">
                    {processing ? <p>Processing</p> : "Buy Now"}
                  </span>
                </button>
              </div>

              {/* Errors */}
              {error && <div className="text-red-700">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
