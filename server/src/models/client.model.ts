import { Model, model, Schema } from 'mongoose'

import { IClient } from '../types/types'

const clientSchema = new Schema<IClient>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})

const Client: Model<IClient> = model('Client', clientSchema)
export default Client
