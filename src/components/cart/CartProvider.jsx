import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContext'
import CartDrawer from './CartDrawer'

const CART_STORAGE_KEY = 'luxe_cart_items'
const MAX_CART_QUANTITY = 99

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const normalizeProductId = (product) => {
  if (!product || typeof product !== 'object') {
    return ''
  }

  const rawId = product._id ?? product.id
  return rawId === undefined || rawId === null ? '' : String(rawId)
}

const normalizeQuantity = (quantity) => {
  const numericQuantity = Number(quantity)

  if (!Number.isFinite(numericQuantity)) {
    return 1
  }

  return Math.min(Math.max(Math.round(numericQuantity), 1), MAX_CART_QUANTITY)
}

const normalizeCartItem = (item) => {
  if (!item || typeof item !== 'object') {
    return null
  }

  const id = normalizeProductId(item)
  if (!id) {
    return null
  }

  const parsedPrice = Number(item.price)

  return {
    id,
    name: typeof item.name === 'string' && item.name.trim() ? item.name.trim() : 'Untitled Product',
    category: typeof item.category === 'string' && item.category.trim() ? item.category.trim() : 'General',
    image: typeof item.image === 'string' && item.image.trim() ? item.image.trim() : '/favicon.svg',
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    quantity: normalizeQuantity(item.quantity),
  }
}

const normalizeCartItems = (items) => {
  if (!Array.isArray(items)) {
    return []
  }

  const normalizedItems = []
  const seenIds = new Set()

  items.forEach((item) => {
    const normalizedItem = normalizeCartItem(item)

    if (!normalizedItem || seenIds.has(normalizedItem.id)) {
      return
    }

    normalizedItems.push(normalizedItem)
    seenIds.add(normalizedItem.id)
  })

  return normalizedItems
}

const getStoredCartItems = () => {
  if (!canUseStorage()) {
    return []
  }

  try {
    const rawItems = window.localStorage.getItem(CART_STORAGE_KEY)
    return rawItems ? normalizeCartItems(JSON.parse(rawItems)) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => getStoredCartItems())
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    if (canUseStorage()) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleStorage = (event) => {
      if (event.key === CART_STORAGE_KEY) {
        setItems(getStoredCartItems())
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const openCart = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  const addCartItem = useCallback((product, quantity = 1) => {
    const normalizedItem = normalizeCartItem({
      ...product,
      quantity,
    })

    if (!normalizedItem) {
      return null
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === normalizedItem.id)

      if (!existingItem) {
        return [normalizedItem, ...currentItems]
      }

      return currentItems.map((item) =>
        item.id === normalizedItem.id
          ? {
              ...item,
              quantity: normalizeQuantity(item.quantity + normalizedItem.quantity),
            }
          : item,
      )
    })

    setIsCartOpen(true)
    return normalizedItem
  }, [])

  const updateCartItemQuantity = useCallback((id, quantity) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: normalizeQuantity(quantity),
            }
          : item,
      ),
    )
  }, [])

  const removeCartItem = useCallback((id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalQuantity = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  )

  const contextValue = useMemo(
    () => ({
      items,
      totalQuantity,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
      addCartItem,
      updateCartItemQuantity,
      removeCartItem,
      clearCart,
    }),
    [
      addCartItem,
      clearCart,
      closeCart,
      isCartOpen,
      items,
      openCart,
      removeCartItem,
      subtotal,
      totalQuantity,
      updateCartItemQuantity,
    ],
  )

  return (
    <CartContext.Provider value={contextValue}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  )
}
