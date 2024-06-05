import { Model, model, Schema } from 'mongoose'

import { IInvoice, IInvoiceItem } from '../types/types'

const invoiceSchema = new Schema<IInvoice>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    paymentDue: {
      type: Date,
      required: true
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'draft'],
      default: 'pending'
    },
    clientAddress: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: true
    },
    senderAddress: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: true
    },
    description : {
      type: String,
      required: true
    },
    invoiceItems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'InvoiceItem',
        required: true
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Invoice: Model<IInvoice> = model('Invoice', invoiceSchema)
export default Invoice
