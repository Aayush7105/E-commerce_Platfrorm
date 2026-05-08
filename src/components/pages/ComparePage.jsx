import { useEffect, useState } from 'react'
import { FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import {
  clearCompareItems,
  getCompareItems,
  removeCompareItem,
  subscribeToCompareItems,
} from '../../utils/compare'
import { useCart } from '../cart/useCart'
import PageLayout from './PageLayout'
import { useToast } from '../ui/useToast'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const formatPrice = (value) => {
  const numericPrice = Number(value)
  return currencyFormatter.format(Number.isFinite(numericPrice) ? numericPrice : 0)
}

const formatStock = (stock) => {
  const numericStock = Number(stock)

  if (!Number.isFinite(numericStock)) {
    return 'In stock'
  }

  if (numericStock <= 0) {
    return 'Out of stock'
  }

  return `${numericStock} available`
}

function ComparePage() {
  const [compareItems, setCompareItems] = useState(() => getCompareItems())
  const { addCartItem } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    return subscribeToCompareItems((items) => {
      setCompareItems(items)
    })
  }, [])

  const handleRemoveItem = (product) => {
    setCompareItems(removeCompareItem(product.id))
    showToast({
      title: 'Removed from compare',
      message: product.name,
      type: 'info',
    })
  }

  const handleClearCompare = () => {
    clearCompareItems()
    showToast({
      title: 'Compare list cleared',
      message: 'Start a fresh product comparison anytime.',
      type: 'info',
    })
  }

  const handleAddToCart = (product) => {
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
    <PageLayout
      title="Compare Products"
      subtitle="Review saved products side by side before choosing what belongs in your bag."
    >
      {compareItems.length > 0 ? (
        <section>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-950/70 px-5 py-4">
            <p className="m-0 text-[0.92rem] text-zinc-300">
              {compareItems.length} product{compareItems.length === 1 ? '' : 's'} selected
            </p>
            <button
              type="button"
              onClick={handleClearCompare}
              className="rounded-xl border border-white/25 px-4 py-2 text-[0.88rem] font-medium text-white transition hover:border-white/45"
            >
              Clear Compare
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950/70">
            <div
              className="grid min-w-[44rem]"
              style={{ gridTemplateColumns: `11rem repeat(${compareItems.length}, minmax(11rem, 1fr))` }}
            >
              <div className="border-b border-white/10 p-4 text-[0.78rem] uppercase tracking-[0.12em] text-zinc-500">
                Product
              </div>
              {compareItems.map((product) => (
                <article key={product.id} className="border-b border-l border-white/10 p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                  <h2 className="mt-4 text-[1rem] font-semibold leading-tight text-white">{product.name}</h2>
                  <p className="mt-1 text-[0.78rem] uppercase tracking-[0.11em] text-zinc-500">
                    {product.category}
                  </p>
                </article>
              ))}

              <div className="border-b border-white/10 p-4 text-[0.9rem] font-medium text-zinc-300">Price</div>
              {compareItems.map((product) => (
                <div key={`${product.id}-price`} className="border-b border-l border-white/10 p-4 text-white">
                  {formatPrice(product.price)}
                </div>
              ))}

              <div className="border-b border-white/10 p-4 text-[0.9rem] font-medium text-zinc-300">Rating</div>
              {compareItems.map((product) => (
                <div key={`${product.id}-rating`} className="border-b border-l border-white/10 p-4 text-white">
                  {Number(product.rating).toFixed(1)} / 5
                </div>
              ))}

              <div className="border-b border-white/10 p-4 text-[0.9rem] font-medium text-zinc-300">Stock</div>
              {compareItems.map((product) => (
                <div key={`${product.id}-stock`} className="border-b border-l border-white/10 p-4 text-zinc-200">
                  {formatStock(product.stock)}
                </div>
              ))}

              <div className="p-4 text-[0.9rem] font-medium text-zinc-300">Actions</div>
              {compareItems.map((product) => (
                <div key={`${product.id}-actions`} className="border-l border-white/10 p-4">
                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="motion-button inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-3 text-[0.88rem] font-semibold text-black hover:bg-zinc-200"
                    >
                      <FiShoppingBag className="h-4 w-4" aria-hidden="true" />
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(product)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-3 text-[0.88rem] font-semibold text-zinc-200 transition hover:border-white/35 hover:text-white"
                    >
                      <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-8 text-center">
          <p className="m-0 text-[1rem] leading-relaxed text-zinc-300">
            Your compare list is empty. Use the compare icon on products to build a side-by-side view.
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

export default ComparePage
