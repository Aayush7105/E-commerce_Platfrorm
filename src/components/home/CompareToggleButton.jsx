import { useEffect, useState } from 'react'
import { FiColumns } from 'react-icons/fi'
import { getCompareItems, subscribeToCompareItems, toggleCompareItem } from '../../utils/compare'
import { useToast } from '../ui/useToast'

const getProductId = (product) => {
  if (!product || typeof product !== 'object') {
    return ''
  }

  const rawId = product._id ?? product.id
  return rawId === undefined || rawId === null ? '' : String(rawId)
}

function CompareToggleButton({ product, className = '' }) {
  const productId = getProductId(product)
  const { showToast } = useToast()
  const [compareItems, setCompareItems] = useState(() => getCompareItems())
  const isCompared = productId ? compareItems.some((item) => item.id === productId) : false

  useEffect(() => {
    return subscribeToCompareItems((items) => {
      setCompareItems(items)
    })
  }, [])

  const handleCompareToggle = () => {
    if (!productId) {
      return
    }

    const { items, isCompared: nextIsCompared, limitReached } = toggleCompareItem(product)
    setCompareItems(items)

    if (limitReached) {
      showToast({
        title: 'Compare list is full',
        message: 'Remove an item before adding another product.',
        type: 'info',
      })
      return
    }

    showToast({
      title: nextIsCompared ? 'Added to compare' : 'Removed from compare',
      message:
        typeof product?.name === 'string' && product.name.trim()
          ? product.name
          : 'Your compare list has been updated.',
      type: nextIsCompared ? 'success' : 'info',
    })
  }

  return (
    <button
      type="button"
      onClick={handleCompareToggle}
      aria-label={isCompared ? 'Remove from compare' : 'Add to compare'}
      aria-pressed={isCompared}
      title={isCompared ? 'Remove from compare' : 'Add to compare'}
      className={`motion-icon-button inline-flex items-center justify-center border ${
        isCompared
          ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30'
          : 'border-white/15 bg-zinc-900 text-white hover:border-white/35 hover:bg-zinc-800'
      } ${className}`}
    >
      <FiColumns className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}

export default CompareToggleButton
