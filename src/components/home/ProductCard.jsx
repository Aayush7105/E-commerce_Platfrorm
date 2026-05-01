import { FiShoppingBag, FiStar } from 'react-icons/fi'
import { useCart } from '../cart/useCart'
import { useToast } from '../ui/useToast'
import WishlistToggleButton from './WishlistToggleButton'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const clampRating = (value) => {
  const numericRating = Number(value)
  if (!Number.isFinite(numericRating)) return 0
  return Math.min(Math.max(numericRating, 0), 5)
}

const formatRating = (value) => {
  const rating = clampRating(value)
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1)
}

const formatPrice = (value) => {
  const numericPrice = Number(value)
  return currencyFormatter.format(Number.isFinite(numericPrice) ? numericPrice : 0)
}

function ProductCard({ product, index = 0 }) {
  const { addCartItem } = useCart()
  const { showToast } = useToast()
  const rating = clampRating(product.rating)
  const filledStarCount = Math.round(rating)
  const ratingLabel = formatRating(product.rating)
  const productName = typeof product.name === 'string' && product.name.trim() ? product.name : 'Untitled Product'
  const productCategory =
    typeof product.category === 'string' && product.category.trim() ? product.category : 'General'

  const handleAddToCart = () => {
    const cartItem = addCartItem(product)

    if (!cartItem) {
      return
    }

    showToast({
      title: 'Added to cart',
      message: cartItem.name,
      type: 'success',
    })
  }

  return (
    <article className="motion-card" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="motion-hover-lift group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 hover:border-white/20">
        <WishlistToggleButton product={product} />
        <img
          src={product.image}
          alt={productName}
          className="h-[330px] w-full object-cover transition duration-500 group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        {product.isNew && (
          <span className="motion-float absolute right-4 top-4 rounded-full bg-[#ff4d4d] px-3 py-1 text-[0.82rem] font-semibold text-white">
            New
          </span>
        )}
      </div>

      <p className="mt-3.5 text-[0.78rem] uppercase tracking-[0.14em] text-zinc-400">
        {productCategory}
      </p>
      <h3 className="mt-1.5 text-[clamp(1.05rem,1.2vw,1.3rem)] leading-tight font-semibold">{productName}</h3>
      <p className="mt-2.5 flex items-center gap-2 text-[0.88rem] text-zinc-300">
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
      <p className="mt-3 text-[clamp(1.3rem,1.6vw,1.7rem)] leading-none font-semibold">
        {formatPrice(product.price)}
      </p>
      <button
        type="button"
        onClick={handleAddToCart}
        className="motion-button mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-[0.95rem] font-semibold text-black hover:bg-zinc-200"
      >
        <FiShoppingBag className="h-4 w-4" aria-hidden="true" />
        Add to Cart
      </button>
    </article>
  )
}

export default ProductCard
