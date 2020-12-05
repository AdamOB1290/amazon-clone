import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import Payment from "./Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from "./Orders";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import ProductDetails from "./ProductDetails";
import { db } from "./firebase";
import { Seeder } from "./Seeder";
import Footer from "./Footer";

const promise = loadStripe(
  "****REMOVED****"
);

function App() {
  // const [username, setUsername] = useState();
  const [{}, dispatch] = useStateValue();

  // will only run once when the app component loads...
  useEffect(() => {
    // uncomment to seed products:
    // Seeder()

    auth.onAuthStateChanged((authUser) => {
      // console.log("THE USER IS >>> ", authUser);
      if (authUser) {
        (async () => {
          const doc = db.collection("users").doc(authUser?.uid);
          const docReady = await doc.get();
          if (!docReady.exists) {
            console.log("This user doesn't exist!");
          } else {
            // the user just logged in / the user was logged in
            dispatch({
              type: "SET_USER",
              user: authUser,
              username: docReady.data().username,
            });
          }
        })();
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
        dispatch({
          type: "SET_USERNAME",
          username: null,
        });
      }
    });
  }, []);

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/product/:id">
            <Header />
            <ProductDetails />
            <Footer />
          </Route>
          <Route path="/orders/:param?">
            <Header />
            <Orders />
            <Footer />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
            <Footer />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
            <Footer />
          </Route>
          <Route path="/">
            <Header />
            <Home />
            <Footer />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
