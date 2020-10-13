import React, { useState, useEffect } from "react";
import "./Home.css";
import Product from "./Product";
import { db, auth } from "./firebase";

function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    db.collection("products")
      .orderBy("id", "asc")
      // when cloud firestore sends a snapshot of the data, iterate through it's elements
      .onSnapshot((snapshot) =>
        // map the content of each element to the defined properties
        setProducts(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }))),
      );
  // Use an empty array as 2nd parameter of useEffect to make it execute on mount and unmount
  // thus avoiding an infinite loop
  

  }, []);

  return (
    <div className="home">
      <div className="home__container">
        <img className="home__image" src="./amazon_banner.jpg" alt="" />
          {products?.map((product, i) => (
            <div className="home__row" key={i}>
              <Product
                docId={product.id}
                id={product.data.id}
                title={product.data.title}
                price={product.data.price}
                rating={product.data.rating}
                image={product.data.image}
              />
            </div>
          ))}
          
      </div>
    </div>
  );
}

export default Home;
