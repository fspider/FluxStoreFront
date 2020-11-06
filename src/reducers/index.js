import {
  API_START,
  API_END,
  SET_STORE_PRODUCTS,
  FETCH_STORE_PRODUCTS,
  SET_STORE_INFORMATION,
  SET_PRODUCT_DETAIL,
  SET_PRODUCT_VARIANTS,
  SET_PRODUCT_GROUP,
  LOAD_CART,
  INSERT_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  SET_CUSTOMER_DATA,
} from "../actions/types";
import ShopCart from "../lib/ShopCart";

const initialState = {
  cart: null,
  products: [],
  mystore: null,
  selectedProduct: null, // for type="variable" product
  selectedGroup: null, // for type="group" product
  selectedVariants: null,
  isLoadedStore: false,
  isLoadingData: false,
  customer: null,
}
export default function(state = initialState, action) {
  console.log("action type => ", action.type, action.payload);
  switch (action.type) {
    case SET_STORE_PRODUCTS:
      return { ...state, products: action.payload };
    case SET_STORE_INFORMATION:
      return { ...state, isLoadedStore: true, mystore: action.payload };
    case SET_PRODUCT_DETAIL:
      return { ...state, selectedProduct: action.payload };
    case SET_PRODUCT_VARIANTS:
      return { ...state, selectedVariants: action.payload };
    case SET_PRODUCT_GROUP:
      return { ...state, selectedGroup: action.payload };
    case LOAD_CART:
      var cart = new ShopCart();
      cart.loadFromStorage();
      return { ...state, cart: cart};
    case INSERT_TO_CART:
      {
        let cart = new ShopCart();
        Object.assign(cart, state.cart);
        cart.insertToCart(action.payload.item, action.payload.count);
        return { ...state, cart: cart };
      }
    case UPDATE_CART_ITEM:
      {
        let cart = new ShopCart();
        Object.assign(cart, state.cart);
        cart.updateItem(action.payload.id, action.payload.count);
        return { ...state, cart: cart };  
      }
    case REMOVE_CART_ITEM:
      {
        let cart = new ShopCart();
        Object.assign(cart, state.cart);
        cart.removeItem(action.payload.id);
        return { ...state, cart: cart };
      }
      break;
    case SET_CUSTOMER_DATA:
      return { ...state, customer: action.payload };
      break;
    case API_START:
      if (action.payload === FETCH_STORE_PRODUCTS) {
        return {
          ...state,
          isLoadingData: true
        };
      }
      return state;
      break;
    case API_END:
      if (action.payload === FETCH_STORE_PRODUCTS) {
        return {
          ...state,
          isLoadingData: false
        };
      }
      return state;
      break;
    default:
      return state;
  }
}
