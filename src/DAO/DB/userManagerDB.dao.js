import { userModel } from '../models/users.model.js'
export class UserManagerDBDAO {
  async addUsser (userPassword, userName) {
    try {
      await userModel.create({ userPassword, userName })
      const lastAdded = await userModel.findOne({}).sort({ _id: -1 }).lean()
      return lastAdded
    } catch (e) {
      console.log(e)
      throw new Error('Failed to create a user in DAO (check the data) ')
    }
  }

  async getUserByUserName (userName) {
    try {
      const user = await userModel.findOne({ email: userName }).lean()
      return user
    } catch (e) {
      console.log(e)
      throw new Error('Failed to find the User in DAO (check the data)')
    }
  }
}
