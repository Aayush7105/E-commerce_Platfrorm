import Header from './home/Header'
import HeroSection from './home/HeroSection'
import CategorySection from './home/CategorySection'
import ProductSection from './home/ProductSection'
import PromoSection from './home/PromoSection'
import Footer from './home/Footer'
import {
  navLinks,
  heroStats,
  collectionFilters,
  featuredCollections,
  newArrivals,
  footerColumns,
} from './home/homeData'

function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased [font-family:'Poppins',sans-serif]">
      <Header links={navLinks} cartCount={0} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-24 px-4 pb-20 pt-6 sm:px-8">
        <HeroSection stats={heroStats} />
        <ProductSection products={newArrivals} />
        <CategorySection filters={collectionFilters} collections={featuredCollections} />
        <PromoSection />
      </main>
      <Footer columns={footerColumns} />
    </div>
  )
}

export default HomePage
