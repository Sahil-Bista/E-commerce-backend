import Stripe from "stripe";
import { orderModel } from "../models/Order.js";
import { ProductModel } from "../models/Product.js";

export const paymentCheckout = async(req,res)=>{
    try{
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const {orderId} = req.params;
        const order = await orderModel.findById(orderId);
        if(!order){
          return res.status(404).json({msg:'No such order available'});
        }
        const totalPrice = order.totalPrice;
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card'],
            line_items:[
                {
                    price_data:{
                        currency : 'NPR',
                        product_data : { name : "Order" + orderId},
                        unit_amount : totalPrice * 100,
                    },
                    quantity : 1,
                }
            ],
            mode:'payment',
            success_url: `${process.env.CLIENT_URL}/success?orderId=${orderId}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel?orderId=${orderId}`,
            metadata: { orderId },
        });
        res.json({url : session.url});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:"internal server error"});
    }
}

export const handleWebHook = async(req,res)=>{
  const userId = req.userId;
  const sig = req.headers["stripe-signature"];
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try{
  let event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    const order = await orderModel.findById(orderId);
    if(!order){
        return res.status(404).json({msg:'No such order found'});
    }
    if(order.user.toString() !== userId ){
      return res.sendStatus(401);
    }
    await orderModel.findByIdAndUpdate(orderId, { status: "Completed" });
    const orderedProducts = order.products;
    console.log(orderedProducts,'ordredProductus')
    await Promise.all(
      orderedProducts.map(async (product) => {
        console.log('Hello');
        const foundProduct = await ProductModel.findById(product.product);
        if(!foundProduct){
            return res.status(404).json({msg:'Product not found'});
        }
        const finalStock = foundProduct.stock - product.quantity;
        return ProductModel.findByIdAndUpdate(product.product, { stock: finalStock }, {runValidators:true, new:true});
      })
    );
  }
  res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json(err);
  }
};