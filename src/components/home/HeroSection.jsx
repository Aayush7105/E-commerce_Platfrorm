import StatList from './StatList'
import { FaArrowRight } from 'react-icons/fa'

function HeroSection({ stats }) {
  return (
    <section
      className="relative h-screen w-full overflow-hidden border-y border-white/10"
      aria-labelledby="hero-title"
    >
      <img
        src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1800&q=80"
        alt="Luxury hero"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[980px] flex-col items-center justify-center px-6 text-center sm:px-10">
        <span className="inline-flex items-center rounded-full border border-white/20 bg-zinc-900/75 px-5 py-2 text-[clamp(0.8rem,1.2vw,0.95rem)] text-zinc-200">
          Spring Collection 2024
        </span>
        <h1
          id="hero-title"
          className="mt-6 text-[clamp(2rem,5vw,4.4rem)] leading-[1.03] font-semibold tracking-[-0.02em]"
        >
          Elevate Your Style
        </h1>
        <p className="mt-4 max-w-[720px] text-[clamp(0.95rem,1.2vw,1.12rem)] leading-[1.6] text-zinc-300">
          Discover our curated collection of premium fashion and lifestyle
          products crafted for the modern individual.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-[clamp(0.9rem,1vw,1rem)] font-semibold text-black transition hover:bg-zinc-200"
          >
            Shop Now <FaArrowRight aria-hidden="true" className="text-[0.9rem]" />
          </button>
          <button
            type="button"
            className="rounded-2xl border border-white/35 bg-black/40 px-8 py-4 text-[clamp(0.9rem,1vw,1rem)] font-semibold text-white transition hover:bg-white/10"
          >
            Explore Collection
          </button>
        </div>

        <div className="mt-16 w-full border-t border-white/20 pt-8">
          <StatList stats={stats} />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
