import { Productmodel } from '../models/products.model.js'
export class ProductManagerDBDAO {
  async addProduct (product) {
    try {
      await Productmodel.create(product)
      const lastAdded = await Productmodel.findOne({}).sort({ _id: -1 }).lean()
      return lastAdded
    } catch (e) {
      console.log(e)
      throw new Error('Failed to create a product in DAO (check the data)')
    }
  }

  async updateProduct (productToUpdate) {
    try {
      await Productmodel.updateOne({ _id: productToUpdate._id.toString() }, productToUpdate)
      return productToUpdate
    } catch (e) {
      console.log(e)
      throw new Error('Failed to update a product in DAO (check the data)')
    }
  }

  async getProducts (limit, page, query, sort) {
    try {
      const { docs, ...rest } = await Productmodel.paginate({ [query && 'category']: query }, { limit: limit || 10, page: page || 1, sort: { price: sort || null }, lean: true })
      return { docs, rest }
    } catch (e) {
      console.log(e)
      throw new Error('Failed to get products in DAO (check the data)')
    }
  }

  async getProductById (id) {
    try {
      const productFindId = await Productmodel.findOne({ _id: id }).lean()
      return productFindId
    } catch (e) {
      console.log(e)
      throw new Error('Failed to get product by id in DAO (check the data)')
    }
  }

  async deleteProduct (id) {
    try {
      const productToDelete = await Productmodel.deleteOne({ _id: id })
      return productToDelete
    } catch (e) {
      console.log(e)
      throw new Error('Failed to delete a product in DAO (check the data)')
    }
  }
}
