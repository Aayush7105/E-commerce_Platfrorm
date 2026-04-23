import ProductCard from '../home/ProductCard'
import { featuredCollections } from '../home/homeData'
import PageLayout from './PageLayout'

const bestSellers = [...featuredCollections]
  .sort((firstItem, secondItem) => Number(secondItem.rating) - Number(firstItem.rating))
  .slice(0, 6)

function BestSellersPage() {
  return (
    <PageLayout
      title="Best Sellers"
      subtitle="The most-loved picks chosen by customers for quality, comfort, and standout style."
    >
      <section>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </PageLayout>
  )
}

export default BestSellersPage
