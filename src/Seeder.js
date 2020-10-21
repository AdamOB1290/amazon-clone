import Unsplash, { toJson } from "unsplash-js";
import fetch from "node-fetch";
import { db, auth } from "./firebase";
const faker = require("faker");
global.fetch = fetch;

const unsplash = new Unsplash({
  accessKey: "BO7UVVZfZ6KFAds692bBUhxSWsYLfl2dik_NaPqcLqk",
});

export const Seeder = () => {
  let products = [];
  let key = 1;

  for (let index = 1; index < 7; index++) {
    unsplash.search
      .photos("product", index, 30, { orientation: "squarish" })
      .then(toJson)
      .then((json) => {
        json.results.forEach((product) => {
          if (product.description && product.alt_description) {
            products.push({
              id: key++,
              title: product.alt_description,
              description: product.description,
              price: faker.commerce.price(),
              image: product.urls.full,
            });
          }
        });
      });
  }

  

//   const productImages = [
//     "./productImages/61B04f0ALWL._AC_SY240_.jpg",
//     "./productImages/61uHJ+pWHSL._AC_SY600_.jpg",
//     "./productImages/71gK7VlDnGL._AC_SY600_.jpg",
//     "./productImages/71I13Ws9GCL._AC_SY600_.jpg",
//     "./productImages/71KxwR9f4TL._AC_SY600_.jpg",
//     "./productImages/81+jNVOUsJL._AC_SY600_.jpg",
//     "./productImages/81BCS8w0v9L._AC_SY600_.jpg",
//     "./productImages/81L9+4dTIgL._SX522_.jpg",
//     "./productImages/611xsvsKqVL._AC_SY240_.jpg",
//     "./productImages/810i8W-qRHL._AC_SY600_.jpg",
//   ];

setTimeout(() =>{
    console.log(products.length);
    products.forEach((product, i) => {
        console.log(product);
      db.collection("products").add({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
      });
     
    });
}, 5000)
    
    
};
