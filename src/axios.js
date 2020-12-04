import axios from "axios";

const instance = axios.create({
  // THE API (cloud function) URL
  baseURL: "****REMOVED****",
});

export default instance;
