import Header from '../home/Header'
import Footer from '../home/Footer'
import { footerColumns, navLinks } from '../home/homeData'

function PageLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased [font-family:'Poppins',sans-serif]">
      <Header links={navLinks} cartCount={0} showSearch={false} />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-16 sm:px-8">
        <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 sm:p-10">
          <p className="m-0 text-[0.8rem] uppercase tracking-[0.16em] text-zinc-400">LUXE</p>
          <h1 className="mt-4 text-[clamp(2rem,4.5vw,4rem)] leading-[1.03] font-semibold tracking-[-0.02em]">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-[clamp(0.95rem,1.2vw,1.08rem)] leading-relaxed text-zinc-300">
            {subtitle}
          </p>
        </section>

        <div className="mt-10">{children}</div>
      </main>
      <Footer columns={footerColumns} />
    </div>
  )
}

export default PageLayout
