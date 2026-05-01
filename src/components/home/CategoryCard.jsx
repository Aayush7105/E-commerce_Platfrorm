import { FaStar } from 'react-icons/fa'
import { FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../cart/useCart'
import { useToast } from '../ui/useToast'
import WishlistToggleButton from './WishlistToggleButton'

function CategoryCard({ product, index = 0 }) {
  const { addCartItem } = useCart()
  const { showToast } = useToast()

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
      <button
        type="button"
        onClick={handleAddToCart}
        className="motion-button mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-zinc-900 px-5 text-[0.95rem] font-semibold text-white hover:border-white/30 hover:bg-zinc-800"
      >
        <FiShoppingBag className="h-4 w-4" aria-hidden="true" />
        Add to Cart
      </button>
    </article>
  )
}

export default CategoryCard
