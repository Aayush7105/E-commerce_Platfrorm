import PageLayout from './PageLayout'

const faqs = [
  {
    question: 'How long does shipping take?',
    answer:
      'Standard shipping usually arrives within 3 to 5 business days. Express delivery options are available at checkout.',
  },
  {
    question: 'Can I return an item if it does not fit?',
    answer:
      'Yes. You can request a return within 14 days of delivery as long as the item is unused and in original condition.',
  },
  {
    question: 'Do you offer international delivery?',
    answer:
      'We currently ship to select countries. Shipping availability and rates are calculated automatically at checkout.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'Once your order is dispatched, we send a confirmation email with a tracking link so you can monitor delivery updates.',
  },
]

function FaqPage() {
  return (
    <PageLayout
      title="Frequently Asked Questions"
      subtitle="Quick answers to common questions about orders, delivery, and returns."
    >
      <section className="grid gap-5">
        {faqs.map((item) => (
          <article key={item.question} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 sm:p-7">
            <h2 className="m-0 text-[1.12rem] font-semibold">{item.question}</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc-300">{item.answer}</p>
          </article>
        ))}
      </section>
    </PageLayout>
  )
}

export default FaqPage
