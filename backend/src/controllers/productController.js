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

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

const parsePaginationParam = (value) => {
  if (value === undefined) return undefined

  const numericValue = Number.parseInt(value, 10)
  if (!Number.isInteger(numericValue) || numericValue < 1) return null

  return numericValue
}

export const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, isNew, search, q, sort, page, limit } = req.query
    const filter = {}
    const normalizedSearchQuery = normalizeSearchQuery(q ?? search)
    const sortOption = typeof sort === 'string' ? sort.trim() : 'newest'

    const sortOptions = {
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'rating-desc': { rating: -1 },
      'name-asc': { name: 1 },
    }

    const sortQuery = sortOptions[sortOption] || sortOptions.newest

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

    const parsedPage = parsePaginationParam(page)
    const parsedLimit = parsePaginationParam(limit)

    if (parsedPage === null || parsedLimit === null) {
      res.status(400)
      throw new Error('Pagination values for page and limit must be positive integers')
    }

    const shouldPaginate = parsedPage !== undefined || parsedLimit !== undefined
    if (!shouldPaginate) {
      const products = await Product.find(filter).sort(sortQuery)
      res.status(200).json(products)
      return
    }

    const currentPage = parsedPage ?? 1
    const pageSize = Math.min(parsedLimit ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)
    const skip = (currentPage - 1) * pageSize

    const [totalItems, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sortQuery).skip(skip).limit(pageSize),
    ])

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

    res.status(200).json({
      items: products,
      pagination: {
        page: currentPage,
        limit: pageSize,
        totalItems,
        totalPages,
        hasPreviousPage: currentPage > 1,
        hasNextPage: totalPages > 0 && currentPage < totalPages,
      },
    })
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
