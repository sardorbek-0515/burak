import ProductModel from "../schema/Product.model";

class ProductServer {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }
}


export default ProductServer;