const COMPARE_STORAGE_KEY = 'luxe_compare_items'
const COMPARE_UPDATE_EVENT = 'luxe:compare-updated'
const MAX_COMPARE_ITEMS = 4

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

const normalizeCompareItem = (product) => {
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
    stock: Number.isFinite(parsedStock) ? parsedStock : undefined,
    isNew: Boolean(product.isNew),
    description:
      typeof product.description === 'string' && product.description.trim() ? product.description.trim() : '',
  }

  if (typeof product._id === 'string' && product._id.trim()) {
    normalizedItem._id = product._id.trim()
  }

  return normalizedItem
}

const normalizeCompareItems = (items) => {
  if (!Array.isArray(items)) {
    return []
  }

  const uniqueItems = []
  const seenIds = new Set()

  items.forEach((item) => {
    const normalizedItem = normalizeCompareItem(item)

    if (!normalizedItem || seenIds.has(normalizedItem.id)) {
      return
    }

    uniqueItems.push(normalizedItem)
    seenIds.add(normalizedItem.id)
  })

  return uniqueItems.slice(0, MAX_COMPARE_ITEMS)
}

const emitCompareUpdate = (items) => {
  if (!canUseStorage()) {
    return
  }

  window.dispatchEvent(
    new CustomEvent(COMPARE_UPDATE_EVENT, {
      detail: items,
    }),
  )
}

const persistCompareItems = (items) => {
  if (!canUseStorage()) {
    return
  }

  const normalizedItems = normalizeCompareItems(items)
  window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(normalizedItems))
  emitCompareUpdate(normalizedItems)
}

export const getCompareItems = () => {
  if (!canUseStorage()) {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(COMPARE_STORAGE_KEY)
    return rawValue ? normalizeCompareItems(JSON.parse(rawValue)) : []
  } catch {
    return []
  }
}

export const isProductCompared = (productOrId) => {
  const id = normalizeProductId(productOrId)
  if (!id) {
    return false
  }

  return getCompareItems().some((item) => item.id === id)
}

export const toggleCompareItem = (product) => {
  const normalizedItem = normalizeCompareItem(product)
  const currentItems = getCompareItems()

  if (!normalizedItem) {
    return {
      items: currentItems,
      isCompared: false,
      limitReached: false,
    }
  }

  const alreadyCompared = currentItems.some((item) => item.id === normalizedItem.id)

  if (alreadyCompared) {
    const nextItems = currentItems.filter((item) => item.id !== normalizedItem.id)
    persistCompareItems(nextItems)

    return {
      items: nextItems,
      isCompared: false,
      limitReached: false,
    }
  }

  if (currentItems.length >= MAX_COMPARE_ITEMS) {
    return {
      items: currentItems,
      isCompared: false,
      limitReached: true,
    }
  }

  const nextItems = [normalizedItem, ...currentItems]
  persistCompareItems(nextItems)

  return {
    items: nextItems,
    isCompared: true,
    limitReached: false,
  }
}

export const removeCompareItem = (productOrId) => {
  const id = normalizeProductId(productOrId)
  if (!id) {
    return getCompareItems()
  }

  const nextItems = getCompareItems().filter((item) => item.id !== id)
  persistCompareItems(nextItems)
  return nextItems
}

export const clearCompareItems = () => {
  persistCompareItems([])
}

export const subscribeToCompareItems = (listener) => {
  if (typeof listener !== 'function' || typeof window === 'undefined') {
    return () => {}
  }

  const notify = () => {
    listener(getCompareItems())
  }

  const handleUpdateEvent = () => {
    notify()
  }

  const handleStorageEvent = (event) => {
    if (event.key === COMPARE_STORAGE_KEY) {
      notify()
    }
  }

  window.addEventListener(COMPARE_UPDATE_EVENT, handleUpdateEvent)
  window.addEventListener('storage', handleStorageEvent)

  return () => {
    window.removeEventListener(COMPARE_UPDATE_EVENT, handleUpdateEvent)
    window.removeEventListener('storage', handleStorageEvent)
  }
}
