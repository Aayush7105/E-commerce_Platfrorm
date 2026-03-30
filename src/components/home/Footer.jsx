import {
  FiFacebook,
  FiInstagram,
  FiMail,
  FiPhone,
  FiTwitter,
} from 'react-icons/fi'

function Footer({ columns }) {
  return (
    <footer className="border-t border-white/10 bg-[#121212]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-8">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 xl:grid-cols-4">
          <section>
            <h3 className="m-0 text-[clamp(1.7rem,3vw,2.6rem)] font-bold tracking-tight">LUXE</h3>
            <p className="mt-4 max-w-xs text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-zinc-400">
              Premium fashion and lifestyle products for the modern individual.
            </p>
            <div className="mt-6 flex items-center gap-4 text-zinc-300">
              <a href="#" aria-label="Instagram" className="transition hover:text-white">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="transition hover:text-white">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Facebook" className="transition hover:text-white">
                <FiFacebook className="h-5 w-5" />
              </a>
            </div>
          </section>

          {columns.map((column) => (
            <section key={column.title}>
              <h4 className="m-0 text-[clamp(1rem,1.2vw,1.2rem)] font-semibold">{column.title}</h4>
              <ul className="mt-4 grid list-none gap-3 p-0">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[clamp(0.9rem,1vw,1rem)] text-zinc-400 no-underline transition hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section>
            <h4 className="m-0 text-[clamp(1rem,1.2vw,1.2rem)] font-semibold">Support</h4>
            <div className="mt-4 grid gap-6">
              <div className="flex items-start gap-3">
                <FiMail className="mt-0.5 h-5 w-5 text-zinc-300" />
                <div>
                  <p className="m-0 text-[clamp(0.92rem,1vw,1rem)] font-semibold text-white">Email</p>
                  <a
                    href="mailto:support@luxe.com"
                    className="text-[clamp(0.9rem,1vw,1rem)] text-zinc-400 no-underline transition hover:text-white"
                  >
                    support@luxe.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="mt-0.5 h-5 w-5 text-zinc-300" />
                <div>
                  <p className="m-0 text-[clamp(0.92rem,1vw,1rem)] font-semibold text-white">Phone</p>
                  <a
                    href="tel:+1234567890"
                    className="text-[clamp(0.9rem,1vw,1rem)] text-zinc-400 no-underline transition hover:text-white"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-7 flex flex-col gap-4 text-[clamp(0.85rem,0.95vw,0.95rem)] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">(c) 2026 LUXE Store. All rights reserved.</p>
          <div className="flex flex-wrap gap-7">
            <a href="#" className="no-underline transition hover:text-zinc-300">
              Privacy Policy
            </a>
            <a href="#" className="no-underline transition hover:text-zinc-300">
              Terms of Service
            </a>
            <a href="#" className="no-underline transition hover:text-zinc-300">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
