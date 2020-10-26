import axios from "axios";

const instance = axios.create({
  // THE API (cloud function) URL
  baseURL: "http://localhost:5001/clone-8a143/us-central1/api",
  // https://us-central1-clone-8a143.cloudfunctions.net/api
  // http://localhost:5001/clone-8a143/us-central1/api
});

export default instance;
