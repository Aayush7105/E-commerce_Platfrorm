import PageLayout from './PageLayout'

function ContactPage() {
  return (
    <PageLayout
      title="Contact Us"
      subtitle="Have a question about an order or product? Send us a message and our team will get back quickly."
    >
      <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <form className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-[0.9rem] text-zinc-300">First Name</span>
              <input
                type="text"
                placeholder="Ava"
                className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-[0.95rem] text-white outline-none transition placeholder:text-zinc-500 focus:border-white/35"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[0.9rem] text-zinc-300">Last Name</span>
              <input
                type="text"
                placeholder="Miller"
                className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-[0.95rem] text-white outline-none transition placeholder:text-zinc-500 focus:border-white/35"
              />
            </label>
          </div>

          <label className="mt-4 flex flex-col gap-2">
            <span className="text-[0.9rem] text-zinc-300">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-[0.95rem] text-white outline-none transition placeholder:text-zinc-500 focus:border-white/35"
            />
          </label>

          <label className="mt-4 flex flex-col gap-2">
            <span className="text-[0.9rem] text-zinc-300">Message</span>
            <textarea
              rows={6}
              placeholder="Tell us how we can help..."
              className="resize-y rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-[0.95rem] text-white outline-none transition placeholder:text-zinc-500 focus:border-white/35"
            />
          </label>

          <button
            type="button"
            className="mt-5 rounded-xl bg-white px-5 py-2.5 text-[0.95rem] font-semibold text-black transition hover:bg-zinc-200"
          >
            Send Message
          </button>
        </form>

        <aside className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
          <h2 className="m-0 text-[1.25rem] font-semibold">Support Details</h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc-300">
            We usually respond within one business day.
          </p>
          <div className="mt-6 grid gap-4">
            <div>
              <p className="m-0 text-[0.82rem] uppercase tracking-[0.14em] text-zinc-500">Email</p>
              <a href="mailto:support@luxe.com" className="mt-1 inline-block text-[1rem] text-white no-underline">
                support@luxe.com
              </a>
            </div>
            <div>
              <p className="m-0 text-[0.82rem] uppercase tracking-[0.14em] text-zinc-500">Phone</p>
              <a href="tel:+1234567890" className="mt-1 inline-block text-[1rem] text-white no-underline">
                +1 (234) 567-890
              </a>
            </div>
            <div>
              <p className="m-0 text-[0.82rem] uppercase tracking-[0.14em] text-zinc-500">Hours</p>
              <p className="mt-1 text-[1rem] text-zinc-200">Mon - Fri, 9:00 AM to 6:00 PM</p>
            </div>
          </div>
        </aside>
      </section>
    </PageLayout>
  )
}

export default ContactPage
