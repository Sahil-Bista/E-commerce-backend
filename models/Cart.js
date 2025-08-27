import mongoose from "mongoose";

const CartSchema = await mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    products : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product',
                required : true
            },
            name:{
                type:String,
            },
            quantity : {
                type: Number,
                default : 1
            },
            price :{
                type: Number,
            }
        }
    ]
},{timestamps: true})

export const CartModel = mongoose.model('Cart', CartSchema);