import { chatModel } from '../models/chat.model.js'
export class ChatManagerDBDAO {
  async addMessage (message, userName) {
    try {
      await chatModel.create({ message, user: userName })
      const lastAdded = await chatModel.findOne({}).sort({ _id: -1 }).lean()
      return lastAdded
    } catch (e) {
      console.log(e)
      throw new Error('Failed to create a message in DAO (check the data)')
    }
  }

  async getMessages () {
    try {
      const messages = await chatModel.find({}).lean()
      return messages
    } catch (e) {
      console.log(e)
      throw new Error('Failed to get the messages')
    }
  }
}
