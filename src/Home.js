import React, { useState, useEffect } from "react";
import "./Home.css";
import Product from "./Product";
import Pagination from "./Pagination";
import { db, auth } from "./firebase";
// import Pagination from "@material-ui/lab/Pagination";

function Home() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginate= (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    db.collection("products")
      .orderBy("id", "asc")
      // when cloud firestore sends a snapshot of the data, iterate through it's elements
      .onSnapshot((snapshot) =>
        // map the content of each element to the defined properties
        setProducts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    // Use an empty array as 2nd parameter of useEffect to make it execute on mount and unmount
    // thus avoiding an infinite loop
  }, []);

  return (
    <div className="home">
      <div className="home__container">
        <img className="home__image" src="./amazon_banner.jpg" alt="" />
        <div className="home__products">
          {currentProducts?.map((product, i) => (
            <Product
              key={i}
              docId={product.id}
              id={product.data.id}
              title={product.data.title}
              price={product.data.price}
              rating={product.data.rating}
              image={product.data.image}
            />
          ))}
        </div>
        <Pagination
          productsPerPage={productsPerPage}
          totalProducts={products.length}
          paginate={paginate}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        {/* <Pagination count={10} showFirstButton showLastButton /> */}
      </div>
    </div>
  );
}

export default Home;
