import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server
    return axios.create({
      //  TODO:527: when you buy a domain name update it here
      // example: baseURL: 'http://www.ticketing-app-prod.com/'
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // we must be on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};
