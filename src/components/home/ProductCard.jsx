function ProductCard({ product }) {
  return (
    <article>
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
        <img
          src={product.image}
          alt={product.name}
          className="h-[330px] w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        {product.isNew && (
          <span className="absolute right-4 top-4 rounded-full bg-[#ff4d4d] px-3 py-1 text-[0.82rem] font-semibold text-white">
            New
          </span>
        )}
      </div>

      <p className="mt-3.5 text-[0.78rem] uppercase tracking-[0.14em] text-zinc-400">
        {product.category}
      </p>
      <h3 className="mt-1.5 text-[clamp(1.05rem,1.2vw,1.3rem)] leading-tight font-semibold">{product.name}</h3>
      <p className="mt-2.5 flex items-center gap-2 text-[0.88rem] text-zinc-300">
        <span className="text-yellow-400">*****</span>
        <span>({product.rating})</span>
      </p>
      <p className="mt-3 text-[clamp(1.3rem,1.6vw,1.7rem)] leading-none font-semibold">${product.price}</p>
    </article>
  )
}

export default ProductCard
