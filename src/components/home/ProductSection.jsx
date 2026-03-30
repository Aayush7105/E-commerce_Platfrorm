import ProductCard from './ProductCard'

function ProductSection({ products }) {
  return (
    <section className="section-block" aria-labelledby="featured-title">
      <div className="section-heading">
        <h2 id="featured-title">Best offers in Electronics & Home</h2>
        <a href="#">Explore all offers</a>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default ProductSection
