import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
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
            name : {
                type : String,
            },
            quantity : {
                type : Number
            },
            price : {
                type : Number
            }
        }
    ],
    totalPrice : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        default :'In-progress',
        enum : ['Completed', 'In-Progress', 'Cancelled']
    }
},{timestamps : true});

export const orderModel = mongoose.model('Order',OrderSchema);