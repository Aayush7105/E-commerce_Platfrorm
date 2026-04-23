import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../home/ProductCard'
import { clearWishlist, getWishlistItems, subscribeToWishlist } from '../../utils/wishlist'
import PageLayout from './PageLayout'

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(() => getWishlistItems())

  useEffect(() => {
    return subscribeToWishlist((items) => {
      setWishlistItems(items)
    })
  }, [])

  const handleClearWishlist = () => {
    clearWishlist()
  }

  return (
    <PageLayout
      title="Your Wishlist"
      subtitle="Save your favorite products and come back anytime to shop them later."
    >
      {wishlistItems.length > 0 ? (
        <section>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-950/70 px-5 py-4">
            <p className="m-0 text-[0.92rem] text-zinc-300">
              {wishlistItems.length} saved item{wishlistItems.length === 1 ? '' : 's'}
            </p>
            <button
              type="button"
              onClick={handleClearWishlist}
              className="rounded-xl border border-white/25 px-4 py-2 text-[0.88rem] font-medium text-white transition hover:border-white/45"
            >
              Clear Wishlist
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-8 text-center">
          <p className="m-0 text-[1rem] leading-relaxed text-zinc-300">
            Your wishlist is empty. Tap the heart icon on any product to save it here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/collections"
              className="rounded-xl bg-white px-5 py-2.5 text-[0.95rem] font-semibold text-black no-underline transition hover:bg-zinc-200"
            >
              Browse Collections
            </Link>
            <Link
              to="/new-arrivals"
              className="rounded-xl border border-white/25 px-5 py-2.5 text-[0.95rem] font-semibold text-white no-underline transition hover:border-white/45"
            >
              New Arrivals
            </Link>
          </div>
        </section>
      )}
    </PageLayout>
  )
}

export default WishlistPage
