import { FaStar } from 'react-icons/fa'
import { FiEye, FiShoppingBag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useCart } from '../cart/useCart'
import { useToast } from '../ui/useToast'
import CompareToggleButton from './CompareToggleButton'
import WishlistToggleButton from './WishlistToggleButton'

const getProductId = (product) => {
  if (!product || typeof product !== 'object') {
    return ''
  }

  const rawId = product._id ?? product.id
  return rawId === undefined || rawId === null ? '' : String(rawId)
}

function CategoryCard({ product, index = 0 }) {
  const { addCartItem } = useCart()
  const { showToast } = useToast()
  const productId = getProductId(product)
  const productDetailPath = productId ? `/products/${encodeURIComponent(productId)}` : '/collections'

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
    <article className="motion-card" style={{ animationDelay: `${index * 85}ms` }}>
      <div className="motion-hover-lift group relative overflow-hidden rounded-2xl border border-white/10 bg-[#090909] hover:border-white/20">
        <WishlistToggleButton product={product} />
        <img
          src={product.image}
          alt={product.name}
          className="h-[300px] w-full object-cover brightness-[0.78] contrast-[1.12] saturate-[0.88] transition duration-500 group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
        {product.isNew && (
          <span className="motion-float absolute right-4 top-4 rounded-full bg-[#ff4d4d] px-3 py-1 text-[0.75rem] font-semibold text-white">
            New
          </span>
        )}
      </div>

      <p className="mt-5 text-[0.74rem] uppercase tracking-[0.12em] text-zinc-400">
        {product.category}
      </p>
      <h3 className="mt-3 text-[clamp(1.08rem,1.25vw,1.35rem)] leading-tight font-semibold">{product.name}</h3>
      <p className="mt-4 flex items-center gap-2 text-[0.88rem] text-zinc-300">
        <span className="flex items-center gap-1 text-yellow-400">
          <FaStar className="h-3 w-3" />
          <FaStar className="h-3 w-3" />
          <FaStar className="h-3 w-3" />
          <FaStar className="h-3 w-3" />
          <FaStar className="h-3 w-3" />
        </span>
        <span>({product.rating})</span>
      </p>
      <p className="mt-4 text-[clamp(1.35rem,1.65vw,1.7rem)] leading-none font-semibold">${product.price}</p>
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_3.25rem_3.25rem] gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="motion-button inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-zinc-900 px-5 text-[0.95rem] font-semibold text-white hover:border-white/30 hover:bg-zinc-800"
        >
          <FiShoppingBag className="h-4 w-4" aria-hidden="true" />
          Add
        </button>
        <Link
          to={productDetailPath}
          title={`View details for ${product.name}`}
          aria-label={`View details for ${product.name}`}
          className="motion-icon-button inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/15 bg-zinc-900 text-white no-underline hover:border-white/35 hover:bg-zinc-800"
        >
          <FiEye className="h-4 w-4" aria-hidden="true" />
        </Link>
        <CompareToggleButton product={product} className="h-12 w-full rounded-2xl" />
      </div>
    </article>
  )
}

export default CategoryCard
