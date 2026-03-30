function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div
        className="product-image"
        style={{ backgroundColor: product.tint }}
        aria-hidden="true"
      >
        {product.label}
      </div>
      <div className="product-content">
        <small className="product-tag">{product.tag}</small>
        <h3>{product.name}</h3>
        <p className="price-row">
          <span className="deal-price">${product.price}</span>
          <span className="old-price">${product.oldPrice}</span>
        </p>
        <p className="rating-row">
          {product.rating}/5 rating ({product.reviews})
        </p>
        <p className="delivery-row">{product.delivery}</p>
        <button type="button" className="secondary-button">
          Add to cart
        </button>
      </div>
    </article>
  )
}

export default ProductCard
