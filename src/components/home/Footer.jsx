const footerColumns = [
  {
    title: 'Get to Know Us',
    links: ['About QuickCart', 'Careers', 'Press Releases', 'QuickCart Cares'],
  },
  {
    title: 'Connect with Us',
    links: ['Facebook', 'Twitter', 'Instagram', 'YouTube'],
  },
  {
    title: 'Make Money with Us',
    links: ['Sell on QuickCart', 'Advertise Your Products', 'Supply to QuickCart'],
  },
  {
    title: 'Let Us Help You',
    links: ['Your Account', 'Returns Centre', 'Help', '100% Purchase Protection'],
  },
]

function Footer() {
  return (
    <footer className="footer-shell">
      <button type="button" className="back-to-top">
        Back to top
      </button>
      <div className="footer-grid">
        {footerColumns.map((column) => (
          <section key={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="footer-copy">QuickCart demo storefront (c) 2026</p>
    </footer>
  )
}

export default Footer
