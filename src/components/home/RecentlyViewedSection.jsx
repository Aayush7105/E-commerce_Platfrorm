import { useEffect, useMemo, useState } from 'react'
import {
  clearRecentlyViewedProducts,
  getRecentlyViewedProducts,
  subscribeToRecentlyViewedProducts,
} from '../../utils/recentlyViewed'
import ProductCard from './ProductCard'

function RecentlyViewedSection({ excludeProductId = '', title = 'Recently Viewed' }) {
  const [recentProducts, setRecentProducts] = useState(() => getRecentlyViewedProducts())

  useEffect(() => {
    return subscribeToRecentlyViewedProducts((items) => {
      setRecentProducts(items)
    })
  }, [])

  const visibleProducts = useMemo(
    () => recentProducts.filter((product) => String(product.id) !== String(excludeProductId)).slice(0, 4),
    [excludeProductId, recentProducts],
  )

  if (!visibleProducts.length) {
    return null
  }

  return (
    <section aria-labelledby="recently-viewed-title">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[0.78rem] uppercase tracking-[0.14em] text-zinc-500">Your Browsing</p>
          <h2 id="recently-viewed-title" className="mt-2 text-[clamp(1.55rem,2.8vw,2.35rem)] font-semibold">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={clearRecentlyViewedProducts}
          className="rounded-xl border border-white/15 px-4 py-2 text-[0.88rem] font-medium text-zinc-200 transition hover:border-white/35 hover:text-white"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {visibleProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  )
}

export default RecentlyViewedSection
