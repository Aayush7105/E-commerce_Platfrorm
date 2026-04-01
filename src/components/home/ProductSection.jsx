import ProductCard from './ProductCard'

function ProductSection({ products, isLoading, errorMessage, searchTerm }) {
  const hasActiveSearch = Boolean(searchTerm.trim())

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
            {hasActiveSearch ? `Showing matches for "${searchTerm}".` : 'Fresh picks from the latest drop.'}
          </p>
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
    </section>
  )
}

export default ProductSection
