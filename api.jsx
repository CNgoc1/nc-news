import axios from "axios";

const instance = axios.create({
  baseURL: "https://api-news-lj0j.onrender.com/api",
});

export default function api(method, path, query, body) {
  const config = {
    method: method,
    url: path,
    params: query,
    data: body,
  };

  return instance(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
}
