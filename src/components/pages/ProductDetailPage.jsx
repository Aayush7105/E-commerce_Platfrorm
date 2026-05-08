import { useEffect, useMemo, useState } from 'react'
import { FiArrowLeft, FiMinus, FiPackage, FiPlus, FiShield, FiShoppingBag, FiStar, FiTruck } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import { addRecentlyViewedProduct } from '../../utils/recentlyViewed'
import { useCart } from '../cart/useCart'
import { featuredCollections, footerColumns, navLinks, newArrivals } from '../home/homeData'
import Footer from '../home/Footer'
import Header from '../home/Header'
import RecentlyViewedSection from '../home/RecentlyViewedSection'
import WishlistToggleButton from '../home/WishlistToggleButton'
import { useToast } from '../ui/useToast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const MAX_DETAIL_QUANTITY = 10

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const staticProducts = [...featuredCollections, ...newArrivals].reduce((products, product) => {
  const productId = product.id === undefined || product.id === null ? '' : String(product.id)
  if (!productId || products.some((existingProduct) => String(existingProduct.id) === productId)) {
    return products
  }

  return [...products, product]
}, [])

const getProductId = (product) => {
  if (!product || typeof product !== 'object') {
    return ''
  }

  const rawId = product._id ?? product.id
  return rawId === undefined || rawId === null ? '' : String(rawId)
}

const findStaticProductById = (productId) =>
  staticProducts.find((product) => String(product.id) === String(productId)) ?? null

const isMongoObjectId = (value) => /^[a-f\d]{24}$/i.test(String(value))

const formatPrice = (value) => {
  const numericPrice = Number(value)
  return currencyFormatter.format(Number.isFinite(numericPrice) ? numericPrice : 0)
}

const clampRating = (value) => {
  const numericRating = Number(value)
  if (!Number.isFinite(numericRating)) return 0
  return Math.min(Math.max(numericRating, 0), 5)
}

const formatRating = (value) => {
  const rating = clampRating(value)
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1)
}

function DetailFeature({ icon, title, text }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
      {icon}
      <h3 className="mt-3 text-[0.98rem] font-semibold text-white">{title}</h3>
      <p className="mt-1 text-[0.86rem] leading-relaxed text-zinc-400">{text}</p>
    </article>
  )
}

function ProductDetailPage() {
  const { productId = '' } = useParams()
  const { addCartItem } = useCart()
  const { showToast } = useToast()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const staticProduct = findStaticProductById(productId)

    if (!isMongoObjectId(productId) && staticProduct) {
      setProduct(staticProduct)
      setErrorMessage('')
      setIsLoading(false)
      return undefined
    }

    const controller = new AbortController()

    const fetchProduct = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(productId)}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          let nextErrorMessage = 'Unable to load this product right now.'

          try {
            const errorPayload = await response.json()
            if (typeof errorPayload?.message === 'string' && errorPayload.message.trim()) {
              nextErrorMessage = errorPayload.message
            }
          } catch {
            // Keep the default error message when server payload is not JSON.
          }

          throw new Error(nextErrorMessage)
        }

        const productPayload = await response.json()
        setProduct(productPayload && typeof productPayload === 'object' ? productPayload : null)
      } catch (error) {
        if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError') {
          return
        }

        setProduct(staticProduct)
        setErrorMessage(
          staticProduct
            ? ''
            : error instanceof Error
              ? error.message
              : 'Unable to load this product right now.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchProduct()

    return () => controller.abort()
  }, [productId])

  useEffect(() => {
    setQuantity(1)
  }, [productId])

  useEffect(() => {
    if (product) {
      addRecentlyViewedProduct(product)
    }
  }, [product])

  const productName = typeof product?.name === 'string' && product.name.trim() ? product.name : 'Product Details'
  const productCategory =
    typeof product?.category === 'string' && product.category.trim() ? product.category : 'LUXE Product'
  const productDescription =
    typeof product?.description === 'string' && product.description.trim()
      ? product.description
      : 'A premium LUXE selection curated for elevated everyday styling.'
  const rating = clampRating(product?.rating)
  const filledStarCount = Math.round(rating)
  const ratingLabel = formatRating(product?.rating)
  const productStock = Number(product?.stock)
  const hasStockValue = Number.isFinite(productStock)
  const isOutOfStock = hasStockValue && productStock <= 0
  const maxQuantity = useMemo(() => {
    if (!hasStockValue) {
      return MAX_DETAIL_QUANTITY
    }

    return Math.max(1, Math.min(MAX_DETAIL_QUANTITY, productStock))
  }, [hasStockValue, productStock])
  const detailProductId = getProductId(product)

  const handleQuantityChange = (nextQuantity) => {
    setQuantity(Math.min(Math.max(nextQuantity, 1), maxQuantity))
  }

  const handleAddToCart = () => {
    if (!product || isOutOfStock) {
      return
    }

    const cartItem = addCartItem(product, quantity)

    if (!cartItem) {
      return
    }

    showToast({
      title: 'Added to cart',
      message: `${quantity} x ${cartItem.name}`,
      type: 'success',
    })
  }

  return (
    <div className="motion-page min-h-screen bg-[#050505] text-white antialiased [font-family:'Poppins',sans-serif]">
      <Header links={navLinks} cartCount={0} showSearch={false} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-4 pb-20 pt-10 sm:px-8">
        <Link
          to="/collections"
          className="motion-button inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-[0.9rem] font-medium text-zinc-200 no-underline hover:border-white/35 hover:text-white"
        >
          <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
          Collections
        </Link>

        {isLoading ? (
          <section className="motion-loading rounded-3xl border border-white/10 px-6 py-16 text-center text-zinc-200">
            Loading product details...
          </section>
        ) : null}

        {!isLoading && errorMessage ? (
          <section className="motion-fade-up rounded-3xl border border-red-500/25 bg-red-950/30 px-6 py-14 text-center">
            <h1 className="text-[clamp(1.8rem,3.4vw,3rem)] font-semibold text-white">Product Not Found</h1>
            <p className="mx-auto mt-3 max-w-xl text-[0.98rem] leading-relaxed text-red-100">{errorMessage}</p>
            <Link
              to="/"
              className="motion-button mt-7 inline-flex rounded-xl bg-white px-5 py-2.5 text-[0.95rem] font-semibold text-black no-underline hover:bg-zinc-200"
            >
              Back to Home
            </Link>
          </section>
        ) : null}

        {!isLoading && !errorMessage && product ? (
          <>
            <section className="grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(23rem,0.98fr)] lg:items-start">
              <div className="motion-fade-up relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
                <WishlistToggleButton product={product} />
                <img
                  src={product.image || '/favicon.svg'}
                  alt={productName}
                  className="aspect-[4/5] w-full object-cover lg:aspect-[5/6]"
                />
                {product.isNew ? (
                  <span className="motion-float absolute right-5 top-5 rounded-full bg-[#ff4d4d] px-3 py-1 text-[0.82rem] font-semibold text-white">
                    New
                  </span>
                ) : null}
              </div>

              <section className="motion-fade-up motion-delay-1">
                <p className="m-0 text-[0.78rem] uppercase tracking-[0.16em] text-zinc-400">{productCategory}</p>
                <h1 className="mt-4 text-[clamp(2.25rem,5vw,4.8rem)] leading-[0.98] font-semibold tracking-[-0.02em]">
                  {productName}
                </h1>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <p className="m-0 text-[clamp(1.7rem,2.6vw,2.45rem)] leading-none font-semibold">
                    {formatPrice(product.price)}
                  </p>
                  <p className="m-0 flex items-center gap-2 text-[0.92rem] text-zinc-300">
                    <span className="flex items-center gap-0.5" aria-label={`${ratingLabel} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <FiStar
                          key={index}
                          aria-hidden="true"
                          className={`h-4 w-4 ${index < filledStarCount ? 'fill-current text-yellow-400' : 'text-zinc-600'}`}
                        />
                      ))}
                    </span>
                    <span>({ratingLabel})</span>
                  </p>
                </div>

                <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-zinc-300">{productDescription}</p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-[0.86rem] font-medium ${
                      isOutOfStock
                        ? 'border-red-400/30 bg-red-950/30 text-red-200'
                        : 'border-emerald-400/25 bg-emerald-950/30 text-emerald-200'
                    }`}
                  >
                    {isOutOfStock
                      ? 'Out of stock'
                      : hasStockValue
                        ? `${productStock} available`
                        : 'In stock'}
                  </span>
                  <span className="rounded-full border border-white/10 bg-zinc-950 px-3 py-1.5 text-[0.86rem] text-zinc-300">
                    Free returns within 30 days
                  </span>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
                  <div className="inline-flex h-14 items-center rounded-2xl border border-white/10 bg-zinc-950">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="motion-icon-button inline-flex h-14 w-12 items-center justify-center rounded-l-2xl text-zinc-300 hover:bg-white/10 hover:text-white"
                    >
                      <FiMinus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-10 text-center text-[1rem] font-semibold text-white">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="motion-icon-button inline-flex h-14 w-12 items-center justify-center rounded-r-2xl text-zinc-300 hover:bg-white/10 hover:text-white"
                    >
                      <FiPlus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className="motion-button inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-[0.98rem] font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <FiShoppingBag className="h-4 w-4" aria-hidden="true" />
                    Add to Cart
                  </button>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <DetailFeature
                    icon={<FiTruck className="h-5 w-5 text-zinc-200" aria-hidden="true" />}
                    title="Fast Delivery"
                    text="Free shipping unlocks automatically on qualifying orders."
                  />
                  <DetailFeature
                    icon={<FiShield className="h-5 w-5 text-zinc-200" aria-hidden="true" />}
                    title="Secure Checkout"
                    text="Cart totals are estimated before payment and address screens."
                  />
                  <DetailFeature
                    icon={<FiPackage className="h-5 w-5 text-zinc-200" aria-hidden="true" />}
                    title="Premium Pack"
                    text="Every item ships with careful LUXE packaging."
                  />
                </div>
              </section>
            </section>

            <RecentlyViewedSection excludeProductId={detailProductId} title="Recently Viewed" />
          </>
        ) : null}
      </main>
      <Footer columns={footerColumns} />
    </div>
  )
}

export default ProductDetailPage
