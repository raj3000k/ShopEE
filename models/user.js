const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectID;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // find existing products or not
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
      //return cp.productId == product._id;
    });
    // console.log("25 user", this);
    // console.log("26 user", product);
    // console.log("27 user", this.cart.items);
    const updatedCartItems = [...this.cart.items];
    let newQuantity = 1;
    console.log("30 user ", updatedCartItems);

    if (cartProductIndex >= 0) {
      // already existing products
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      // add new product
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }

    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );

    // beginning of cart creation
    /* const updatedCart = {
      items: [{ productId: new ObjectId(product._id), quantity: 1 }]
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      ); */
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    //console.log("73 user ", productIds);
    return (
      db
        .collection("products")
        //find many products filter by productId
        .find({ _id: { $in: productIds } })
        .toArray()
        .then(products => {
          //console.log("81 user ", products);
          return products.map(p => {
            return {
              ...p,
              quantity: this.cart.items.find(i => {
                return i.productId.toString() === p._id.toString();
              }).quantity
            };
          });
        })
        .catch(err => console.log(err))
    );
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray()
      .then(orders => {
        return orders;
      });
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name
          }
        };
        return db.collection("orders").insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      })
      .catch(err => console.log(err));
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log("20 user model", user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
    /* .find({ _id: new ObjectId(userId) })
      .next(); */
  }
}

module.exports = User;
