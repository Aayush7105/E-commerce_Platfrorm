import { useToast } from '../ui/useToast'

function PromoSection() {
  const { showToast } = useToast()

  const handleNewsletterSubmit = (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get('email') ?? '').trim()

    showToast({
      title: 'You are on the list',
      message: email ? `Style updates will go to ${email}.` : 'Style updates will land in your inbox.',
      type: 'success',
    })
    form.reset()
  }

  return (
    <section
      className="motion-glow-panel motion-fade-up rounded-[28px] border border-white/15 bg-gradient-to-r from-zinc-900 to-zinc-950 px-6 py-12 sm:px-10"
      aria-labelledby="newsletter-title"
    >
      <div className="relative max-w-4xl">
        <h2
          id="newsletter-title"
          className="m-0 text-[clamp(1.8rem,3.8vw,3.1rem)] leading-tight font-semibold tracking-[-0.02em]"
        >
          Subscribe to Our Newsletter
        </h2>
        <p className="mt-3 max-w-3xl text-[clamp(0.9rem,1vw,1.05rem)] leading-relaxed text-zinc-400">
          Get exclusive access to new collections, special offers, and style tips
          delivered to your inbox.
        </p>
      </div>

      <form
        className="motion-fade-up motion-delay-1 relative mt-8 flex w-full max-w-5xl flex-col gap-4 sm:flex-row"
        onSubmit={handleNewsletterSubmit}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Enter your email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          className="h-14 flex-1 rounded-2xl border border-white/20 bg-black px-5 text-[0.95rem] text-white placeholder:text-zinc-500 focus:border-white/40 focus:outline-none"
        />
        <button
          type="submit"
          className="motion-button h-14 rounded-2xl bg-white px-7 text-[0.95rem] font-semibold text-black hover:bg-zinc-200"
        >
          Subscribe
        </button>
      </form>
    </section>
  )
}

export default PromoSection
