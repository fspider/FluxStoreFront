// inspired by https://leanpub.com/redux-book
import axios from "axios";
import { STORE_URL, API_WC, API_DOKAN } from "../actions/types";
import { accessDenied, apiError, apiStart, apiEnd } from "../actions/api";
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default; 
const api = new WooCommerceRestApi({
  url: STORE_URL,
  consumerKey: "ck_d0fb9fd94a7336b078168c944031c8d36055140d",
  consumerSecret: "cs_ad5278b253d3c176ec2fdab715b58c620101d7a0",
  version: "wc/v3"
});

const apiMiddleware = ({ dispatch }) => next => action => {
  if (!action)
    return;
  next(action);

  if (action.type !== API_DOKAN && action.type !== API_WC) return;

  const {
    url,
    method,
    data,
    accessToken,
    onSuccess,
    onFailure,
    label,
    headers
  } = action.payload;

  if (action.type == API_WC) {

    if (label) {
      dispatch(apiStart(label));
    }

    api.get(url)
      .then((response) => {
        // Successful request   
        dispatch(onSuccess(response.data));
      })
      .catch((error) => {
        console.log(error)
        // Invalid request, for 4xx and 5xx statuses
        dispatch(apiError(error));
        dispatch(onFailure(error));

        if (error.response && error.response.status === 403) {
          dispatch(accessDenied(window.location.pathname));
        }
      })
      .finally(() => {
        // Always executed.
        if (label) {
          dispatch(apiEnd(label));
        }
      });
    return;
  }
  const dataOrParams = ["GET", "DELETE"].includes(method) ? "params" : "data";

  // axios default configs
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "";
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  if (label) {
    dispatch(apiStart(label));
  }

  axios
    .request({
      url : `${STORE_URL}${url}`,
      method,
      headers,
      crossDomain: true,
      [dataOrParams]: data
    })
    .then(({ data }) => {
      dispatch(onSuccess(data));
    })
    .catch(error => {
      dispatch(apiError(error));
      dispatch(onFailure(error));

      if (error.response && error.response.status === 403) {
        dispatch(accessDenied(window.location.pathname));
      }
    })
    .finally(() => {
      if (label) {
        dispatch(apiEnd(label));
      }
    });
};

export default apiMiddleware;
