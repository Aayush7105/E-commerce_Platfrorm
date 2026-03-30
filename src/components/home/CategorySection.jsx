import CategoryCard from './CategoryCard'

function CategorySection({ categories }) {
  return (
    <section className="section-block" aria-labelledby="category-title">
      <div className="section-heading">
        <h2 id="category-title">Pick up where you left off</h2>
        <a href="#">View browsing history</a>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </section>
  )
}

export default CategorySection
