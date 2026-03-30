function CategoryCard({ category }) {
  return (
    <article className="category-card">
      <div
        className="category-visual"
        style={{ backgroundColor: category.tone }}
        aria-hidden="true"
      >
        {category.name.split('|')[0].trim()}
      </div>
      <p className="category-name">{category.name}</p>
      <p>{category.description}</p>
      <small>{category.items} items</small>
      <a href="#">See more</a>
    </article>
  )
}

export default CategoryCard
