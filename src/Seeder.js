import Unsplash, { toJson } from "unsplash-js";
import fetch from "node-fetch";
import { db } from "./firebase";
const faker = require("faker");
global.fetch = fetch;

const unsplash = new Unsplash({
  accessKey: "****REMOVED****",
});

export const Seeder = () => {
  let products = [];
  let key = 1;

  for (let index = 1; index < 3; index++) {
    unsplash.search
      .photos("product", index, 24, { orientation: "squarish" })
      .then(toJson)
      // eslint-disable-next-line no-loop-func
      .then((json) => {
        json.results.forEach((product) => {
          if (product.description && product.alt_description) {
            let title;
            let description;
            if (product.description.length < product.alt_description.length) {
              title = product.description;
              description = product.alt_description;
            } else {
              title = product.alt_description;
              description = product.description;
            }

            products.push({
              id: key++,
              title: title,
              description: description,
              brand: faker.company.companyName(),
              price: faker.commerce.price(),
              image: product.urls.regular,
            });
          }
        });
      });
  }

  setTimeout(() => {
    console.log(products.length);
    products.forEach((product, i) => {
      console.log(product);
      db.collection("products").add({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        image: product.image,
        description: product.description,
      });
    });
  }, 5000);
};
