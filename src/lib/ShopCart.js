
const SHOP_CART_ID = "troica_shopcart";

class CartItem {
    constructor(item = null, count = 0) {
        this.item = item;
        this.count = count;
    }

    addCount(c) {
        this.count += c;
    }
}
export default class ShopCart {

    constructor() {
        this.cartitems = {};
        this.itemCount = 0;
    }

    toJson() {
        return {
            cartitems: this.cartitems,
            itemCount: this.itemCount
        };
    }

    totalPrice() {
        let price = 0;
        for (var id in this.cartitems) {
            var elt = this.cartitems[id];
            if (elt.item.sale_price)
                price += parseFloat(elt.item.sale_price) * elt.count;
            else if (elt.item.regular_price)
                price += parseFloat(elt.item.regular_price) * elt.count;
            else
                price += parseFloat(elt.item.price) * elt.count;
        }
        return price;
    }

    clearAll() {
        this.cartitems = {};
        this.itemCount = 0;
    }

    loadFromStorage() {
        var jsonStr = localStorage.getItem(SHOP_CART_ID);
        this.clearAll();
        try{
            var jsonData = JSON.parse(jsonStr);
            for (var id in jsonData.cartitems) {
                var elt = jsonData.cartitems[id];
                this.insertToCart(elt.item, elt.count);
            }
        } catch (e) {
            console.log("load shop cart error");   
        }
    }

    saveToStorage() {        
        localStorage.setItem(SHOP_CART_ID, JSON.stringify(this.toJson()));
    }

    insertToCart(item, count) {
        if (this.cartitems[item.id] == undefined) {
            this.cartitems[item.id] = new CartItem(item, count);
            this.itemCount ++;
            this.saveToStorage();
        } else {
            this.cartitems[item.id].addCount(count);
            this.saveToStorage();
        }
    }

    removeItem(id) {
        if (this.cartitems[id] != undefined) {
            delete this.cartitems[id];
            this.itemCount --;
            this.saveToStorage();
        }
    }

    updateItem(id, count) {
        if (count == 0)
        {
            this.removeItem();
            this.saveToStorage();
        }
        else if (this.cartitems[id] != undefined) {
            this.cartitems[id].count = count;
            this.saveToStorage();
        }
    }
}