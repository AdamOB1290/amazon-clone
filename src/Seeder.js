import { db, auth } from "./firebase";
const faker = require('faker');

  export const Seeder = () => {

    const productImages= [
        "./productImages/61B04f0ALWL._AC_SY240_.jpg",
        "./productImages/61uHJ+pWHSL._AC_SY600_.jpg",
        "./productImages/71gK7VlDnGL._AC_SY600_.jpg",
        "./productImages/71I13Ws9GCL._AC_SY600_.jpg",
        "./productImages/71KxwR9f4TL._AC_SY600_.jpg",
        "./productImages/81+jNVOUsJL._AC_SY600_.jpg",
        "./productImages/81BCS8w0v9L._AC_SY600_.jpg",
        "./productImages/81L9+4dTIgL._SX522_.jpg",
        "./productImages/611xsvsKqVL._AC_SY240_.jpg",
        "./productImages/810i8W-qRHL._AC_SY600_.jpg"
    ]
    
    
    productImages.forEach((productImage, i) => {
        const randomProductName = faker.commerce.productName();
        const randomProductPrice = faker.commerce.price();
        db.collection('products').add({
            id: i+1,
            title: randomProductName,
            price: randomProductPrice,
            image: productImage
        })
    });
    
}








