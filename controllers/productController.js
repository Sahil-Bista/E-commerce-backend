import cloudinary from "../config/cloudConfig.js";
import { ProductModel } from "../models/Product.js";

export const createProduct = async(req,res)=>{
    try{
        const {name ,description,price, stock ,category} = req.body;
        if(!name || !description || !price || !stock || !category){
            return res.sendStatus(400);
        }
        const images = req.files.map(file=>({
            url : file.path,
            public_id : file.filename
        }));
        if(images.length === 0){
            return res.sendStatus(400);
        }
        const duplicate = await ProductModel.findOne({name, category});
        if(duplicate){
            return res.status(409).json({msg:'Product with the same name and category alread exists'});
        }
        const newProduct = await ProductModel.create({
            name, 
            description,
            price,
            stock,
            category,
            images
        });
        return res.json({msg:'New product added', data: newProduct});
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:"Interna server error"});
    }
}

export const getAllProducts = async(req,res)=>{
    try{
        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 10);
        const startIndex = (page - 1) * limit;

        const totalProducts = await ProductModel.countDocuments();

        const products = await ProductModel.find().sort({createdAt : -1}).skip(startIndex).limit(limit);
        if(products.length === 0){
            return res.status(400).json({msg:"No products listed yet!!"})
        }
        return res.json({ 
            totalProducts: totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            pageSize: limit,
            data: products
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

export const getSpecificProduct = async(req,res)=>{
    try{
        const {productId} = req.params;
        if(!productId){
            return res.sendStatus(400);
        }
        const product = await ProductModel.findById(productId);
        if(!product){
            return res.status(404).json({msg:"Product Not Found"});
        }
        return res.json({data : product});
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

export const updateProduct = async(req,res)=>{
    try{
        const {productId} = req.params;
        if(!productId) return res.sendStatus(400);
        const {name ,description,price, stock ,category} = req.body;
        const images = req.files.map(file=>({
            url : file.path,
            public_id : file.filename
        }));
        const toBeUpdatedData = {};
        if(name) toBeUpdatedData.name = name;
        if(description) toBeUpdatedData.description = description;
        if(price) toBeUpdatedData.price = price;
        if(stock) toBeUpdatedData.stock = stock;
        if(category) toBeUpdatedData.category = category;
        if(images.length>0) toBeUpdatedData.images = images;
        console.log(toBeUpdatedData,"To be updated data");

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            toBeUpdatedData,
            {runValidators: true, new:true}
        )
        if(!updatedProduct){
            return res.status(404).json({msg:"Product Not Found"});
        }
        return res.json({msg:'Product info upadated succesfully', dataL:updatedProduct});
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }
    const product = await ProductModel.findById(productId);
    if (!product){
        return res.status(404).json({ msg: "Product not found" });
    }
    if(product.images && product.images.length > 0){
        await Promise.all(
            product.images.map(img => cloudinary.uploader.destroy(img.public_id))
        );
    }
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }
    return res.json({ msg: "Product deleted successfully", data: deletedProduct });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
