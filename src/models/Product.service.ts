import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput, ProductInquiry } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enums/product.enum";
import { T } from "../libs/types/comman";
import { ObjectId } from "mongoose"
import { ViewGroup } from "../libs/enums/view.enum";
import { ViewInput } from "../libs/types/view";
import ViewService from "./View.service";

class ProductServer {
  private readonly productModel;
  private readonly viewService;

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  ///////////////////////**  SPA *///////////////////////

  ///////// getProducts /////////// Haridorlar loyhasi
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };

    if (inquiry.productCollection)
      match.productCollection = inquiry.productCollection;
    if (inquiry.search) (
      match.productName = { $regex: new RegExp(inquiry.search, "i") }
    )

    const sort: T =
      inquiry.order === "productPrice"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order]: -1 };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
        { $limit: inquiry.limit * 1 },
      ])
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as unknown as Product[];
  }

  public async getProduct(
    memberId: ObjectId | null,
    id: string,
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);

    let result = await this.productModel
      .findOne({ _id: productId, productStatus: ProductStatus.PROCESS })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) { //member producy korganmi
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };

      const existView = await this.viewService.checkViewExistence(input);
      console.log("exist:", !!existView); //haa bolsa hech nma qilma
      if (!existView) {
        await this.viewService.insertMemberView({ // yoq bolsa yaratish
          ...input,
          memberId: memberId,
          viewRefId: productId.toString(),
        });

        result = await this.productModel //statistika yangilanish
          .findByIdAndUpdate(
            productId,
            { $inc: { productViews: +1 } },
            { new: true },
          )
          .exec();
      }
    }
    return result as unknown as Product;
  }

  ////////////////////////////////////**  SRR *////////////////////////////
  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().exec();

    if (!result) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    return result as unknown as Product[];
  }


  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input) as unknown as Product;
    } catch (err) {
      console.error("Error, model:createNewProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenProduct(
    id: string,
    input: ProductInput
  ): Promise<Product> {
    const objId = shapeIntoMongooseObjectId(id);
    const result = await this.productModel.findOneAndUpdate(
      { _id: objId },
      input,
      { new: true }
    ).exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result as unknown as Product;
  }
}

export default ProductServer;