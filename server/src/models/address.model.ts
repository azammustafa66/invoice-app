import { Model, model, Schema } from 'mongoose'

import { IAddress } from '../types/types'

const addressSchema = new Schema<IAddress>({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String
  },
  postCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
})

const Address: Model<IAddress> = model('Address', addressSchema)
export default Address
