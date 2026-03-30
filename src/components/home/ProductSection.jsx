import ProductCard from './ProductCard'

function ProductSection({ products }) {
  return (
    <section aria-labelledby="featured-title">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2
          id="featured-title"
          className="m-0 text-[clamp(1.8rem,3.8vw,3.2rem)] leading-tight font-semibold tracking-[-0.02em]"
        >
          New Arrivals
        </h2>
        <a href="#" className="text-[0.9rem] text-zinc-300 no-underline transition hover:text-white">
          Explore More
        </a>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          className="rounded-2xl border border-zinc-700 px-9 py-3.5 text-[0.95rem] font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-900"
        >
          View All Products
        </button>
      </div>
    </section>
  )
}

export default ProductSection
