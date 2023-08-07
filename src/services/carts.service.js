import { CartManagerDBDAO } from '../DAO/DB/cartManagerDB.dao.js'
import { newMessage } from '../utils.js'
import { ProductManagerDBService } from './products.service.js'
const listProducts = new ProductManagerDBService()
const CartManagerDAO = new CartManagerDBDAO()
export class CartManagerDBService {
  async getCartById (id) {
    try {
      const cartFindId = await CartManagerDAO.getCartById(id)
      const totalPrices = cartFindId.products.reduce((acc, pro) => acc + parseInt(pro.idProduct.price), 0)
      if (cartFindId) {
        return newMessage('success', 'Found successfully', { products: [...cartFindId.products], totalPrices } || [])
      } else {
        return newMessage('failure', 'Cart not Found', '')
      }
    } catch (e) {
      console.log(e)
      return newMessage('failure', 'A problem ocurred', e)
    }
  }

  async addCart () {
    try {
      const lastAdded = await CartManagerDAO.addCart()
      return newMessage('success', 'cart added successfully', lastAdded)
    } catch (e) {
      console.log(e)
      return newMessage('failure', 'A problem ocurred', e)
    }
  }

  async addProduct (idCart, idProduct) {
    try {
      const cart = await CartManagerDAO.getCartById(idCart)
      if (!cart) {
        return newMessage('failure', 'cart not found', '')
      }
      let product = await listProducts.getProductById(idProduct)
      product = product.data
      if (!product) {
        return newMessage('failure', 'product not found', '')
      }
      const productRepeated = cart.products.find(pro => pro.idProduct._id.toString() === product._id.toString())
      let messageReturn = {}
      if (productRepeated) {
        const positionProductRepeated = cart.products.indexOf(productRepeated)
        if (cart.products[positionProductRepeated].quantity < product.stock) {
          cart.products[positionProductRepeated].quantity++
          messageReturn = newMessage('success', 'Product repeated: quantity added correctly', cart)
        } else {
          messageReturn = newMessage('failure', 'Product repeated: quantity is iqual to the stock', cart)
        }
      } else {
        cart.products.push({ idProduct: product._id, quantity: 1 })
        messageReturn = newMessage('success', 'Product added correctly', cart)
      }
      await CartManagerDAO.addProduct(cart)
      return messageReturn
    } catch (e) {
      console.log(e)
      return newMessage('failure', 'A problem ocurred', e)
    }
  }

  async deleteProduct (idCart, idProduct) {
    try {
      const cartFindId = await CartManagerDAO.getCartById(idCart)
      const cartProducts = cartFindId.products
      const positionProduct = cartProducts.indexOf(cartFindId.products.find(pro => pro.idProduct === idProduct))
      cartProducts.splice(positionProduct, 1)
      await CartManagerDAO.deleteProduct(cartFindId)
      return newMessage('success', 'product deleted', cartFindId)
    } catch (e) {
      console.log(e)
      return newMessage('failure', 'A problem ocurred', e)
    }
  }

  async addNewProducts (idCart, products) {
    try {
      if (!Array.isArray(products) && products.length === 0) {
        throw new Error('You must pass an array and at least one product')
      }
      for (const product of products) {
        const productExist = await listProducts.getProductById(product.id)
        if (!productExist) {
          throw new Error(`The product with the id (${product.idProduct}) does not exist`)
        }
        const idRepeated = products.filter(pro => pro.idProduct === product.idProduct)
        if (idRepeated.length === 2) { throw new Error(`The product with the id (${product.idProduct}) is repeated in the array you passed`) }
      }
      const cartFindId = await CartManagerDAO.getCartById(idCart)
      cartFindId.products = products
      await CartManagerDAO.addNewProducts(cartFindId)
      return newMessage('success', 'products updated', cartFindId)
    } catch (e) {
      console.log(e)
      return newMessage('failure', 'A problem ocurred', e)
    }
  }

  async deleteAllProducts (idCart) {
    try {
      const cartFindId = await CartManagerDAO.getCartById(idCart)
      cartFindId.products = []
      await CartManagerDAO.deleteAllProducts(cartFindId)
      return newMessage('success', 'products emptied', cartFindId)
    } catch (e) {
      console.log(e)
      return newMessage('failure', 'A problem ocurred', '')
    }
  }

  async updateQuantityProduct (idCart, idProduct, quantity) {
    try {
      const quantityNumber = Object.values(quantity)
      if (typeof (quantityNumber[0]) !== 'number') { return newMessage('failure', 'the quantity must be a number', '') }
      const cartFindId = await CartManagerDAO.getProductById(idCart)
      const cartProducts = cartFindId.products
      const productToUpdate = cartProducts.find(pro => pro.idProduct === idProduct)
      if (!productToUpdate) { return newMessage('failure', 'the product was not found inside the cart', '') }
      productToUpdate.quantity = quantityNumber[0]
      await CartManagerDAO.updateQuantityProduct(cartFindId)
      return newMessage('success', 'the quantity of product was updated', cartFindId)
    } catch (e) {
      console.log(e)
      return newMessage('failure', 'A problem ocurred', e)
    }
  }

  async createATicketToBuy (idCart, purchaser) {
    try {
      const cart = await this.getCartById(idCart)
      const productsCouldBuy = []
      const productsCouldNotBuy = []
      for (let i = 0; i < cart.data.products.length; i++) {
        const product = cart.data.products[i]
        if (product.idProduct.stock >= product.quantity) {
          productsCouldBuy.push(product)
          continue
        }
        productsCouldNotBuy.push(product.idProduct._id)
      }
      const total = productsCouldBuy.reduce((acc, pro) => acc + parseInt(pro.idProduct.price), 0)
      const ticket = await CartManagerDAO.createATicketToBuy(purchaser, total)
      for (let i = 0; i < productsCouldBuy.length; i++) {
        const product = productsCouldBuy[i]
        await listProducts.updateProduct(product.idProduct._id, { stock: product.idProduct.stock - product.quantity })
        this.deleteProduct(idCart, product.idProduct._id)
      }
      return newMessage('success', 'the ticket of the product was created', { ticket, productsCouldNotBuy })
    } catch (e) {
      console.log(e)
      return newMessage('failure', 'A problem ocurred', e)
    }
  }
}
