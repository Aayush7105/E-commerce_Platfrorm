import Header from './home/Header'
import HeroSection from './home/HeroSection'
import CategorySection from './home/CategorySection'
import ProductSection from './home/ProductSection'
import PromoSection from './home/PromoSection'
import Footer from './home/Footer'
import {
  navLinks,
  searchScopes,
  storeStats,
  shopCategories,
  featuredProducts,
  quickDeals,
} from './home/homeData'
import './home/home-page.css'

function HomePage() {
  return (
    <div className="storefront">
      <Header links={navLinks} cartCount={2} searchScopes={searchScopes} />
      <main>
        <HeroSection stats={storeStats} />
        <CategorySection categories={shopCategories} />
        <ProductSection products={featuredProducts} />
        <PromoSection deals={quickDeals} />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
