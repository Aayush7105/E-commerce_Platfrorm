import { useEffect, useState } from 'react'
import { FiColumns, FiHeart, FiMenu, FiSearch, FiShoppingBag, FiX } from 'react-icons/fi'
import { Link, NavLink } from 'react-router-dom'
import { getCompareItems, subscribeToCompareItems } from '../../utils/compare'
import { getWishlistItems, subscribeToWishlist } from '../../utils/wishlist'
import { useCart } from '../cart/useCart'

function Header({
  links,
  cartCount,
  searchTerm = '',
  onSearchChange = () => {},
  showSearch = true,
}) {
  const { openCart, totalQuantity } = useCart()
  const [wishlistItems, setWishlistItems] = useState(() => getWishlistItems())
  const [compareItems, setCompareItems] = useState(() => getCompareItems())
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const wishlistCount = wishlistItems.length
  const compareCount = compareItems.length
  const displayedCartCount = totalQuantity || cartCount

  useEffect(() => {
    return subscribeToWishlist((items) => {
      setWishlistItems(items)
    })
  }, [])

  useEffect(() => {
    return subscribeToCompareItems((items) => {
      setCompareItems(items)
    })
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = (event) => {
      if (event.matches) {
        setIsMobileMenuOpen(false)
      }
    }

    desktopQuery.addEventListener('change', closeOnDesktop)

    return () => {
      desktopQuery.removeEventListener('change', closeOnDesktop)
    }
  }, [])

  return (
    <>
      <header className="motion-header sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-8">
          <Link to="/" className="motion-icon-button text-[1.8rem] leading-none font-bold tracking-tight text-white no-underline">
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

          <div className="flex items-center gap-2 sm:gap-3">
            {showSearch ? (
              <label className="relative hidden md:block">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-[0.9rem] w-[0.9rem] -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search products"
                  aria-label="Search products"
                  className="w-48 rounded-xl border border-white/10 bg-zinc-900/90 py-2.5 pl-9 pr-3 text-[0.88rem] text-white outline-none transition placeholder:text-zinc-500 focus:scale-[1.02] focus:border-white/40 lg:w-64"
                />
              </label>
            ) : (
              <Link
                to="/collections"
                aria-label="Go to collections"
                className="motion-icon-button hidden rounded-md p-2 text-zinc-300 hover:bg-white/10 hover:text-white sm:inline-flex"
              >
                <FiSearch className="h-[1.1rem] w-[1.1rem]" />
              </Link>
            )}
            <Link
              to="/wishlist"
              aria-label="Go to wishlist"
              className="motion-icon-button relative rounded-md p-2 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <FiHeart className="h-[1.1rem] w-[1.1rem]" />
              {wishlistCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[0.72rem] font-bold text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <Link
              to="/compare"
              aria-label="Compare products"
              className="motion-icon-button relative rounded-md p-2 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <FiColumns className="h-[1.1rem] w-[1.1rem]" />
              {compareCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[0.72rem] font-bold text-white">
                  {compareCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="motion-button relative flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-black sm:px-4"
            >
              <FiShoppingBag className="h-[0.95rem] w-[0.95rem]" />
              <span className="hidden text-[1rem] font-medium sm:inline">Cart</span>
              {displayedCartCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[0.95rem] font-bold text-white">
                  {displayedCartCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
              className="motion-icon-button inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/90 text-white hover:bg-white/10 lg:hidden"
            >
              {isMobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsMobileMenuOpen(false)}
            className="motion-page absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="motion-mobile-drawer absolute right-0 top-0 flex h-full w-[min(88vw,24rem)] flex-col border-l border-white/10 bg-[#080808] p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[1.65rem] leading-none font-bold tracking-tight text-white no-underline"
              >
                LUXE
              </Link>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="motion-icon-button inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-white hover:bg-white/10"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {showSearch ? (
              <label className="relative mt-7 block">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => onSearchChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setIsMobileMenuOpen(false)
                    }
                  }}
                  placeholder="Search products"
                  aria-label="Search products"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 py-2.5 pl-11 pr-4 text-[0.95rem] text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40"
                />
              </label>
            ) : null}

            <nav className="mt-7 grid gap-2">
              {links.map((link, index) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `motion-fade-up rounded-2xl px-4 py-3 text-[1rem] font-semibold no-underline transition ${
                      isActive ? 'bg-white text-black' : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                    }`
                  }
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto grid gap-3 border-t border-white/10 pt-5">
              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="motion-button flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white no-underline hover:bg-zinc-800"
              >
                <span className="inline-flex items-center gap-3 font-semibold">
                  <FiHeart className="h-4 w-4" />
                  Wishlist
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-[0.8rem] font-bold text-black">
                  {wishlistCount}
                </span>
              </Link>
              <Link
                to="/compare"
                onClick={() => setIsMobileMenuOpen(false)}
                className="motion-button flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white no-underline hover:bg-zinc-800"
              >
                <span className="inline-flex items-center gap-3 font-semibold">
                  <FiColumns className="h-4 w-4" />
                  Compare
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-[0.8rem] font-bold text-black">
                  {compareCount}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  openCart()
                }}
                className="motion-button flex items-center justify-between rounded-2xl bg-white px-4 py-3 font-semibold text-black"
              >
                <span className="inline-flex items-center gap-3">
                  <FiShoppingBag className="h-4 w-4" />
                  Cart
                </span>
                <span>{displayedCartCount}</span>
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  )
}

export default Header
