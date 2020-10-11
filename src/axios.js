import axios from "axios";

const instance = axios.create({
  // THE API (cloud function) URL
  baseURL: 'https://us-central1-clone-e5f47.cloudfunctions.net/api'
  // https://us-central1-clone-e5f47.cloudfunctions.net/api
  // http://localhost:5001/clone-e5f47/us-central1/api
});

export default instance;
