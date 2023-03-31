const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const User = require("../models/user");

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    //this._id = id;

    // every time you don't need to covert the id to mongodb objectID. So this is tha better approach.
    this._id = id ? new mongodb.ObjectID(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb(); // database connection
    let dbOp;

    if (this._id) {
      // update the product
      // collection (in sql world called table)
      dbOp = db
        .collection("products")
        //.updateOne({ _id: new mongodb.ObjectID(this._id) }, { $set: this });
        .updateOne({ _id: this._id }, { $set: this });
      console.log("23 product model", this);
      // $set is mongodb reserved keyword for update record

      // ! you can also this way
      //.updateOne({ id: new mongodb.ObjectID(this._id) }, { $set: {title: this.title,.....} });
    } else {
      // save the product
      dbOp = db.collection("products").insertOne(this);

      // ! you can also this way
      //dbOp = db.collection("products").insertOne({title: this.title,...});
    }
    return dbOp
      .then(result => {
        console.log("42 product model", result);
      })
      .catch(err => console.log(err));

    //insertOne({ name: "A book", price: 12.99 })
    // insertOne({})
    // insertMany([])
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        console.log("35 product model", products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
    //find({title: 'A Book'})
    // find() // ! find all products
    // find().toArray() // ! find all products as array
  }

  static findByID(prodId) {
    const db = getDb();
    return (
      db
        .collection("products")
        .find({ _id: new mongodb.ObjectID(prodId) })
        // new mongodb.ObjectID() - every id, mongodb converts mongodb object. so we need to convert javascript.
        .next()
        // next() - also last document that was returned by find here.
        .then(product => {
          console.log("53 product model", product);
          return product;
        })
        .catch(err => {
          console.log(err);
        })
    );
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectID(prodId) })
      .then(result => {
        console.log("Deleted");
        console.log("95 product model", result);
      })
      .catch(err => console.log(err));
  }
}

module.exports = Product;
