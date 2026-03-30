import { FiHeart, FiSearch, FiShoppingBag } from 'react-icons/fi'

function Header({ links, cartCount }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-4 sm:px-8">
        <a href="#" className="text-[1.8rem] leading-none font-bold tracking-tight text-white no-underline">
          LUXE
        </a>

        <nav className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[1rem] font-medium text-white no-underline transition hover:text-zinc-300"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button type="button" className="rounded-md p-2 transition hover:bg-white/10">
            <FiSearch className="h-[1.1rem] w-[1.1rem]" />
          </button>
          <button type="button" className="rounded-md p-2 transition hover:bg-white/10">
            <FiHeart className="h-[1.1rem] w-[1.1rem]" />
          </button>
          <button
            type="button"
            className="relative flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-black"
          >
            <FiShoppingBag className="h-[0.95rem] w-[0.95rem]" />
            <span className="text-[1rem] font-medium">Cart</span>
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[0.95rem] font-bold text-white">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
