import CategoryCard from './CategoryCard'

function CategorySection({ filters, collections }) {
  return (
    <section aria-labelledby="category-title">
      <div className="max-w-5xl">
        <h2
          id="category-title"
          className="m-0 text-[clamp(1.8rem,3.8vw,3.1rem)] leading-tight font-semibold tracking-[-0.02em]"
        >
          Featured Collections
        </h2>
        <p className="mt-4 max-w-4xl text-[clamp(0.92rem,1.08vw,1.05rem)] leading-relaxed text-zinc-400">
          Handpicked selection of our finest pieces, carefully curated for those
          who appreciate quality and style.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        {filters.map((filter, index) => (
          <button
            key={filter.id}
            type="button"
            className={`rounded-2xl px-5 py-2.5 text-[0.9rem] font-medium transition ${
              index === 0
                ? 'bg-white text-black'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {collections.map((item) => (
          <CategoryCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  )
}

export default CategorySection
