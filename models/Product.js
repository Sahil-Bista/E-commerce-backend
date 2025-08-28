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
        type : String,
        enum: ['Sneakers','Casual']
    },
    images :
    [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ]
},{timestamps : true})

export const ProductModel = mongoose.model('Product', ProductSchema);