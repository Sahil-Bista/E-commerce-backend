import { CartModel } from "../models/Cart.js";
import { ProductModel } from "../models/Product.js";

export const addToCart = async(req,res)=>{
    try{
        const userId = req.user;
        const {productId, quantity} = req.body;
        if(!productId || !quantity ){
            return res.sendStatus(400)
        }
        const product = await ProductModel.findById(productId);
        const productName = product.name;
        const productPrice = product.price;
        if (!product) {
        return res.status(404).json({ msg: "Product not found" });
        }
        if (product.stock < quantity) {
        return res.status(400).json({ msg: "Insufficient stock available" });
        }

        let cart = await CartModel.findOne({user : userId});
        if(!cart){
            cart = await CartModel.create({user : userId,products : []});
        }

        const existingItem = cart.products.find((product)=>product.product.toString() === productId);
        console.log('Existig Stock', product.stock);
        console.log('Exsting item quantity', existingItem.quantity, 'and req quantity is ', quantity);
        if(existingItem) {
            if (product.stock < (existingItem.quantity + quantity)) {
                return res.status(400).json({ msg: "Not enough stock to add more" });
            }
            existingItem.quantity += quantity;
        }
        else{
            cart.products.push({
                product: productId,
                name : productName,
                quantity:quantity,
                price: productPrice
            });
        }
        await cart.save();
        return res.json({msg:'Item aded to cart successfully',data: cart});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal Server Error'});
    }
} 

export const getAllCartItems = async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = (page-1)*limit;
        
        const {userId} = req.user;
        let cart = await CartModel.findOne({user:userId}).populate('products.product','name price stock category');

        if(!cart) {
            cart = await CartModel.create({
                user : userId,
                products : []
            })
        }
        const totalProducts = cart.products.length;
        const paginatedItems = cart.products.slice(startIndex, startIndex + limit);

        if (!paginatedItems.length) {
        return res.status(204).json({ msg: "No items added to the cart yet" });
        }

        return res.json({
            totalItems: totalProducts,
            page,
            limit,
            data: paginatedItems
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal Server Error'});
    }
} 

export const getSpecificCartItem = async(req,res)=>{
    try{
        const {userId} = req.user;
        const {productId} = req.params;
        const cart = await CartModel.findOne({user: userId}).populate('products.product','name price description category');
        if(!cart){
            return res.status(404).json({msg:'Cart not found;'})
        }
        const specificCartItem = cart.products.find((cart)=>cart.product._id.toString() === productId);
        if (!specificCartItem) {
            return res.status(404).json({ msg: "Product not found in cart" });
        }
        return res.json({
            msg: "Cart item retrieved successfully",
            data: specificCartItem,
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal Server Error'});
    }
} 

export const editCartItem = async(req,res)=>{
    try{
        const userId = req.user;
        const {productId} = req.params;
        if(!productId) return res.sendStatus(400);
        const {quantity} = req.body;
        if(!quantity){
            return res.status(400).json({msg:'Send the quantity to be updated'});
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ msg: "Insufficient stock available" });
        }

        const cart  = await CartModel.findOne({user: userId});
        if (!cart) {
            return res.status(404).json({ msg: "Cart not found" });
        }
        const cartProducts = cart.products;
        const specificCartProduct = cartProducts.find((product)=>product.product.toString()===productId);
        if(!specificCartProduct){
            return res.status(404).json({msg:"product not found in cart"})
        }
        specificCartProduct.quantity = quantity;
        await cart.save();
        return res.json({msg:"Item quantity edited sucessfully", data : specificCartProduct});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal Server Error'});
    }
} 

export const deleteCartItem = async(req,res)=>{
    try{
        const userId = req.user;
        const {productId} = req.params;
        if(!productId) return res.sendStatus(400);
        const cart  = await CartModel.findOne({user: userId});
        if (!cart) {
            return res.status(404).json({ msg: "Cart not found" });
        }
        cart.products = cart.products.filter((product)=>product.product.toString()!==productId);
        await cart.save();
        return res.json({msg:"Item deletd sucessfully", data:filteredCartProduct});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal Server Error'});
    }
}