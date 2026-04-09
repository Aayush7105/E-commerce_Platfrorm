import { Router } from 'express'
import {
  getCatalogStats,
  getProductCategories,
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController.js'

const router = Router()

router.get('/categories', getProductCategories)
router.get('/stats', getCatalogStats)
router.route('/').get(getProducts).post(createProduct)
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct)

export default router
