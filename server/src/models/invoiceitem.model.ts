import { model, Model, Schema } from 'mongoose'

import { IInvoiceItem } from '../types/types'

const invoiceItemSchema = new Schema<IInvoiceItem>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
})

invoiceItemSchema.pre<IInvoiceItem>('save', function (next) {
    this.total = this.quantity * this.price
    next()
})

const InvoiceItem: Model<IInvoiceItem> = model('InvoiceItem', invoiceItemSchema)
export default InvoiceItem
