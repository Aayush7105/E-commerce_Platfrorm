import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.isNew = ret.isNewArrival
        delete ret.isNewArrival
        return ret
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.isNew = ret.isNewArrival
        delete ret.isNewArrival
        return ret
      },
    },
  },
)

productSchema.index({ category: 1 })

const Product = mongoose.model('Product', productSchema)

export default Product
