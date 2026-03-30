function Header({ links, cartCount, searchScopes }) {
  return (
    <header className="header-shell">
      <div className="header-top">
        <a href="#" className="logo-block" aria-label="QuickCart home">
          <span className="logo-main">quickcart</span>
          <span className="logo-ext">.shop</span>
        </a>

        <button type="button" className="delivery-block">
          <span>Delivering to</span>
          <strong>Kolkata 700001</strong>
        </button>

        <form className="search-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="search-input" className="sr-only">
            Search products
          </label>
          <select aria-label="Search category">
            {searchScopes.map((scope) => (
              <option key={scope}>{scope}</option>
            ))}
          </select>
          <input
            id="search-input"
            type="search"
            placeholder="Search QuickCart"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <a href="#" className="header-link">
          <span>Hello, sign in</span>
          <strong>Account & Lists</strong>
        </a>
        <a href="#" className="header-link">
          <span>Returns</span>
          <strong>& Orders</strong>
        </a>
        <button type="button" className="cart-button">
          Cart ({cartCount})
        </button>
      </div>

      <nav aria-label="Primary" className="subnav">
        <a href="#" className="all-link">
          All
        </a>
        {links.map((link) => (
          <a key={link} href="#">
            {link}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Header
