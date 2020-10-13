import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import Payment from "./Payment";
import Orders from "./Orders";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Seeder } from "./Seeder";

const promise = loadStripe(
  "pk_test_51HaKtxLmKNc2Zf4wDfcQFoGnnnscwR9HqL0glyL8MntlsM8TOEd57huVdqfDibRWMacgpx93VegqTQQnyFko27QC00hzj4CV37"
);

function App() {

  const [{ }, dispatch] = useStateValue();

  useEffect(() => {
    // will only run once when the app component loads...

    // uncomment to seed products:
    // Seeder()

    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>> ", authUser);

      if (authUser) {
        // the user just logged in / the user was logged in

        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
      // db.collection('users').doc('J22cvNQ9i2Sf7Xbz3uIDgEZ2jaN2').collection('orders').get().then((snapshot) => {
      //   console.log(snapshot.docs)
      //   snapshot.docs.forEach(doc => {
      //     console.log(doc.listCollections())
      //   })
      // })

      // db
      //   .collection('users')
      //   .doc(user?.uid)
      //   .collection('orders')
      //   .orderBy('created', 'desc')
      //   // when cloud firestore sends a snapshot of the data, iterate through it's elements
      //   .onSnapshot(snapshot => (
      //       // map the content of each element to the defined properties
      //       setOrders(snapshot.docs.map(doc => ({
      //           id: doc.id,
      //           data: doc.data()
      //       })))
      //   ))
    });

    
  }, []);

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/orders">
            <Header />
            <Orders />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
