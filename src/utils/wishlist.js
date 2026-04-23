const WISHLIST_STORAGE_KEY = 'luxe_wishlist_items'
const WISHLIST_UPDATE_EVENT = 'luxe:wishlist-updated'
const MAX_WISHLIST_ITEMS = 100

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const normalizeProductId = (productOrId) => {
  if (typeof productOrId === 'string' || typeof productOrId === 'number') {
    return String(productOrId)
  }

  if (!productOrId || typeof productOrId !== 'object') {
    return ''
  }

  const rawId = productOrId._id ?? productOrId.id
  if (rawId === undefined || rawId === null) {
    return ''
  }

  return String(rawId)
}

const normalizeWishlistItem = (product) => {
  if (!product || typeof product !== 'object') {
    return null
  }

  const id = normalizeProductId(product)
  if (!id) {
    return null
  }

  const parsedPrice = Number(product.price)
  const parsedRating = Number(product.rating)

  const normalizedItem = {
    id,
    name: typeof product.name === 'string' && product.name.trim() ? product.name.trim() : 'Untitled Product',
    category: typeof product.category === 'string' && product.category.trim() ? product.category.trim() : 'General',
    image: typeof product.image === 'string' && product.image.trim() ? product.image.trim() : '/favicon.svg',
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    rating: Number.isFinite(parsedRating) ? parsedRating : 0,
    isNew: Boolean(product.isNew),
  }

  if (typeof product._id === 'string' && product._id.trim()) {
    normalizedItem._id = product._id.trim()
  }

  return normalizedItem
}

const normalizeWishlistArray = (value) => {
  if (!Array.isArray(value)) {
    return []
  }

  const normalizedItems = value
    .map((item) => normalizeWishlistItem(item))
    .filter((item) => item !== null)

  const uniqueItems = []
  const seenItemIds = new Set()

  normalizedItems.forEach((item) => {
    if (!seenItemIds.has(item.id)) {
      uniqueItems.push(item)
      seenItemIds.add(item.id)
    }
  })

  return uniqueItems.slice(0, MAX_WISHLIST_ITEMS)
}

const emitWishlistUpdate = (items) => {
  if (!canUseStorage()) {
    return
  }

  window.dispatchEvent(
    new CustomEvent(WISHLIST_UPDATE_EVENT, {
      detail: items,
    }),
  )
}

const persistWishlistItems = (items) => {
  if (!canUseStorage()) {
    return
  }

  const normalizedItems = normalizeWishlistArray(items)
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(normalizedItems))
  emitWishlistUpdate(normalizedItems)
}

export const getWishlistItems = () => {
  if (!canUseStorage()) {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue)
    return normalizeWishlistArray(parsedValue)
  } catch {
    return []
  }
}

export const isProductWishlisted = (productOrId) => {
  const id = normalizeProductId(productOrId)
  if (!id) {
    return false
  }

  return getWishlistItems().some((item) => item.id === id)
}

export const toggleWishlistItem = (product) => {
  const normalizedItem = normalizeWishlistItem(product)
  if (!normalizedItem) {
    return {
      items: getWishlistItems(),
      isWishlisted: false,
    }
  }

  const existingItems = getWishlistItems()
  const alreadyWishlisted = existingItems.some((item) => item.id === normalizedItem.id)

  const nextItems = alreadyWishlisted
    ? existingItems.filter((item) => item.id !== normalizedItem.id)
    : [normalizedItem, ...existingItems].slice(0, MAX_WISHLIST_ITEMS)

  persistWishlistItems(nextItems)

  return {
    items: nextItems,
    isWishlisted: !alreadyWishlisted,
  }
}

export const removeWishlistItem = (productOrId) => {
  const id = normalizeProductId(productOrId)
  if (!id) {
    return getWishlistItems()
  }

  const nextItems = getWishlistItems().filter((item) => item.id !== id)
  persistWishlistItems(nextItems)
  return nextItems
}

export const clearWishlist = () => {
  persistWishlistItems([])
}

export const subscribeToWishlist = (listener) => {
  if (typeof listener !== 'function' || typeof window === 'undefined') {
    return () => {}
  }

  const notify = () => {
    listener(getWishlistItems())
  }

  const handleUpdateEvent = () => {
    notify()
  }

  const handleStorageEvent = (event) => {
    if (event.key === WISHLIST_STORAGE_KEY) {
      notify()
    }
  }

  window.addEventListener(WISHLIST_UPDATE_EVENT, handleUpdateEvent)
  window.addEventListener('storage', handleStorageEvent)

  return () => {
    window.removeEventListener(WISHLIST_UPDATE_EVENT, handleUpdateEvent)
    window.removeEventListener('storage', handleStorageEvent)
  }
}
