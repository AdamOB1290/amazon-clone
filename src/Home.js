import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import Product from "./Product";
import Pagination from "./Pagination";
import { db } from "./firebase";
import WindowDimensions from "./WindowDimensions";
import { useStateValue } from "./StateProvider";

function Home() {
  const { width } = WindowDimensions();
  const [{ user }] = useStateValue();
  const [amazonBanner, setAmazonBanner] = useState("./amazon_banner.jpg");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const [userFavoriteArray, setUserFavoriteArray] = useState([]);
  const [indexFavorite, setIndexFavorite] = useState([]);

  useEffect(() => {
    const updateFavoriteState = async () => {
      if (user) {
        const favorites = db
          .collection("users")
          .doc(user?.uid)
          .collection("favorited");
        const snapshot = await favorites.get();
        if (snapshot.empty) {
          console.log("No matching collection.");
          return;
        }

        snapshot.forEach((doc) => {
          // console.log(doc.id);
          setUserFavoriteArray((userFavoriteArray) => [
            ...userFavoriteArray,
            doc?.id,
          ]);
        });
      }
    };
    updateFavoriteState();
    if (width < 768) {
      setAmazonBanner("./amazon_banner_mobile.jpg");
    } else {
      setAmazonBanner("./amazon_banner.jpg");
    }
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
  }, [width, user, currentPage]);

  useEffect(() => {
    let index;
    userFavoriteArray.forEach((savedProduct) => {
      index = products.findIndex((x) => x.id === savedProduct);
      setIndexFavorite((indexFavorite) => [...indexFavorite, index]);
    });

    // Use an empty array as 2nd parameter of useEffect to make it execute on mount and unmount
    // thus avoiding an infinite loop
  }, [userFavoriteArray]);
  useEffect(() => {
    const updateFieldChanged = (arrIndex) => {
      let newArr = [...products]; // copying the old datas array
      arrIndex.forEach((index) => {
        newArr[index] = {
          ...newArr[index],
          saved: true,
        };
      });
      // console.log(newArr);
      setProducts(newArr);
    };
    updateFieldChanged(indexFavorite);
    // Use an empty array as 2nd parameter of useEffect to make it execute on mount and unmount
    // thus avoiding an infinite loop
  }, [indexFavorite]);

  // console.log(products);

  return (
    <div className="home">
      <div className="home__container ">
        <img className="home__image" src={amazonBanner} alt="" />
        <div className="home__products">
          <div className="home__bannerContainer">
            <div className="home__banner">
              You are on amazon.com. You can subscribe to Amazon Prime for
              millions of products with fast local delivery.
            </div>
          </div>
          {currentProducts?.map((product, i) => (
            <Product
              key={i}
              docId={product.id}
              id={product.data.id}
              title={product.data.title}
              brand={product.data.brand}
              price={product.data.price}
              rating={product.data.rating}
              image={product.data.image}
              savedProp={product?.saved}
            />
          ))}
        </div>
        <div className="w-full flex my-5">
          <Pagination
            productsPerPage={productsPerPage}
            totalProducts={products.length}
            paginate={paginate}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;