import { FiHeart, FiSearch, FiShoppingBag } from 'react-icons/fi'
import { Link, NavLink } from 'react-router-dom'

function Header({
  links,
  cartCount,
  searchTerm = '',
  onSearchChange = () => {},
  showSearch = true,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-8">
        <Link to="/" className="text-[1.8rem] leading-none font-bold tracking-tight text-white no-underline">
          LUXE
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-[1rem] font-medium no-underline transition hover:text-zinc-300 ${
                  isActive ? 'text-white' : 'text-zinc-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {showSearch ? (
            <label className="relative block">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-[0.9rem] w-[0.9rem] -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search products"
                aria-label="Search products"
                className="w-32 rounded-xl border border-white/10 bg-zinc-900/90 py-2.5 pl-9 pr-3 text-[0.88rem] text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40 sm:w-48 lg:w-64"
              />
            </label>
          ) : (
            <Link
              to="/collections"
              aria-label="Go to collections"
              className="rounded-md p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              <FiSearch className="h-[1.1rem] w-[1.1rem]" />
            </Link>
          )}
          <button type="button" className="rounded-md p-2 transition hover:bg-white/10">
            <FiHeart className="h-[1.1rem] w-[1.1rem]" />
          </button>
          <button
            type="button"
            className="relative flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-black"
          >
            <FiShoppingBag className="h-[0.95rem] w-[0.95rem]" />
            <span className="text-[1rem] font-medium">Cart</span>
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[0.95rem] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
