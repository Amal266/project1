import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationCode: Number,
});

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  deposit: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  category:Array,
  desc: String,
  thumbnail: String,
  images: Array,
});
const buyersInfoSchema = new Schema({
  first_name:{
  type:String,
  required:true,
},
last_name:{
  type:String,
  required:true,
},
city:{
  type:String,
  required:true,
},

line_address1:{
  type:String,
  required:true,
},

Phone_number:{
  type:Number,
  required:true,
},
email:{
  type:String,
  required:true,
},

delivery_method:{
  type:String,
  required:true,
},
payment_method:{
  type:String,
  required:true,
},

});


const User = model('User', userSchema);
const Product = model('Product', productSchema);
const buyersInfo = model('buyersInfo', buyersInfoSchema)
export {
  Product,
  User,
  buyersInfo,
};
