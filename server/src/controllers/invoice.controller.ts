import { Response } from 'express'
import { CustomRequest, IInvoiceItem } from '../types/types'

import Invoice from '../models/invoice.model'
import Client from '../models/client.model'
import Address from '../models/address.model'
import InvoiceItem from '../models/invoiceitem.model'

export const getAllInvoices = async (req: CustomRequest, res: Response) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user?._id })
      .populate('client')
      .populate('invoiceItems')
      .populate('clientAddress')
      .populate('senderAddress')

    res.status(200).json({ invoices })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

export const getInvoiceById = async (req: CustomRequest, res: Response) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, createdBy: req.user?._id })
      .populate('client')
      .populate('invoiceItems')
      .populate('clientAddress')
      .populate('senderAddress')

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice does not exist' })
    }

    return res.status(200).json({ invoice })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}

export const createInvoice = async (req: CustomRequest, res: Response) => {
  try {
    const { clientName, clientEmail, clientAddress, senderAddress, invoiceItems } = req.body

    if (!(clientName && clientEmail && clientAddress && senderAddress && invoiceItems.length > 0)) {
      // Check if invoice items array has elements
      return res
        .status(400)
        .json({ message: 'Please provide all required fields and at least one invoice item' })
    }

    // 1. Check if client exists, create if not:
    const client = await Client.findOneAndUpdate(
      { email: clientEmail },
      { $setOnInsert: { name: clientName, email: clientEmail } },
      { upsert: true, new: true } // Upsert (create if not exists) and return the new document
    )

    // 2. Check if addresses exist, create if not:
    const sender = await Address.findOneAndUpdate(
      { ...senderAddress },
      { $setOnInsert: { ...senderAddress } },
      { upsert: true, new: true }
    )
    const clientAddr = await Address.findOneAndUpdate(
      { ...clientAddress },
      { $setOnInsert: { ...clientAddress } },
      { upsert: true, new: true }
    )

    // 3. Create Invoice Items (and calculate totalAmount in one step)
    let totalAmount = 0
    const invoiceItemIds = await Promise.all(
      invoiceItems.map(async (item: IInvoiceItem) => {
        item.total = item.quantity * item.price
        totalAmount += item.total
        const newItem = new InvoiceItem(item)
        return (await newItem.save())._id
      })
    )

    // 4. Create Invoice:
    const newInvoice = await Invoice.create({
      createdBy: req.user?._id,
      paymentDue: req.body.paymentDue,
      client: client._id,
      clientAddress: clientAddr._id,
      senderAddress: sender._id,
      invoiceItems: invoiceItemIds,
      totalAmount
    })

    if (!newInvoice) {
      return res
        .status(500)
        .json({ message: 'Unable to create an invoice. Please try again later.' })
    }

    // Populate for the response:
    const populatedInvoice = await Invoice.findById(newInvoice._id)
      .populate('client')
      .populate('invoiceItems')
      .populate('senderAddress')
      .populate('clientAddress')

    res.status(201).json(populatedInvoice)
  } catch (error: any) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({ message: 'Invoice with this ID already exists.' })
    }
    return res
      .status(500)
      .json({ message: error.message || 'Unable to create an invoice. Please try again later.' })
  }
}
