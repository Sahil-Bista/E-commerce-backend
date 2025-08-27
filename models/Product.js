import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    description:{
        type: String,
        require : true
    }, 
    price:{
        type: Number,
        require : true
    }, 
    stock:{
        type: Number,
        require: true
    }, 
    category:{
        type : [String],
        enum: ['Sneakers','Casual']
    },
    //TO be created after opening an AWS ACCOUNT
    // image :{
    //     type: String,
    //     required : true
    // }
},{timestamps : true})

export const ProductModel = mongoose.model('Product', ProductSchema);