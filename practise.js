import {ProductModel} from './models/Product.js';

const orderedProducts = [{product : 12301,name : 'Best',quantity :10, price : 100},{product : 12302,name : 'Best',quantity :10, price : 100},{product : 12303,name : 'Best',quantity :10, price : 100}]

await Promise.all(
  orderedProducts.map(async (product) => {
    const foundProduct = await ProductModel.findById(product.product);
    if(!foundProduct){
        return resizeBy.status(404).json({msg:'Product not found'});
    }
    const finalStock = foundProduct.stock - product.quantity;
    return ProductModel.findByIdAndUpdate(product.product, { stock: finalStock }, {runValidators:true, new:true});
  })
);