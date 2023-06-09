const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const productSchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: "users" },
    title: {type: String, required: true},
    description: {type: String, required: true},
    img: {type: String, required: true},
    origin: {type: String, required: true},
    technique: [{type: String, required: true}],
    style: {type: String, required: false},
    colors: [{type: String, required: false}],
    releaseDate: {type: Number, required: true},
    price: {type: Number, required: true},
    stock: { 
        type: Number,
        validate: {
          validator: function (el) {
            return el >= 0;
          },
          message: 'Stock can not be a negative value',
        },
      },
    tags: [{type: String, required: true}],
    seen: {type: Boolean, required: true, default: true},
    lastCheck: {type: Boolean, required: true, default: false},
    transactions: {
        type: [Schema.Types.ObjectId],
        ref: 'transaction',
      },
    likes: {type: Array},
    comments: [{
        date: {type: Date},
        comment: {type: String},
        userId: {type: mongoose.Types.ObjectId, ref: "users" } 
    }],
    date: { type: Date, default: Date.now() }
})

productSchema.pre('save', function (next) {
    if (this.stock <= 0) {
      this.status = false;
    } else {
      this.status = true;
    }
    next();
  });

const Product = mongoose.model("products", productSchema);

module.exports = Product