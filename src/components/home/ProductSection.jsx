import ProductCard from './ProductCard'

function ProductSection({
  products,
  totalProducts,
  isLoading,
  errorMessage,
  searchTerm,
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onlyNew,
  onOnlyNewChange,
  sortOption,
  onSortChange,
  onClearFilters,
  hasMoreProducts,
  onLoadMore,
}) {
  const hasActiveSearch = Boolean(searchTerm.trim())
  const hasActiveFilters =
    hasActiveSearch || selectedCategory !== 'all' || minPrice.trim() || maxPrice.trim() || onlyNew

  return (
    <section aria-labelledby="featured-title">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2
            id="featured-title"
            className="m-0 text-[clamp(1.8rem,3.8vw,3.2rem)] leading-tight font-semibold tracking-[-0.02em]"
          >
            {hasActiveSearch ? 'Search Results' : 'New Arrivals'}
          </h2>
          <p className="mt-3 text-[0.9rem] text-zinc-400">
            {hasActiveSearch ? `Showing matches for "${searchTerm}".` : 'Fresh picks from the latest drop.'}{' '}
            {!isLoading ? `${totalProducts} result${totalProducts === 1 ? '' : 's'}.` : ''}
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        <label className="flex flex-col gap-2">
          <span className="text-[0.78rem] uppercase tracking-[0.12em] text-zinc-400">Category</span>
          <select
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-[0.9rem] text-white outline-none transition focus:border-white/30"
          >
            {categories.map((categoryItem) => (
              <option key={categoryItem.id} value={categoryItem.id}>
                {categoryItem.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[0.78rem] uppercase tracking-[0.12em] text-zinc-400">Sort</span>
          <select
            value={sortOption}
            onChange={(event) => onSortChange(event.target.value)}
            className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-[0.9rem] text-white outline-none transition focus:border-white/30"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Top Rated</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[0.78rem] uppercase tracking-[0.12em] text-zinc-400">Min Price</span>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => onMinPriceChange(event.target.value)}
            placeholder="0"
            className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-[0.9rem] text-white outline-none transition placeholder:text-zinc-500 focus:border-white/30"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[0.78rem] uppercase tracking-[0.12em] text-zinc-400">Max Price</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
            placeholder="500"
            className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-[0.9rem] text-white outline-none transition placeholder:text-zinc-500 focus:border-white/30"
          />
        </label>

        <label className="flex items-end pb-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-[0.9rem] text-white">
            <input
              type="checkbox"
              checked={onlyNew}
              onChange={(event) => onOnlyNewChange(event.target.checked)}
              className="h-4 w-4 accent-white"
            />
            New Arrivals Only
          </span>
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-2.5 text-[0.9rem] font-medium text-white transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="rounded-2xl border border-white/10 bg-zinc-950/70 px-5 py-8 text-center text-zinc-300">
          Searching products...
        </p>
      ) : null}

      {!isLoading && errorMessage ? (
        <p className="rounded-2xl border border-red-500/25 bg-red-950/30 px-5 py-8 text-center text-red-200">
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && !errorMessage && products.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-zinc-950/70 px-5 py-8 text-center text-zinc-300">
          {hasActiveSearch
            ? `No products found for "${searchTerm}". Try another keyword.`
            : 'No products available right now.'}
        </p>
      ) : null}

      {!isLoading && !errorMessage && products.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id ?? product._id} product={product} />
          ))}
        </div>
      ) : null}

      {!isLoading && !errorMessage && hasMoreProducts ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-2xl border border-zinc-700 px-9 py-3.5 text-[0.95rem] font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Load More
          </button>
        </div>
      ) : null}
    </section>
  )
}

export default ProductSection
