import { useEffect, useState } from 'react'
import { FiHeart } from 'react-icons/fi'
import { getWishlistItems, subscribeToWishlist, toggleWishlistItem } from '../../utils/wishlist'

const getProductId = (product) => {
  if (!product || typeof product !== 'object') {
    return ''
  }

  const rawId = product._id ?? product.id
  if (rawId === undefined || rawId === null) {
    return ''
  }

  return String(rawId)
}

function WishlistToggleButton({ product }) {
  const productId = getProductId(product)
  const [wishlistItems, setWishlistItems] = useState(() => getWishlistItems())
  const isWishlisted = productId ? wishlistItems.some((item) => item.id === productId) : false

  useEffect(() => {
    return subscribeToWishlist((items) => {
      setWishlistItems(items)
    })
  }, [])

  const handleWishlistToggle = () => {
    if (!productId) {
      return
    }

    const { items } = toggleWishlistItem(product)
    setWishlistItems(items)
  }

  return (
    <button
      type="button"
      onClick={handleWishlistToggle}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={isWishlisted}
      className={`absolute left-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
        isWishlisted
          ? 'border-red-400/70 bg-red-500/25 text-red-300 hover:bg-red-500/35'
          : 'border-white/25 bg-black/35 text-white hover:bg-black/60'
      }`}
    >
      <FiHeart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
    </button>
  )
}

export default WishlistToggleButton
