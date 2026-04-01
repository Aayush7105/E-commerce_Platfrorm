import { useEffect, useState } from 'react'
import Header from './home/Header'
import HeroSection from './home/HeroSection'
import CategorySection from './home/CategorySection'
import ProductSection from './home/ProductSection'
import PromoSection from './home/PromoSection'
import Footer from './home/Footer'
import {
  navLinks,
  heroStats,
  collectionFilters,
  featuredCollections,
  footerColumns,
} from './home/homeData'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const DEFAULT_VISIBLE_PRODUCTS = 8

const buildProductsApiUrl = ({ searchTerm, selectedCategory, minPrice, maxPrice, onlyNew, sortOption }) => {
  const queryParams = new URLSearchParams()

  if (searchTerm) {
    queryParams.set('q', searchTerm)
  }

  if (selectedCategory && selectedCategory !== 'all') {
    queryParams.set('category', selectedCategory)
  }

  if (minPrice && !Number.isNaN(Number(minPrice))) {
    queryParams.set('minPrice', minPrice)
  }

  if (maxPrice && !Number.isNaN(Number(maxPrice))) {
    queryParams.set('maxPrice', maxPrice)
  }

  if (onlyNew) {
    queryParams.set('isNew', 'true')
  }

  if (sortOption) {
    queryParams.set('sort', sortOption)
  }

  const queryString = queryParams.toString()
  return `${API_BASE_URL}/api/products${queryString ? `?${queryString}` : ''}`
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [onlyNew, setOnlyNew] = useState(false)
  const [sortOption, setSortOption] = useState('newest')
  const [visibleProductsCount, setVisibleProductsCount] = useState(DEFAULT_VISIBLE_PRODUCTS)
  const [products, setProducts] = useState([])
  const [isProductsLoading, setIsProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')

  useEffect(() => {
    const debounceTimeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 300)

    return () => clearTimeout(debounceTimeoutId)
  }, [searchTerm])

  useEffect(() => {
    const controller = new AbortController()

    const fetchProducts = async () => {
      setIsProductsLoading(true)
      setProductsError('')

      try {
        const response = await fetch(
          buildProductsApiUrl({
            searchTerm: debouncedSearchTerm,
            selectedCategory,
            minPrice,
            maxPrice,
            onlyNew,
            sortOption,
          }),
          {
            signal: controller.signal,
          },
        )

        if (!response.ok) {
          let errorMessage = 'Unable to load products right now.'

          try {
            const errorPayload = await response.json()
            if (typeof errorPayload?.message === 'string' && errorPayload.message.trim()) {
              errorMessage = errorPayload.message
            }
          } catch {
            // Keep the default error message when server payload is not JSON.
          }

          throw new Error(errorMessage)
        }

        const productsPayload = await response.json()
        setProducts(Array.isArray(productsPayload) ? productsPayload : [])
      } catch (error) {
        if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError') {
          return
        }

        setProducts([])
        setProductsError(error instanceof Error ? error.message : 'Unable to load products right now.')
      } finally {
        if (!controller.signal.aborted) {
          setIsProductsLoading(false)
        }
      }
    }

    fetchProducts()

    return () => controller.abort()
  }, [debouncedSearchTerm, selectedCategory, minPrice, maxPrice, onlyNew, sortOption])

  useEffect(() => {
    setVisibleProductsCount(DEFAULT_VISIBLE_PRODUCTS)
  }, [debouncedSearchTerm, selectedCategory, minPrice, maxPrice, onlyNew, sortOption])

  const visibleProducts = products.slice(0, visibleProductsCount)
  const hasMoreProducts = visibleProducts.length < products.length

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setMinPrice('')
    setMaxPrice('')
    setOnlyNew(false)
    setSortOption('newest')
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased [font-family:'Poppins',sans-serif]">
      <Header links={navLinks} cartCount={0} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <HeroSection stats={heroStats} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-24 px-4 pb-20 pt-16 sm:px-8">
        <CategorySection filters={collectionFilters} collections={featuredCollections} />
        <ProductSection
          products={visibleProducts}
          totalProducts={products.length}
          isLoading={isProductsLoading}
          errorMessage={productsError}
          searchTerm={debouncedSearchTerm}
          categories={collectionFilters}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onlyNew={onlyNew}
          onOnlyNewChange={setOnlyNew}
          sortOption={sortOption}
          onSortChange={setSortOption}
          onClearFilters={handleClearFilters}
          hasMoreProducts={hasMoreProducts}
          onLoadMore={() => setVisibleProductsCount((currentValue) => currentValue + DEFAULT_VISIBLE_PRODUCTS)}
        />
        <PromoSection />
      </main>
      <Footer columns={footerColumns} />
    </div>
  )
}

export default HomePage
