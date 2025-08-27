import { CartModel } from "../models/Cart.js";
import { orderModel } from "../models/Order.js";

export const createOrder = async(req , res) =>{
    try{
        const userId = req.user;
        const {cartId} = req.params;
        const cart = await CartModel.findOne({user : userId});
        if(!cart){
            return res.status(404).json({msg:'The logged in user has no cart items'});
        }
        if(cart._id.toString() !== cartId ){
            return res.status(401).json({msg:'User unaouthorized to create order'});
        }
        const orderedProducts = cart.products.map((product)=>({product : product.product, name : product.name, quantity: product.quantity, price: product.price }));
        if(orderedProducts.length===0){
            return res.status(400).json({msg:'No such products in the cart'});
        }
        const productTotals = cart.products.map((product)=>product.quantity * product.price);
        const orderTotal = productTotals.reduce((acc, num) => acc + num, 0);
        const newOrder = await orderModel.create({
            user : userId,
            products : orderedProducts,
            totalPrice : orderTotal
        })
        return res.json({msg:'Order created successfully', data: newOrder});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal Server Error'});
    }
}

export const getAllOrders = async(req,res)=>{
    try{
        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 10);
        const startIndex = (page - 1) * limit;

        const totalOrders = await orderModel.countDocuments();

        const orders = await orderModel.find().sort({createdAt : -1}).skip(startIndex).limit(limit);
        if(orders.length === 0){
            return res.status(400).json({msg:"No orders at this time!!"})
        }
        return res.json({ 
            totalOrders: totalOrders,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            pageSize: limit,
            data: orders
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

export const getUserSpecificOngoingOrders = async(req , res) =>{
    try{
        const userId = req.user;
        const userOrders = await orderModel.find({user : userId})
        if(userOrders.length === 0){
            return res.status(204).json({msg:"User has not created an order yet"});
        }
        const ongoingOrders = userOrders.filter((order)=>order.status === 'In-progress');
        if(ongoingOrders.length === 0){
            return res.status(204).json({msg:'User has no ongoing orders'});
        }
        return res.json({data:ongoingOrders});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal Server Error'});
    }
}

export const getUserSpecificOrderHistory = async(req , res) =>{
    try{
        const userId = req.userId;
        const userOrders = await orderModel.find({user : userId})
        if(userOrders.length === 0){
            return res.status(204).json({msg:"User has not created an order yet"});
        }
        const ongoingOrders = userOrders.filter((order)=>order.status === 'Completed');
        if(ongoingOrders.length === 0){
            return res.status(204).json({msg:'User has no ongoing orders'});
        }
        return res.json({data:ongoingOrders});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal Server Error'});
    }
}

export const cancelOrder = async(req,res)=>{
    try{
        const userId = req.user;
        const {orderId} = req.params;
        if(!orderId){
            return res.sendStatus(400);
        }
        const order = await orderModel.findById(orderId);
        if(!order){
            return res.status(404).json({msg:'Order not found'});
        }
        if(order.user.toString() !== userId){
            return res.status(401).json({msg:'User unauthorized to cancel the order'});
        }
        if(order.status === 'Completed' || order.status === 'Cancelled'){
            return res.status(400).json({ msg: 'Order cannot be cancelled' });
        }
        order.status = 'Cancelled';
        await order.save();
        return res.json({msg:'Order cancelled successfully', data : order})
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal Server Error'});             
    }
}