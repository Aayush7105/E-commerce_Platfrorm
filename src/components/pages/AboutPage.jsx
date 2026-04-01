import PageLayout from './PageLayout'

const brandValues = [
  {
    title: 'Curated Quality',
    description: 'Every item is handpicked for craftsmanship, durability, and timeless appeal.',
  },
  {
    title: 'Modern Elegance',
    description: 'We blend contemporary styling with luxurious detail to elevate daily wear.',
  },
  {
    title: 'Customer Trust',
    description: 'Transparent pricing, reliable support, and secure shopping are always our standard.',
  },
]

function AboutPage() {
  return (
    <PageLayout
      title="About LUXE"
      subtitle="LUXE is built for people who value clean design, premium materials, and effortless confidence."
    >
      <section className="grid gap-6 md:grid-cols-3">
        {brandValues.map((value) => (
          <article key={value.title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <h2 className="m-0 text-[1.2rem] font-semibold">{value.title}</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc-300">{value.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-7 sm:p-9">
        <h2 className="m-0 text-[1.5rem] font-semibold">Our Mission</h2>
        <p className="mt-4 max-w-4xl text-[1rem] leading-relaxed text-zinc-300">
          We create a refined shopping experience where premium fashion and lifestyle essentials are accessible,
          intentional, and exciting. From the first click to final delivery, our goal is to make luxury feel simple.
        </p>
      </section>
    </PageLayout>
  )
}

export default AboutPage
