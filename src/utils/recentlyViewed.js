const RECENTLY_VIEWED_STORAGE_KEY = 'luxe_recently_viewed_items'
const RECENTLY_VIEWED_UPDATE_EVENT = 'luxe:recently-viewed-updated'
const MAX_RECENTLY_VIEWED_ITEMS = 6

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
  return rawId === undefined || rawId === null ? '' : String(rawId)
}

const normalizeRecentlyViewedItem = (product) => {
  if (!product || typeof product !== 'object') {
    return null
  }

  const id = normalizeProductId(product)
  if (!id) {
    return null
  }

  const parsedPrice = Number(product.price)
  const parsedRating = Number(product.rating)
  const parsedStock = Number(product.stock)

  const normalizedItem = {
    id,
    name: typeof product.name === 'string' && product.name.trim() ? product.name.trim() : 'Untitled Product',
    category: typeof product.category === 'string' && product.category.trim() ? product.category.trim() : 'General',
    image: typeof product.image === 'string' && product.image.trim() ? product.image.trim() : '/favicon.svg',
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    rating: Number.isFinite(parsedRating) ? parsedRating : 0,
    isNew: Boolean(product.isNew),
    description:
      typeof product.description === 'string' && product.description.trim() ? product.description.trim() : '',
    stock: Number.isFinite(parsedStock) ? parsedStock : undefined,
  }

  if (typeof product._id === 'string' && product._id.trim()) {
    normalizedItem._id = product._id.trim()
  }

  return normalizedItem
}

const normalizeRecentlyViewedArray = (value) => {
  if (!Array.isArray(value)) {
    return []
  }

  const normalizedItems = value
    .map((item) => normalizeRecentlyViewedItem(item))
    .filter((item) => item !== null)

  const uniqueItems = []
  const seenItemIds = new Set()

  normalizedItems.forEach((item) => {
    if (!seenItemIds.has(item.id)) {
      uniqueItems.push(item)
      seenItemIds.add(item.id)
    }
  })

  return uniqueItems.slice(0, MAX_RECENTLY_VIEWED_ITEMS)
}

const emitRecentlyViewedUpdate = (items) => {
  if (!canUseStorage()) {
    return
  }

  window.dispatchEvent(
    new CustomEvent(RECENTLY_VIEWED_UPDATE_EVENT, {
      detail: items,
    }),
  )
}

const persistRecentlyViewedProducts = (items) => {
  if (!canUseStorage()) {
    return
  }

  const normalizedItems = normalizeRecentlyViewedArray(items)
  window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(normalizedItems))
  emitRecentlyViewedUpdate(normalizedItems)
}

export const getRecentlyViewedProducts = () => {
  if (!canUseStorage()) {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY)
    if (!rawValue) {
      return []
    }

    return normalizeRecentlyViewedArray(JSON.parse(rawValue))
  } catch {
    return []
  }
}

export const addRecentlyViewedProduct = (product) => {
  const normalizedItem = normalizeRecentlyViewedItem(product)
  if (!normalizedItem) {
    return getRecentlyViewedProducts()
  }

  const nextItems = [
    normalizedItem,
    ...getRecentlyViewedProducts().filter((item) => item.id !== normalizedItem.id),
  ].slice(0, MAX_RECENTLY_VIEWED_ITEMS)

  persistRecentlyViewedProducts(nextItems)
  return nextItems
}

export const clearRecentlyViewedProducts = () => {
  persistRecentlyViewedProducts([])
}

export const subscribeToRecentlyViewedProducts = (listener) => {
  if (typeof listener !== 'function' || typeof window === 'undefined') {
    return () => {}
  }

  const notify = () => {
    listener(getRecentlyViewedProducts())
  }

  const handleUpdateEvent = () => {
    notify()
  }

  const handleStorageEvent = (event) => {
    if (event.key === RECENTLY_VIEWED_STORAGE_KEY) {
      notify()
    }
  }

  window.addEventListener(RECENTLY_VIEWED_UPDATE_EVENT, handleUpdateEvent)
  window.addEventListener('storage', handleStorageEvent)

  return () => {
    window.removeEventListener(RECENTLY_VIEWED_UPDATE_EVENT, handleUpdateEvent)
    window.removeEventListener('storage', handleStorageEvent)
  }
}
