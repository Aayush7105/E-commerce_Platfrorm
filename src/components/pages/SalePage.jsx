import { Link } from 'react-router-dom'
import PageLayout from './PageLayout'

const saleHighlights = [
  {
    title: 'Wardrobe Essentials',
    discount: 'Up to 40% Off',
    description: 'Tailored shirts, premium denim, and elevated basics for everyday wear.',
  },
  {
    title: 'Designer Accessories',
    discount: 'Buy 2, Save 25%',
    description: 'Signature sunglasses, belts, and scarves crafted with refined detail.',
  },
  {
    title: 'Footwear Drop',
    discount: 'From $99',
    description: 'Limited-time pricing on premium sneakers, loafers, and formal shoes.',
  },
]

function SalePage() {
  return (
    <PageLayout
      title="Seasonal Sale"
      subtitle="Discover limited-time offers across top categories while stock lasts."
    >
      <section className="grid gap-6 md:grid-cols-3">
        {saleHighlights.map((highlight) => (
          <article key={highlight.title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <p className="m-0 text-[0.8rem] uppercase tracking-[0.12em] text-zinc-400">{highlight.title}</p>
            <h2 className="mt-3 text-[1.35rem] font-semibold text-white">{highlight.discount}</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc-300">{highlight.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-7 sm:p-9">
        <h2 className="m-0 text-[1.35rem] font-semibold">Shop Sale Picks</h2>
        <p className="mt-3 max-w-3xl text-[0.98rem] leading-relaxed text-zinc-300">
          New deals are refreshed weekly. Browse full collections or jump straight to our newest markdowns.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/collections"
            className="rounded-xl bg-white px-5 py-2.5 text-[0.95rem] font-semibold text-black no-underline transition hover:bg-zinc-200"
          >
            View Collections
          </Link>
          <Link
            to="/new-arrivals"
            className="rounded-xl border border-white/25 px-5 py-2.5 text-[0.95rem] font-semibold text-white no-underline transition hover:border-white/45"
          >
            New Arrivals
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}

export default SalePage
