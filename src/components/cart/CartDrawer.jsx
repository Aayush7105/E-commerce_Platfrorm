import { useEffect, useMemo, useState } from 'react'
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiX } from 'react-icons/fi'
import { useToast } from '../ui/useToast'
import { useCart } from './useCart'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const formatPrice = (value) => currencyFormatter.format(Number.isFinite(Number(value)) ? Number(value) : 0)
const FREE_SHIPPING_THRESHOLD = 200
const STANDARD_SHIPPING_FEE = 12
const ESTIMATED_TAX_RATE = 0.08
const PROMO_CODES = {
  LUXE10: {
    label: 'LUXE10',
    rate: 0.1,
  },
  WELCOME15: {
    label: 'WELCOME15',
    rate: 0.15,
  },
}

function CartDrawer() {
  const {
    items,
    subtotal,
    totalQuantity,
    isCartOpen,
    closeCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
  } = useCart()
  const { showToast } = useToast()
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromoCode, setAppliedPromoCode] = useState('')

  const orderSummary = useMemo(() => {
    const promo = PROMO_CODES[appliedPromoCode]
    const discount = promo ? subtotal * promo.rate : 0
    const discountedSubtotal = Math.max(subtotal - discount, 0)
    const shipping = items.length === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
    const estimatedTax = discountedSubtotal * ESTIMATED_TAX_RATE
    const total = discountedSubtotal + shipping + estimatedTax
    const freeShippingRemaining = Math.max(FREE_SHIPPING_THRESHOLD - discountedSubtotal, 0)

    return {
      discount,
      estimatedTax,
      freeShippingRemaining,
      shipping,
      total,
    }
  }, [appliedPromoCode, items.length, subtotal])

  useEffect(() => {
    if (!isCartOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isCartOpen])

  useEffect(() => {
    if (!isCartOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeCart()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeCart, isCartOpen])

  if (!isCartOpen) {
    return null
  }

  const handleRemoveItem = (item) => {
    removeCartItem(item.id)
    showToast({
      title: 'Removed from cart',
      message: item.name,
      type: 'info',
    })
  }

  const handleClearCart = () => {
    clearCart()
    setAppliedPromoCode('')
    setPromoInput('')
    showToast({
      title: 'Cart cleared',
      message: 'Your shopping bag is empty again.',
      type: 'info',
    })
  }

  const handleCheckout = () => {
    showToast({
      title: 'Checkout flow coming next',
      message: `Estimated total: ${formatPrice(orderSummary.total)}.`,
      type: 'success',
    })
  }

  const handleApplyPromo = (event) => {
    event.preventDefault()

    const normalizedCode = promoInput.trim().toUpperCase()
    const promo = PROMO_CODES[normalizedCode]

    if (!items.length) {
      showToast({
        title: 'Cart is empty',
        message: 'Add a product before applying a promo code.',
        type: 'info',
      })
      return
    }

    if (!normalizedCode) {
      showToast({
        title: 'Enter a promo code',
        message: 'Try LUXE10 or WELCOME15.',
        type: 'info',
      })
      return
    }

    if (!promo) {
      showToast({
        title: 'Promo code not found',
        message: 'Try LUXE10 or WELCOME15.',
        type: 'info',
      })
      return
    }

    setAppliedPromoCode(promo.label)
    setPromoInput(promo.label)
    showToast({
      title: 'Promo applied',
      message: `${Math.round(promo.rate * 100)}% discount added to your bag.`,
      type: 'success',
    })
  }

  const handleRemovePromo = () => {
    setAppliedPromoCode('')
    setPromoInput('')
    showToast({
      title: 'Promo removed',
      message: 'Your cart total has been updated.',
      type: 'info',
    })
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="motion-page absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="motion-cart-drawer absolute right-0 top-0 flex h-full w-[min(92vw,27rem)] flex-col border-l border-white/10 bg-[#080808] shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="m-0 text-[0.76rem] uppercase tracking-[0.15em] text-zinc-500">Shopping Bag</p>
            <h2 className="mt-1 text-[1.35rem] font-semibold leading-tight text-white">
              {totalQuantity} item{totalQuantity === 1 ? '' : 's'}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="motion-icon-button inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-white hover:bg-white/10"
          >
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {items.length > 0 ? (
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div className="grid gap-4">
              {items.map((item, index) => (
                <article
                  key={item.id}
                  className="motion-fade-up grid grid-cols-[5rem_1fr] gap-4 rounded-2xl border border-white/10 bg-zinc-950/80 p-3"
                  style={{ animationDelay: `${index * 55}ms` }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="m-0 truncate text-[0.95rem] font-semibold text-white">{item.name}</p>
                        <p className="mt-1 text-[0.78rem] uppercase tracking-[0.11em] text-zinc-500">
                          {item.category}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => handleRemoveItem(item)}
                        className="motion-icon-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/10 hover:text-white"
                      >
                        <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-xl border border-white/10 bg-black">
                        <button
                          type="button"
                          aria-label={`Decrease quantity for ${item.name}`}
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="motion-icon-button inline-flex h-9 w-9 items-center justify-center rounded-l-xl text-zinc-300 hover:bg-white/10 hover:text-white"
                        >
                          <FiMinus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="min-w-9 text-center text-[0.9rem] font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity for ${item.name}`}
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="motion-icon-button inline-flex h-9 w-9 items-center justify-center rounded-r-xl text-zinc-300 hover:bg-white/10 hover:text-white"
                        >
                          <FiPlus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="m-0 text-[0.98rem] font-semibold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="motion-float inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950 text-zinc-300">
              <FiShoppingBag className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-[1.35rem] font-semibold text-white">Your cart is empty</h2>
            <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-zinc-400">
              Add a product from the catalog and it will appear here.
            </p>
          </div>
        )}

        <div className="border-t border-white/10 p-5">
          {items.length > 0 ? (
            <button
              type="button"
              onClick={handleClearCart}
              className="mb-4 text-[0.88rem] font-medium text-zinc-400 transition hover:text-white"
            >
              Clear cart
            </button>
          ) : null}

          {items.length > 0 ? (
            <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="text-[0.88rem] font-medium text-zinc-300">Promo code</span>
                {appliedPromoCode ? (
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-[0.8rem] font-medium text-zinc-400 transition hover:text-white"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <form className="grid grid-cols-[minmax(0,1fr)_5.5rem] gap-2" onSubmit={handleApplyPromo}>
                <input
                  type="text"
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value)}
                  placeholder="LUXE10"
                  className="h-11 min-w-0 rounded-xl border border-white/10 bg-black px-3 text-[0.9rem] uppercase text-white outline-none placeholder:text-zinc-600 focus:border-white/35"
                />
                <button
                  type="submit"
                  className="motion-button h-11 rounded-xl bg-white px-3 text-[0.88rem] font-semibold text-black hover:bg-zinc-200"
                >
                  Apply
                </button>
              </form>
              {orderSummary.freeShippingRemaining > 0 ? (
                <p className="mt-3 text-[0.82rem] leading-relaxed text-zinc-400">
                  Add {formatPrice(orderSummary.freeShippingRemaining)} more for free shipping.
                </p>
              ) : (
                <p className="mt-3 text-[0.82rem] leading-relaxed text-emerald-200">
                  Free shipping is unlocked for this order.
                </p>
              )}
            </div>
          ) : null}

          <div className="grid gap-2 text-[0.9rem]">
            <div className="flex items-center justify-between gap-4 text-zinc-400">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {orderSummary.discount > 0 ? (
              <div className="flex items-center justify-between gap-4 text-emerald-200">
                <span>Discount</span>
                <span>-{formatPrice(orderSummary.discount)}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4 text-zinc-400">
              <span>Shipping</span>
              <span>{orderSummary.shipping > 0 ? formatPrice(orderSummary.shipping) : 'Free'}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-zinc-400">
              <span>Estimated tax</span>
              <span>{formatPrice(orderSummary.estimatedTax)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4 border-t border-white/10 pt-3">
              <span className="text-[0.95rem] text-zinc-300">Estimated total</span>
              <strong className="text-[1.45rem] leading-none text-white">{formatPrice(orderSummary.total)}</strong>
            </div>
          </div>
          <button
            type="button"
            disabled={items.length === 0}
            onClick={handleCheckout}
            className="motion-button mt-5 h-14 w-full rounded-2xl bg-white px-5 text-[0.98rem] font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  )
}

export default CartDrawer
