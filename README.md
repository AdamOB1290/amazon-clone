# Amazon clone

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#demo">Demo</a></li>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>


<!-- Demo -->
## Demo

To see the demo, visit this link : https://youtu.be/xy7Y642nfAs

<a href="https://youtu.be/xy7Y642nfAs">![thumbnail](https://user-images.githubusercontent.com/68733361/101261741-be483980-3739-11eb-9719-8a48efda60ce.PNG)</a>




<!-- ABOUT THE PROJECT -->
## About The Project

As a third project, I made a clone of amazon that includes stripe payments as well as a star review system among other features. 

This project has been done in pair programming with [Diae Louali](https://github.com/Diae-Louali).

### Built With

* [React js](https://reactjs.org/)
* [Node js](https://nodejs.org/)


<!-- GETTING STARTED -->
## Getting Started

In order to make the project run on your computer, follow these steps :

NOTICE : 
* You can global search for " ****REMOVED**** " to easily locate all the information that needs to be replaced in the project.
* Firebase Blaze plan is required to make outbound requests to [Stripe](https://stripe.com/).


### Prerequisites

* [Stripe](https://stripe.com/) account

* [Firebase](https://firebase.google.com/) account

* [Unsplash](https://unsplash.com/developers) account


### Installation

* Clone the repo and cd into the project's folder

   ```sh
   git clone https://github.com/AdamOB1290/amazon-clone.git
   ```
   ```sh
   cd amazon-clone
   ```

* In your terminal, execute :

   ```sh
   npm install
   ```

* Cd to /functions and execure in your terminal :

   ```sh
   cd functions
   ```
   ```sh
   npm install
   ```

* In [Unsplash](https://unsplash.com/developers), register your app and copy the access key

* Paste the key in src/Seeder.js line 8, like so :

    ```sh
    accessKey: "access key goes here",
    ```
    
* In [Stripe](https://stripe.com/), copy paste your Publishable key in src/App.js at line 19 :

    ```sh
    const promise = loadStripe("publishable key goes here");
    ```

* Copy paste your stripe Secret key in functions/index.js at line 4 :

    ```sh
    const stripe = require("stripe")("secret key goes here");
    ```

* In [Firebase](https://firebase.google.com/), go to project settings and copy paste your project ID in the file .firebaserc :

    ```sh
    {
     "projects": {
     	"default": "project ID goes here"
     }
    }
    ```
* In project settings, copy the CDN of the Firebase SDK snippet and paste it in src/firebase.js :

    ```sh
    	const firebaseConfig = {
  		apiKey: "apiKey goes here",
  		authDomain: "authDomain goes here",
  		databaseURL: "hdatabaseURL goes here",
  		projectId: "projectId goes here",
  		storageBucket: "storageBucket goes here",
  		messagingSenderId: "messagingSenderId goes here",
  		appId: "appId goes here",
  		measurementId: "measurementId goes here"
	};
    ```	

* In your terminal, cd back to amazon-clone and execute the following : 

    ```sh
    	firebase emulators:start
    ```	

* Copy the api url returned by the previous command and paste it in src/axios.js at line 5 :

    ```sh
    	+  functions[api]: http function initialized (url to copy from the terminal).
    ```	

    ```sh
    	const instance = axios.create({
  		// THE API (cloud function) URL
  		baseURL: "the api url goes here",
	});
    ```	

* (Optional) To seed the database with products, uncomment the Seeder() function in src/App.js at line 28.
 It takes about 10 seconds to work (don't forget to comment it back once the database is populated).

<!-- CONTACT -->
## Contact

Adam LOUALI - [LinkedIn](https://www.linkedin.com/in/adam-louali/) - loualiadam0@gmail.com

Project Link: [https://github.com/AdamOB1290/amazon-clone](https://github.com/AdamOB1290/amazon-clone)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Stripe](https://stripe.com/) account
* [Tailwind](https://tailwindcss.com/)
* [Material-ui](https://material-ui.com/)
* [Slick Carousel](https://kenwheeler.github.io/slick/)
* [Unsplash](https://unsplash.com/developers)
* [Faker](https://github.com/fzaninotto/Faker)

