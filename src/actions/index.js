import {
  API_WC,
  API_DOKAN,
  SET_STORE_PRODUCTS,
  FETCH_STORE_PRODUCTS,
  SET_STORE_INFORMATION,
  FETCH_STORE_INFORMATION,
  SET_PRODUCT_DETAIL,
  FETCH_PRODUCT_VARIANTS,
  SET_PRODUCT_VARIANTS,
  FETCH_PRODUCT_DETAIL,
  FETCH_PRODUCT_GROUP,
  SET_PRODUCT_GROUP,
  LOAD_CART,
  INSERT_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  SET_CUSTOMER_DATA,
} from './types'

export function fetchStoreProducts (storeid) {
  if (!storeid) storeid = 1
  return apiAction({
    url: `wp-json/dokan/v1/stores/${storeid}/products?per_page=100`,
    onSuccess: setStoreProducts,
    onFailure: () => console.log('Error occured loading products'),
    label: FETCH_STORE_PRODUCTS
  })
}

function setStoreProducts (data) {
  return {
    type: SET_STORE_PRODUCTS,
    payload: data
  }
}

export function fetchStoreInfo () {
  return apiAction({
    url: `wp-json/dokan/v1/stores/`,
    onSuccess: setStoreInformation,
    onFailure: () => console.log('Error occured loading store'),
    label: FETCH_STORE_INFORMATION
  })
}

function setStoreInformation (data) {  
  const subdomain = "troica";
  try {
    const domains = window.location.hostname.split(".").reverse();
    if (domains.length >= 3)
      subdomain = domains[0];
  } catch (e) {
    console.log(e);
  }
  var foundData = null
  for (var i = 0; i < data.length; i++) {
    let item = data[i]
    let tokens = item.shop_url.split('/')
    if (tokens.length >= 4 && tokens[4] == subdomain) {
      foundData = item
      break
    }
  }
  return {
    type: SET_STORE_INFORMATION,
    payload: foundData
  }
}

export function fetchProductDetail (id) {
  return apiAction({
    type: API_WC,
    url: `products/${id}`,
    onSuccess: setProductDetail,
    onFailure: () => console.log('Error occured loading product detail'),
    label: FETCH_PRODUCT_DETAIL
  })
}

export function setProductDetail (data) {
  return {
    type: SET_PRODUCT_DETAIL,
    payload: data
  }
}

export function fetchProductVariants (id) {
  return apiAction({
    type: API_WC,
    url: `products/${id}/variations`,
    onSuccess: setProductVariations,
    onFailure: () => console.log('Error occured loading product variations'),
    label: FETCH_PRODUCT_VARIANTS
  })
}

export function setProductVariations (data) {
  return {
    type: SET_PRODUCT_VARIANTS,
    payload: data
  }
}

export function fetchProductGroup (id) {
  return apiAction({
    url: `wp-json/fluxdokan/v1/groupedproudct?id=${id}`,
    onSuccess: setProductGroup,
    onFailure: () => console.log('Error occured product grouped items'),
    label: FETCH_PRODUCT_GROUP
  })
}

function setProductGroup (data) {
  return {
    type: SET_PRODUCT_GROUP,
    payload: data
  }
}

function apiAction ({
  type = API_DOKAN,
  url = '',
  method = 'GET',
  data = null,
  accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9zdG9yZS5jb2RlbWlzc2lsZS5jb20iLCJpYXQiOjE2MDQwMjk2NzQsIm5iZiI6MTYwNDAyOTY3NCwiZXhwIjoxNjA0NjM0NDc0LCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.hhbQzAkcRXQryh4ZZmPAvsEkbTjoXYsZmD-u93RZuRc",
  onSuccess = () => {},
  onFailure = () => {},
  label = '',
  headersOverride = null
}) {
  return {
    type,
    payload: {
      url,
      method,
      data,
      accessToken,
      onSuccess,
      onFailure,
      label,
      headersOverride
    }
  }
}

export function loadCart() {
  return {
    type: LOAD_CART,
    payload: null
  }
}

export function insertToCart(item, count) {
  return {
    type: INSERT_TO_CART,
    payload: {
      item, count
    }
  }
}

export function updateCartItem(id, count) {
  return {
    type: UPDATE_CART_ITEM,
    payload: {
      id, count
    }
  }
}

export function removeCartItem(id) {
  return {
    type: REMOVE_CART_ITEM,
    payload: {
      id
    }
  }
}

export function setCustomerData(name, phone) {
  return {
    type: SET_CUSTOMER_DATA,
    payload: {
      name,
      phone
    }
  }
}

