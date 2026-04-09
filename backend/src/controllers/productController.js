import mongoose from 'mongoose'
import Product from '../models/Product.js'

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100
const DEFAULT_TOP_PRODUCTS_LIMIT = 5
const MAX_TOP_PRODUCTS_LIMIT = 20
const PRODUCT_FIELD_MAP = {
  _id: '_id',
  id: '_id',
  name: 'name',
  category: 'category',
  price: 'price',
  rating: 'rating',
  image: 'image',
  isNew: 'isNewArrival',
  isNewArrival: 'isNewArrival',
  description: 'description',
  stock: 'stock',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
}

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

const parsePaginationParam = (value) => {
  if (value === undefined) return undefined

  const numericValue = Number.parseInt(value, 10)
  if (!Number.isInteger(numericValue) || numericValue < 1) return null

  return numericValue
}

const parseNumberParam = (value, { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY } = {}) => {
  if (value === undefined) return undefined

  const numericValue = Number(value)
  if (!Number.isFinite(numericValue) || numericValue < min || numericValue > max) return null

  return numericValue
}

const buildFieldSelection = (value) => {
  if (value === undefined) return undefined
  if (typeof value !== 'string') return null

  const rawFields = value
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean)

  if (!rawFields.length) return null

  const mappedFields = [...new Set(rawFields.map((field) => PRODUCT_FIELD_MAP[field]).filter(Boolean))]

  if (!mappedFields.length) return null

  return mappedFields.join(' ')
}

const roundToTwoDecimals = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0
  return Number(value.toFixed(2))
}

export const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, minRating, maxRating, inStock, isNew, search, q, sort, page, limit, fields } =
      req.query
    const filter = {}
    const normalizedSearchQuery = normalizeSearchQuery(q ?? search)
    const sortOption = typeof sort === 'string' ? sort.trim() : 'newest'
    const parsedMinPrice = parseNumberParam(minPrice, { min: 0 })
    const parsedMaxPrice = parseNumberParam(maxPrice, { min: 0 })
    const parsedMinRating = parseNumberParam(minRating, { min: 0, max: 5 })
    const parsedMaxRating = parseNumberParam(maxRating, { min: 0, max: 5 })
    const parsedInStock = toBoolean(inStock)
    const parsedIsNew = toBoolean(isNew)
    const parsedPage = parsePaginationParam(page)
    const parsedLimit = parsePaginationParam(limit)
    const projection = buildFieldSelection(fields)

    const sortOptions = {
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'rating-desc': { rating: -1 },
      'name-asc': { name: 1 },
    }

    const sortQuery = sortOptions[sortOption] || sortOptions.newest

    if (parsedMinPrice === null || parsedMaxPrice === null) {
      res.status(400)
      throw new Error('Price filters must be numeric values greater than or equal to 0')
    }

    if (parsedMinPrice !== undefined && parsedMaxPrice !== undefined && parsedMinPrice > parsedMaxPrice) {
      res.status(400)
      throw new Error('minPrice cannot be greater than maxPrice')
    }

    if (parsedMinRating === null || parsedMaxRating === null) {
      res.status(400)
      throw new Error('Rating filters must be numeric values between 0 and 5')
    }

    if (parsedMinRating !== undefined && parsedMaxRating !== undefined && parsedMinRating > parsedMaxRating) {
      res.status(400)
      throw new Error('minRating cannot be greater than maxRating')
    }

    if (inStock !== undefined && parsedInStock === undefined) {
      res.status(400)
      throw new Error('inStock must be true or false')
    }

    if (isNew !== undefined && parsedIsNew === undefined) {
      res.status(400)
      throw new Error('isNew must be true or false')
    }

    if (parsedPage === null || parsedLimit === null) {
      res.status(400)
      throw new Error('Pagination values for page and limit must be positive integers')
    }

    if (fields !== undefined && projection === null) {
      res.status(400)
      throw new Error('fields must include at least one valid product field')
    }

    if (category && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i')
    }

    const searchFilter = buildSearchFilter(normalizedSearchQuery)
    if (searchFilter) {
      filter.$and = searchFilter
    }

    if (parsedIsNew !== undefined) {
      filter.isNewArrival = parsedIsNew
    }

    if (parsedInStock !== undefined) {
      filter.stock = parsedInStock ? { $gt: 0 } : { $lte: 0 }
    }

    if (parsedMinPrice !== undefined || parsedMaxPrice !== undefined) {
      filter.price = {}

      if (parsedMinPrice !== undefined) {
        filter.price.$gte = parsedMinPrice
      }

      if (parsedMaxPrice !== undefined) {
        filter.price.$lte = parsedMaxPrice
      }
    }

    if (parsedMinRating !== undefined || parsedMaxRating !== undefined) {
      filter.rating = {}

      if (parsedMinRating !== undefined) {
        filter.rating.$gte = parsedMinRating
      }

      if (parsedMaxRating !== undefined) {
        filter.rating.$lte = parsedMaxRating
      }
    }

    const shouldPaginate = parsedPage !== undefined || parsedLimit !== undefined
    if (!shouldPaginate) {
      const productsQuery = Product.find(filter).sort(sortQuery)
      if (projection) {
        productsQuery.select(projection)
      }

      const products = await productsQuery
      res.status(200).json(products)
      return
    }

    const currentPage = parsedPage ?? 1
    const pageSize = Math.min(parsedLimit ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)
    const skip = (currentPage - 1) * pageSize

    const productsQuery = Product.find(filter).sort(sortQuery).skip(skip).limit(pageSize)
    if (projection) {
      productsQuery.select(projection)
    }

    const [totalItems, products] = await Promise.all([Product.countDocuments(filter), productsQuery])

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

export const getProductCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      {
        $match: {
          category: { $exists: true, $type: 'string', $ne: '' },
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: 1,
        },
      },
      {
        $sort: { count: -1, name: 1 },
      },
    ])

    res.status(200).json({
      categories,
      totalCategories: categories.length,
    })
  } catch (error) {
    next(error)
  }
}

export const getCatalogStats = async (req, res, next) => {
  try {
    const parsedTopLimit = parsePaginationParam(req.query.top)

    if (parsedTopLimit === null) {
      res.status(400)
      throw new Error('top must be a positive integer')
    }

    const topLimit = Math.min(parsedTopLimit ?? DEFAULT_TOP_PRODUCTS_LIMIT, MAX_TOP_PRODUCTS_LIMIT)

    const [summaryRows, categories, topRatedProducts] = await Promise.all([
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            newArrivals: {
              $sum: {
                $cond: ['$isNewArrival', 1, 0],
              },
            },
            inStock: {
              $sum: {
                $cond: [{ $gt: ['$stock', 0] }, 1, 0],
              },
            },
            outOfStock: {
              $sum: {
                $cond: [{ $lte: ['$stock', 0] }, 1, 0],
              },
            },
            averagePrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            averageRating: { $avg: '$rating' },
          },
        },
      ]),
      Product.distinct('category'),
      Product.find({})
        .sort({ rating: -1, createdAt: -1 })
        .limit(topLimit)
        .select('name category price rating stock image isNewArrival createdAt'),
    ])

    const summary = summaryRows[0]
    const totalCategories = categories
      .map((categoryValue) => (typeof categoryValue === 'string' ? categoryValue.trim() : ''))
      .filter(Boolean).length

    res.status(200).json({
      totalProducts: summary?.totalProducts ?? 0,
      newArrivals: summary?.newArrivals ?? 0,
      inStock: summary?.inStock ?? 0,
      outOfStock: summary?.outOfStock ?? 0,
      averagePrice: roundToTwoDecimals(summary?.averagePrice),
      minPrice: summary?.minPrice ?? 0,
      maxPrice: summary?.maxPrice ?? 0,
      averageRating: roundToTwoDecimals(summary?.averageRating),
      totalCategories,
      topRatedProducts: topRatedProducts.map((product) => product.toJSON()),
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
