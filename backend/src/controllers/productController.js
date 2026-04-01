import mongoose from 'mongoose'
import Product from '../models/Product.js'

const toBoolean = (value) => {
  if (value === undefined) return undefined
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return undefined

  if (value.toLowerCase() === 'true') return true
  if (value.toLowerCase() === 'false') return false
  return undefined
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const normalizeSearchQuery = (value) => {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\s+/g, ' ').slice(0, 100)
}

const buildSearchFilter = (query) => {
  if (!query) return undefined

  const searchTerms = query.split(' ').filter(Boolean).slice(0, 5)
  if (!searchTerms.length) return undefined

  return searchTerms.map((term) => {
    const regexPattern = escapeRegex(term)

    return {
      $or: [
        { name: { $regex: regexPattern, $options: 'i' } },
        { category: { $regex: regexPattern, $options: 'i' } },
        { description: { $regex: regexPattern, $options: 'i' } },
      ],
    }
  })
}

const normalizeProductPayload = (payload) => {
  const normalizedPayload = { ...payload }

  if (Object.prototype.hasOwnProperty.call(normalizedPayload, 'isNew')) {
    const parsedIsNew = toBoolean(normalizedPayload.isNew)
    normalizedPayload.isNewArrival = parsedIsNew === undefined ? Boolean(normalizedPayload.isNew) : parsedIsNew
    delete normalizedPayload.isNew
  }

  return normalizedPayload
}

export const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, isNew, search, q } = req.query
    const filter = {}
    const normalizedSearchQuery = normalizeSearchQuery(q ?? search)

    if (category && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i')
    }

    const searchFilter = buildSearchFilter(normalizedSearchQuery)
    if (searchFilter) {
      filter.$and = searchFilter
    }

    const parsedIsNew = toBoolean(isNew)
    if (parsedIsNew !== undefined) {
      filter.isNewArrival = parsedIsNew
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {}

      if (minPrice !== undefined) {
        const parsedMinPrice = Number(minPrice)
        if (!Number.isNaN(parsedMinPrice)) {
          filter.price.$gte = parsedMinPrice
        }
      }

      if (maxPrice !== undefined) {
        const parsedMaxPrice = Number(maxPrice)
        if (!Number.isNaN(parsedMaxPrice)) {
          filter.price.$lte = parsedMaxPrice
        }
      }

      if (Object.keys(filter.price).length === 0) {
        delete filter.price
      }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400)
      throw new Error('Invalid product id')
    }

    const product = await Product.findById(id)

    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    res.status(200).json(product)
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const productPayload = normalizeProductPayload(req.body)
    const product = await Product.create(productPayload)
    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const productPayload = normalizeProductPayload(req.body)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400)
      throw new Error('Invalid product id')
    }

    const product = await Product.findByIdAndUpdate(id, productPayload, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    res.status(200).json(product)
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400)
      throw new Error('Invalid product id')
    }

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    next(error)
  }
}
